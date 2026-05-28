import {
  ScheduleDto,
  ScheduleListDto,
} from '../dtos/responses/schedule.response.dto';
import { ScheduleFilter } from '../repositories/schedule.repository.interface';

export interface IScheduleService {
  createSchedule(data: {
    objective: string;
    customerId: string;
    doctorId: string;
    scheduledAt: Date;
  }): Promise<ScheduleDto>;
  getScheduleById(id: string): Promise<ScheduleDto>;
  getSchedules(
    page: number,
    pageSize: number,
    filter?: ScheduleFilter,
  ): Promise<ScheduleListDto>;
  deleteSchedule(id: string): Promise<ScheduleDto>;
}

export const IScheduleService = Symbol('IScheduleService');
