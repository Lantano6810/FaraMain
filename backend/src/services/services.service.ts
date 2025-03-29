import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './services.entity';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private serviceRepository: Repository<Service>,
    ) {}

    // 🔹 Создание нового сервиса
    async create(serviceData: CreateServiceDto): Promise<Service> {
        const newService = this.serviceRepository.create({
            ...serviceData,
            user: { id: serviceData.user_id }, // Устанавливаем user_id вручную
        });

        return await this.serviceRepository.save(newService);
    }

    // 🔹 Получение всех сервисов
    async findAll(): Promise<Service[]> {
        return this.serviceRepository.find({ relations: ['user'] });
    }

    // 🔹 Получение сервиса по ID
    async findOne(id: number): Promise<Service> {
        const service = await this.serviceRepository.findOne({
            where: { service_id: id },
            relations: ['user']
        });
        if (!service) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }
        return service;
    }

    // 🔹 Получение сервиса по user_id
    async findByUserId(userId: number): Promise<Service | null> {
        const service = await this.serviceRepository.findOne({
            where: { user: { id: userId } }, // Фильтр по user_id
            relations: ['user'], // Загружаем связь с пользователем
        });

        if (!service) {
            throw new NotFoundException(`Service for user ID ${userId} not found`);
        }

        return service;
    }

    // 🔹 Обновление сервиса
    async update(id: number, updateData: Partial<Service>): Promise<Service> {
        await this.serviceRepository.update(id, updateData);
        return this.findOne(id);
    }

    // 🔹 Удаление сервиса
    async remove(id: number): Promise<void> {
        const service = await this.findOne(id);
        if (!service) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }
        await this.serviceRepository.delete(id);
    }
}