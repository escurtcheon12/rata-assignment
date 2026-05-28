import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { IScheduleService } from '../services/schedule.service.interface';
import {
  CreateScheduleResponseDto,
  ScheduleListResponseDto,
  ScheduleResponseDto,
} from '../dtos/responses/schedule.response.dto';
import {
  CreateScheduleDto,
  SchedulePaginationDto,
} from '../dtos/requests/schedule.request.dto';
import { ScheduleFilter } from '../repositories/schedule.repository.interface';

@Resolver()
export class ScheduleResolver {
  constructor(
    @Inject(IScheduleService)
    private readonly scheduleService: IScheduleService,
  ) {}

  @Mutation(() => CreateScheduleResponseDto)
  async createSchedule(@Args('input') input: CreateScheduleDto) {
    return this.scheduleService.createSchedule({
      objective: input.objective,
      customerId: input.customerId,
      doctorId: input.doctorId,
      scheduledAt: new Date(input.scheduledAt),
    });
  }

  @Mutation(() => ScheduleResponseDto)
  async deleteSchedule(@Args('id') id: string) {
    return this.scheduleService.deleteSchedule(id);
  }

  @Query(() => ScheduleListResponseDto)
  async schedules(@Args('pagination') pagination: SchedulePaginationDto) {
    const page = pagination.page ? parseInt(pagination.page, 10) : 1;
    const pageSize = pagination.pageSize
      ? parseInt(pagination.pageSize, 10)
      : 10;

    let filter: ScheduleFilter | undefined;
    if (pagination.filter) {
      filter = {};
      if (pagination.filter.customerId) {
        filter.customerId = pagination.filter.customerId;
      }
      if (pagination.filter.doctorId) {
        filter.doctorId = pagination.filter.doctorId;
      }
      if (pagination.filter.scheduledFrom) {
        filter.scheduledFrom = new Date(pagination.filter.scheduledFrom);
      }
      if (pagination.filter.scheduledTo) {
        filter.scheduledTo = new Date(pagination.filter.scheduledTo);
      }
    }

    return this.scheduleService.getSchedules(page, pageSize, filter);
  }

  @Query(() => ScheduleResponseDto)
  async schedule(@Args('id') id: string) {
    return this.scheduleService.getScheduleById(id);
  }
}
