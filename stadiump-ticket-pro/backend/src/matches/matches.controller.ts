import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('api/matches')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Get()
  async list(
    @Query('date') date?: string,
    @Query('stadium') stadium?: string,
  ) {
    const stadiumId = stadium ? parseInt(stadium, 10) : undefined;
    return this.matchesService.findAll(date, stadiumId);
  }

  @Get(':id')
  async one(@Param('id', ParseIntPipe) id: number) {
    return this.matchesService.findOne(id);
  }

  @Get(':id/seats')
  async seats(@Param('id', ParseIntPipe) id: number) {
    return this.matchesService.getSeatsByMatch(id);
  }
}
