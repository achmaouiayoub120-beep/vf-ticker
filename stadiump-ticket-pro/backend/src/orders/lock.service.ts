import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { RedisService } from '../redis/redis.service';
import { Match } from '../entities/match.entity';
import { Seat } from '../entities/seat.entity';
import { SeatReservation } from '../entities/seat-reservation.entity';

const LOCK_TTL_MS = (parseInt(process.env.SEAT_LOCK_TTL || '300', 10) * 1000);
const LOCK_PREFIX = 'lock:seat:';

@Injectable()
export class LockService {
  constructor(
    @InjectRepository(Seat) private seatRepo: Repository<Seat>,
    @InjectRepository(SeatReservation) private reservationRepo: Repository<SeatReservation>,
    @InjectRepository(Match) private matchRepo: Repository<Match>,
    private redis: RedisService,
  ) {}

  async acquireLock(userId: number, matchId: number, seatIds: number[]): Promise<{ lockToken: string; expiresAt: Date }> {
    if (!seatIds.length) throw new BadRequestException('No seats selected');
    const lockToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + LOCK_TTL_MS);

    const keys = seatIds.map((id) => `${LOCK_PREFIX}${id}`);
    for (const id of seatIds) {
      const acquired = await this.redis.setNX(`${LOCK_PREFIX}${id}`, lockToken, LOCK_TTL_MS);
      if (!acquired) {
        await this.redis.delMany(keys.filter((_, i) => seatIds[i] !== id));
        throw new BadRequestException(`Seat ${id} is already locked`);
      }
    }

    const match = await this.matchRepo.findOne({ where: { id: matchId } });
    if (!match) {
      await this.redis.delMany(keys);
      throw new BadRequestException('Match not found');
    }
    const queryRunner = this.seatRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const seats = await queryRunner.manager
        .createQueryBuilder(Seat, 's')
        .setLock('pessimistic_write')
        .where('s.id IN (:...ids)', { ids: seatIds })
        .getMany();
      const allSameStadium = seats.every((s) => s.stadium_id === match.stadium_id);
      const allAvailable = seats.every((s) => s.status === 'available');
      if (!allSameStadium || !allAvailable || seats.length !== seatIds.length) {
        await queryRunner.rollbackTransaction();
        await this.redis.delMany(keys);
        throw new BadRequestException('One or more seats are not available');
      }
      const stadiumId = seats[0]?.stadium_id;
      if (!stadiumId) throw new BadRequestException('Invalid seats');
      for (const seat of seats) {
        await queryRunner.manager.update(Seat, { id: seat.id }, { status: 'reserved', version: seat.version + 1 });
        await queryRunner.manager.insert(SeatReservation, {
          lock_token: lockToken,
          match_id: matchId,
          seat_id: seat.id,
          user_id: userId,
          expires_at: expiresAt,
        });
      }
      await queryRunner.commitTransaction();
      return { lockToken, expiresAt };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await this.redis.delMany(keys);
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async releaseLock(lockToken: string): Promise<void> {
    const reservations = await this.reservationRepo.find({ where: { lock_token: lockToken }, relations: ['seat'] });
    for (const r of reservations) {
      await this.redis.del(`${LOCK_PREFIX}${r.seat_id}`);
      await this.seatRepo.update({ id: r.seat_id }, { status: 'available' });
      await this.reservationRepo.delete({ id: r.id });
    }
  }

  async purgeExpiredReservations(): Promise<number> {
    const expired = await this.reservationRepo
      .createQueryBuilder('r')
      .where('r.expires_at < :now', { now: new Date() })
      .getMany();
    let count = 0;
    for (const r of expired) {
      await this.redis.del(`${LOCK_PREFIX}${r.seat_id}`);
      await this.seatRepo.update({ id: r.seat_id }, { status: 'available' });
      await this.reservationRepo.delete({ id: r.id });
      count++;
    }
    return count;
  }

  async validateLock(lockToken: string): Promise<{ seatIds: number[]; matchId: number } | null> {
    const reservations = await this.reservationRepo.find({
      where: { lock_token: lockToken },
      relations: ['seat'],
    });
    if (!reservations.length) return null;
    if (reservations.some((r) => new Date(r.expires_at) < new Date())) return null;
    const seatIds = reservations.map((r) => r.seat_id);
    const matchId = reservations[0].match_id;
    return { seatIds, matchId };
  }
}
