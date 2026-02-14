import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { Match } from '../entities/match.entity';
import { Stadium } from '../entities/stadium.entity';
import { Seat } from '../entities/seat.entity';
import { SeatZone } from '../entities/seat-zone.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Stadium, Seat, SeatZone]),
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
