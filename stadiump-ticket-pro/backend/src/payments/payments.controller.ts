import { Body, Controller, Post, Req, Headers, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('api/payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private ordersService: OrdersService,
  ) {}

  @Post('webhook')
  async webhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody ?? req.body;
    const payload = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(JSON.stringify(rawBody || {}));
    return this.paymentsService.handleWebhook(payload, signature || '');
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(@CurrentUser() user: User, @Body() body: { lockToken: string }) {
    const { orderId, total } = await this.ordersService.checkout(user.id, body.lockToken);
    const amountCents = Math.round(Number(total) * 100);
    const idempotencyKey = `order-${orderId}-${Date.now()}`;
    const pi = await this.paymentsService.createPaymentIntent(orderId, amountCents, idempotencyKey);
    return { clientSecret: pi.client_secret, orderId };
  }
}
