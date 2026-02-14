import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Match } from './match.entity';
import { SeatZone } from './seat-zone.entity';
import { Seat } from './seat.entity';

@Entity('stadiums')
export class Stadium {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  city: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column({ type: 'jsonb', nullable: true })
  meta: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @OneToMany(() => Match, (m) => m.stadium)
  matches: Match[];

  @OneToMany(() => SeatZone, (z) => z.stadium)
  zones: SeatZone[];

  @OneToMany(() => Seat, (s) => s.stadium)
  seats: Seat[];
}
