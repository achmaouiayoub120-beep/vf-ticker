import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { LockService } from './lock.service';
import { ExpirationJob } from './expiration.job';
import { Order } from '../entities/order.entity';
import { Seat } from '../entities/seat.entity';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { Match } from '../entities/match.entity';
import { SeatZone } from '../entities/seat-zone.entity';
import { Ticket } from '../entities/ticket.entity';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Seat, SeatReservation, Match, SeatZone, Ticket]),
    TicketModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, LockService, ExpirationJob],
  exports: [OrdersService, LockService],
})
export class OrdersModule {}
