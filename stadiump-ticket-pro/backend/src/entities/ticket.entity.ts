import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Match } from './match.entity';
import { Seat } from './seat.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @ManyToOne(() => Order, (o) => o.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  match_id: number;

  @ManyToOne(() => Match, (m) => m.tickets)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column()
  seat_id: number;

  @ManyToOne(() => Seat, (s) => s.tickets)
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @Column({ type: 'text', nullable: true })
  qr_code: string;

  @Column({ length: 20, default: 'issued' })
  status: string;
}
