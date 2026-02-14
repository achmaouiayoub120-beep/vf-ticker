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
import { Ticket } from './ticket.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stadium_id: number;

  @ManyToOne(() => Stadium, (s) => s.matches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stadium_id' })
  stadium: Stadium;

  @Column({ type: 'text', nullable: true })
  home_team: string;

  @Column({ type: 'text', nullable: true })
  away_team: string;

  @Column({ type: 'timestamptz' })
  match_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_price: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @OneToMany(() => Ticket, (t) => t.match)
  tickets: Ticket[];
}
