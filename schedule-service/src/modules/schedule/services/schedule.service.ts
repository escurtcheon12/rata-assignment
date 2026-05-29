import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  IScheduleRepository,
  ScheduleFilter,
} from '../repositories/schedule.repository.interface';
import { IScheduleService } from './schedule.service.interface';
import {
  ScheduleDto,
  ScheduleListDto,
} from '../dtos/responses/schedule.response.dto';
import { DBConfig } from '../../../config/db.config';
import { EmailService } from '../../../common/thirdparties/email/email.service';

@Injectable()
export class ScheduleService implements IScheduleService {
  constructor(
    @Inject(IScheduleRepository)
    private readonly scheduleRepository: IScheduleRepository,
    private readonly dbConfig: DBConfig,
    private readonly emailService: EmailService,
  ) {}

  private toScheduleDto(schedule: any): ScheduleDto {
    return {
      id: schedule.id,
      objective: schedule.objective,
      customerId: schedule.customerId,
      doctorId: schedule.doctorId,
      scheduledAt: schedule.scheduledAt,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };
  }

  async createSchedule(data: {
    objective: string;
    customerId: string;
    doctorId: string;
    scheduledAt: Date;
  }): Promise<ScheduleDto> {
    const customer = await this.dbConfig.customer.findUnique({
      where: { id: data.customerId },
    });
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${data.customerId} not found`,
      );
    }

    const doctor = await this.dbConfig.doctor.findUnique({
      where: { id: data.doctorId },
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${data.doctorId} not found`);
    }

    const conflictingSchedule =
      await this.scheduleRepository.findByDoctorAndTime(
        data.doctorId,
        data.scheduledAt,
      );
    if (conflictingSchedule) {
      throw new ConflictException(
        'Schedule conflict: Doctor already has an appointment at this time',
      );
    }

    const schedule = await this.scheduleRepository.create(data);
    if (!schedule) {
      throw new BadRequestException(`Failed create schedule`);
    }

    await this.emailService.sendScheduleCreatedEmail({
      email: customer.email,
      name: customer.name,
      objective: schedule.objective,
      doctorName: doctor.name,
      scheduledAt: schedule.scheduledAt || new Date(),
    });

    return this.toScheduleDto(schedule);
  }

  async getScheduleById(id: string): Promise<ScheduleDto> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return this.toScheduleDto(schedule);
  }

  async getSchedules(
    page: number = 1,
    pageSize: number = 10,
    filter?: ScheduleFilter,
  ): Promise<ScheduleListDto> {
    const { schedules, total } = await this.scheduleRepository.findAll(
      page,
      pageSize,
      filter,
    );

    return {
      data: schedules.map((s) => this.toScheduleDto(s)),
      totalRecords: total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async deleteSchedule(id: string): Promise<ScheduleDto> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    const customer = await this.dbConfig.customer.findUnique({
      where: { id: schedule.customerId! },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${schedule.customerId} not found`,
      );
    }

    const doctor = await this.dbConfig.doctor.findUnique({
      where: { id: schedule.doctorId! },
    });

    if (!doctor) {
      throw new NotFoundException(
        `Doctor with ID ${schedule.doctorId} not found`,
      );
    }

    const deleted = await this.scheduleRepository.delete(id);

    if (customer && doctor) {
      await this.emailService.sendScheduleDeletedEmail({
        email: customer.email,
        name: customer.name,
        objective: schedule.objective,
        doctorName: doctor.name,
        scheduledAt: schedule.scheduledAt || new Date(),
      });
    }

    return this.toScheduleDto(deleted);
  }
}
