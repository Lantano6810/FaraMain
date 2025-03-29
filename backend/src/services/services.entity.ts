import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Application } from '../applications/applications.entity'; // ✅ Импортируем Application
import { Photo } from '../photos/photo.entity';


@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    service_id: number;

    @OneToOne(() => User, (user) => user.service, { onDelete: 'CASCADE' }) // Связь с User
    @JoinColumn({ name: 'user_id' }) // Внешний ключ в таблице Service
    user: User;

    @Column()
    service_name: string;

    @Column({ type: 'text' })
    about: string;

    @Column()
    city: string;

    @Column({ type: 'text', nullable: true }) // Новый столбец для адреса
    address: string;

    @Column({ type: 'simple-array' }) // Массив строк
    works: string[];

    @Column()
    working_days: string; // Просто строка (например, "Monday,Tuesday")

    @Column()
    time_start: string; // Начало рабочего дня (09:00)

    @Column()
    time_end: string; // Конец рабочего дня (18:00)

    @Column({ type: 'int' })
    daily_limit: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    // ✅ Добавляем связь OneToMany (Один сервис - много заявок)
    @OneToMany(() => Application, (application) => application.service, { cascade: true })
    applications: Application[];

    @OneToMany(() => Photo, (photo) => photo.service)
    photos: Photo[];

}