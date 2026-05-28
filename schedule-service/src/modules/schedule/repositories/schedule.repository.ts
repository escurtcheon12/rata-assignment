import { Injectable } from '@nestjs/common';
import { IScheduleRepository, ScheduleFilter } from './schedule.repository.interface';
import { DBConfig } from '../../../config/db.config';
import { Schedule } from '@prisma/client';

@Injectable()
export class ScheduleRepository implements IScheduleRepository {
  constructor(private readonly dbConfig: DBConfig) {}

  async create(data: {
    objective: string;
    customerId: string;
    doctorId: string;
    scheduledAt: Date;
  }): Promise<Schedule> {
    return this.dbConfig.schedule.create({ data });
  }

  async findById(id: string): Promise<Schedule | null> {
    return this.dbConfig.schedule.findUnique({ where: { id } });
  }

  async findAll(
    page: number,
    pageSize: number,
    filter?: ScheduleFilter,
  ): Promise<{ schedules: Schedule[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (filter?.customerId) {
      where.customerId = filter.customerId;
    }
    if (filter?.doctorId) {
      where.doctorId = filter.doctorId;
    }
    if (filter?.scheduledFrom || filter?.scheduledTo) {
      where.scheduledAt = {};
      if (filter.scheduledFrom) {
        where.scheduledAt.gte = filter.scheduledFrom;
      }
      if (filter.scheduledTo) {
        where.scheduledAt.lte = filter.scheduledTo;
      }
    }

    const [schedules, total] = await Promise.all([
      this.dbConfig.schedule.findMany({
        skip,
        take: pageSize,
        where,
        orderBy: { scheduledAt: 'desc' },
      }),
      this.dbConfig.schedule.count({ where }),
    ]);
    return { schedules, total };
  }

  async findByDoctorAndTime(doctorId: string, scheduledAt: Date): Promise<Schedule | null> {
    const timeRange = 30 * 60 * 1000;
    const startTime = new Date(scheduledAt.getTime() - timeRange);
    const endTime = new Date(scheduledAt.getTime() + timeRange);

    const schedules = await this.dbConfig.schedule.findMany({
      where: {
        doctorId,
        scheduledAt: {
          gte: startTime,
          lte: endTime,
        },
      },
    });

    return schedules.length > 0 ? schedules[0] : null;
  }

  async delete(id: string): Promise<Schedule> {
    return this.dbConfig.schedule.delete({ where: { id } });
  }
}