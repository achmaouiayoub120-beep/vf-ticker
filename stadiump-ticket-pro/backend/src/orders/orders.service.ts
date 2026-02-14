import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Seat } from '../entities/seat.entity';
import { Ticket } from '../entities/ticket.entity';
import { Match } from '../entities/match.entity';
import { SeatZone } from '../entities/seat-zone.entity';
import { LockService } from './lock.service';
import { TicketService } from '../ticket/ticket.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Seat) private seatRepo: Repository<Seat>,
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
    @InjectRepository(Match) private matchRepo: Repository<Match>,
    @InjectRepository(SeatZone) private zoneRepo: Repository<SeatZone>,
    private lockService: LockService,
    private ticketService: TicketService,
  ) {}

  async checkout(userId: number, lockToken: string) {
    const validated = await this.lockService.validateLock(lockToken);
    if (!validated) throw new BadRequestException('Invalid or expired lock');
    const { seatIds, matchId } = validated;
    const match = await this.matchRepo.findOne({ where: { id: matchId } });
    if (!match) throw new BadRequestException('Match not found');
    const seats = await this.seatRepo.find({ where: { id: In(seatIds) }, relations: ['zone'] });
    if (seats.length !== seatIds.length) throw new BadRequestException('Seats not found');
    const basePrice = Number(match.base_price);
    let total = 0;
    for (const s of seats) {
      const mult = Number(s.zone?.price_multiplier ?? 1);
      total += basePrice * mult;
    }
    total = Math.round(total * 100) / 100;
    const order = this.orderRepo.create({
      user_id: userId,
      total,
      payment_status: 'pending',
      lock_token: lockToken,
    });
    await this.orderRepo.save(order);
    for (const seat of seats) {
      await this.ticketRepo.save(
        this.ticketRepo.create({
          order_id: order.id,
          match_id: matchId,
          seat_id: seat.id,
          status: 'pending',
        }),
      );
    }
    return { orderId: order.id, total, currency: 'mad' };
  }

  async markOrderPaid(orderId: number, stripePaymentIntentId: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId }, relations: ['tickets'] });
    if (!order) return;
    await this.orderRepo.update({ id: orderId }, { payment_status: 'paid', stripe_payment_intent_id: stripePaymentIntentId });
    for (const t of order.tickets) {
      await this.seatRepo.update({ id: t.seat_id }, { status: 'sold' });
      const ticket = await this.ticketRepo.findOne({ where: { id: t.id }, relations: ['match', 'seat', 'seat.zone'] });
      if (ticket) {
        const qrPayload = await this.ticketService.generateQRPayload(ticket.id, order.id);
        await this.ticketRepo.update({ id: ticket.id }, { qr_code: qrPayload, status: 'issued' });
      }
    }
    if (order.lock_token) await this.lockService.releaseLock(order.lock_token);
  }

  async getOrderForPaymentIntent(orderId: number) {
    return this.orderRepo.findOne({ where: { id: orderId }, relations: ['user', 'tickets'] });
  }
}

