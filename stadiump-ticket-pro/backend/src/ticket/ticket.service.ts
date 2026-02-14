import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TicketService {
  constructor(private jwtService: JwtService) {}

  async generateQRPayload(ticketId: number, orderId: number): Promise<string> {
    const payload = { ticket_id: ticketId, order_id: orderId, exp: Math.floor(Date.now() / 1000) + 86400 * 365 };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'change-me',
      expiresIn: '365d',
    });
  }
}
