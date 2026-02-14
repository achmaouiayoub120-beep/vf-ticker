import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LockService } from './lock.service';

@Injectable()
export class ExpirationJob {
  constructor(private lockService: LockService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async purgeExpired() {
    const count = await this.lockService.purgeExpiredReservations();
    if (count > 0) {
      console.log(`Purged ${count} expired seat reservations`);
    }
  }
}
