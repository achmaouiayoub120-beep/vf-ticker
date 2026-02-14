import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { OrdersService } from '../orders/orders.service';
import { RedisService } from '../redis/redis.service';

const IDEMPOTENCY_PREFIX = 'stripe:event:';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private ordersService: OrdersService,
    private redis: RedisService,
  ) {
    const key = process.env.STRIPE_SECRET_KEY;
    this.stripe = new Stripe(key || 'sk_test_placeholder', { apiVersion: '2023-10-16' });
  }

  getStripe(): Stripe {
    return this.stripe;
  }

  async createPaymentIntent(orderId: number, amountCents: number, idempotencyKey: string) {
    return this.stripe.paymentIntents.create(
      {
        amount: Math.round(amountCents),
        currency: 'mad',
        metadata: { orderId: String(orderId) },
        automatic_payment_methods: { enabled: true },
      },
      { idempotencyKey },
    );
  }

  async handleWebhook(payload: Buffer, signature: string): Promise<{ received: boolean }> {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) return { received: false };
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (err) {
      throw new Error('Webhook signature verification failed');
    }
    const idempotencyKey = `${IDEMPOTENCY_PREFIX}${event.id}`;
    const seen = await this.redis.get(idempotencyKey);
    if (seen) return { received: true };
    await this.redis.set(idempotencyKey, '1', 86400 * 7);

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = pi.metadata?.orderId ? parseInt(pi.metadata.orderId, 10) : null;
      if (orderId) await this.ordersService.markOrderPaid(orderId, pi.id);
    }
    return { received: true };
  }
}
