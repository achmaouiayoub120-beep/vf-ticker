import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../entities/match.entity';
import { Seat } from '../entities/seat.entity';
import { SeatZone } from '../entities/seat-zone.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match) private matchRepo: Repository<Match>,
    @InjectRepository(Seat) private seatRepo: Repository<Seat>,
    @InjectRepository(SeatZone) private zoneRepo: Repository<SeatZone>,
  ) {}

  async findAll(date?: string, stadiumId?: number) {
    const qb = this.matchRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.stadium', 'stadium')
      .orderBy('m.match_date', 'ASC');
    if (date) {
      qb.andWhere("DATE(m.match_date AT TIME ZONE 'UTC') = :date", { date });
    }
    if (stadiumId) {
      qb.andWhere('m.stadium_id = :stadiumId', { stadiumId });
    }
    const matches = await qb.getMany();
    const withAvailability = await Promise.all(
      matches.map(async (m) => {
        const available = await this.seatRepo.count({ where: { stadium_id: m.stadium_id, status: 'available' } });
        const reserved = await this.seatRepo.count({ where: { stadium_id: m.stadium_id, status: 'reserved' } });
        const sold = await this.seatRepo.count({ where: { stadium_id: m.stadium_id, status: 'sold' } });
        return {
          ...m,
          availability: { available, reserved, sold, total: available + reserved + sold },
        };
      }),
    );
    return withAvailability;
  }

  async findOne(id: number) {
    const match = await this.matchRepo.findOne({
      where: { id },
      relations: ['stadium'],
    });
    if (!match) return null;
    return match;
  }

  async getSeatsByMatch(matchId: number) {
    const match = await this.matchRepo.findOne({ where: { id: matchId }, relations: ['stadium'] });
    if (!match) return null;
    const seats = await this.seatRepo.find({
      where: { stadium_id: match.stadium_id },
      relations: ['zone'],
      order: { zone_id: 'ASC', row: 'ASC', number: 'ASC' },
    });
    const zones = await this.zoneRepo.find({ where: { stadium_id: match.stadium_id }, order: { id: 'ASC' } });
    const basePrice = Number(match.base_price);
    return {
      match: { id: match.id, home_team: match.home_team, away_team: match.away_team, match_date: match.match_date, base_price: basePrice },
      zones: zones.map((z) => ({ id: z.id, name: z.name, price_multiplier: Number(z.price_multiplier) })),
      seats: seats.map((s) => ({
        id: s.id,
        zone_id: s.zone_id,
        row: s.row,
        number: s.number,
        status: s.status,
        price: Math.round(basePrice * Number(s.zone?.price_multiplier ?? 1) * 100) / 100,
      })),
    };
  }
}
