import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Application } from '../applications/applications.entity';
import { Photo } from '../photos/photo.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  service_id: number;

  @Column({ nullable: true }) // ⛑ Временно делаем user_id nullable
  user_id: number;

  @OneToOne(() => User, (user) => user.service, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  service_name: string;

  @Column({ type: 'text' })
  about: string;

  @Column()
  city: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'simple-array' })
  works: string[];

  @Column()
  working_days: string;

  @Column()
  time_start: string;

  @Column()
  time_end: string;

  @Column({ type: 'int' })
  daily_limit: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Application, (application) => application.service, {
    cascade: true,
  })
  applications: Application[];

  @OneToMany(() => Photo, (photo) => photo.service)
  photos: Photo[];
}
