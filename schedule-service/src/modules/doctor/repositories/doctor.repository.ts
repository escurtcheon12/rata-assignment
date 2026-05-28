import { Injectable } from '@nestjs/common';
import { IDoctorRepository } from './doctor.repository.interface';
import { DBConfig } from '../../../config/db.config';
import { Doctor } from '@prisma/client';

@Injectable()
export class DoctorRepository implements IDoctorRepository {
  constructor(private readonly dbConfig: DBConfig) {}

  async create(data: { name: string }): Promise<Doctor> {
    return this.dbConfig.doctor.create({ data });
  }

  async findById(id: string): Promise<Doctor | null> {
    return this.dbConfig.doctor.findUnique({ where: { id } });
  }

  async findAll(page: number, pageSize: number): Promise<{ doctors: Doctor[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const [doctors, total] = await Promise.all([
      this.dbConfig.doctor.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.dbConfig.doctor.count(),
    ]);
    return { doctors, total };
  }

  async update(id: string, data: { name?: string }): Promise<Doctor> {
    return this.dbConfig.doctor.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Doctor> {
    return this.dbConfig.doctor.delete({ where: { id } });
  }
}