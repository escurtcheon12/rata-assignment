import { Module } from '@nestjs/common';
import { DBConfig } from '../../config/db.config';
import { IScheduleService } from './services/schedule.service.interface';
import { ScheduleService } from './services/schedule.service';
import { IScheduleRepository } from './repositories/schedule.repository.interface';
import { ScheduleRepository } from './repositories/schedule.repository';
import { ScheduleResolver } from './resolvers/schedule.resolver';

@Module({
  controllers: [],
  providers: [
    {
      provide: IScheduleService,
      useClass: ScheduleService,
    },
    {
      provide: IScheduleRepository,
      useClass: ScheduleRepository,
    },
    DBConfig,
    ScheduleResolver,
  ],
})
export class ScheduleModule {}
