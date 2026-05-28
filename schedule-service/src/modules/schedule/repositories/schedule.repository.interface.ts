import { Schedule } from '@prisma/client';

export interface ScheduleFilter {
  customerId?: string;
  doctorId?: string;
  scheduledFrom?: Date;
  scheduledTo?: Date;
}

export interface IScheduleRepository {
  create(data: {
    objective: string;
    customerId: string;
    doctorId: string;
    scheduledAt: Date;
  }): Promise<Schedule>;
  findById(id: string): Promise<Schedule | null>;
  findAll(
    page: number,
    pageSize: number,
    filter?: ScheduleFilter,
  ): Promise<{ schedules: Schedule[]; total: number }>;
  findByDoctorAndTime(doctorId: string, scheduledAt: Date): Promise<Schedule | null>;
  delete(id: string): Promise<Schedule>;
}

export const IScheduleRepository = Symbol('IScheduleRepository');