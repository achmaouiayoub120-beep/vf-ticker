import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TicketService } from './ticket.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'change-me',
      signOptions: { expiresIn: '365d' },
    }),
  ],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
