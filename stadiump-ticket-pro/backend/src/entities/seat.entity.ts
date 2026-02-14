import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Stadium } from './stadium.entity';
import { SeatZone } from './seat-zone.entity';
import { Ticket } from './ticket.entity';
import { SeatReservation } from './seat-reservation.entity';

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stadium_id: number;

  @ManyToOne(() => Stadium, (s) => s.seats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stadium_id' })
  stadium: Stadium;

  @Column()
  zone_id: number;

  @ManyToOne(() => SeatZone, (z) => z.seats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zone_id' })
  zone: SeatZone;

  @Column({ length: 3, nullable: true })
  row: string;

  @Column({ type: 'int', nullable: true })
  number: number;

  @Column({ length: 20, default: 'available' })
  status: string;

  @Column({ type: 'int', default: 0 })
  version: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @OneToMany(() => Ticket, (t) => t.seat)
  tickets: Ticket[];

  @OneToMany(() => SeatReservation, (r) => r.seat)
  reservations: SeatReservation[];
}
