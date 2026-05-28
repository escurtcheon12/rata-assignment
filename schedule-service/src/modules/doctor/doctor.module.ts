import { Module } from '@nestjs/common';
import { DBConfig } from '../../config/db.config';
import { IDoctorService } from './services/doctor.service.interface';
import { DoctorService } from './services/doctor.service';
import { IDoctorRepository } from './repositories/doctor.repository.interface';
import { DoctorRepository } from './repositories/doctor.repository';
import { DoctorResolver } from './resolvers/doctor.resolver';

@Module({
  controllers: [],
  providers: [
    {
      provide: IDoctorService,
      useClass: DoctorService,
    },
    {
      provide: IDoctorRepository,
      useClass: DoctorRepository,
    },
    DBConfig,
    DoctorResolver,
  ],
})
export class DoctorModule {}
