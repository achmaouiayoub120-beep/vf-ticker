import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LockService } from './lock.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../entities/user.entity';
import { LockDto } from './dto/lock.dto';

@Controller('api/orders')
export class OrdersController {
  constructor(private lockService: LockService) {}

  @Post('lock')
  @UseGuards(JwtAuthGuard)
  async lock(@CurrentUser() user: User, @Body() dto: LockDto) {
    return this.lockService.acquireLock(user.id, dto.matchId, dto.seats);
  }
}
