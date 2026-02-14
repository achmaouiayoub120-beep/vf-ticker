import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Stadium } from './stadium.entity';
import { Seat } from './seat.entity';

@Entity('seat_zones')
export class SeatZone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stadium_id: number;

  @ManyToOne(() => Stadium, (s) => s.zones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stadium_id' })
  stadium: Stadium;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 1.0 })
  price_multiplier: number;

  @OneToMany(() => Seat, (s) => s.zone)
  seats: Seat[];
}
