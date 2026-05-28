import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDoctorRepository } from '../repositories/doctor.repository.interface';
import { IDoctorService } from './doctor.service.interface';
import {
  DoctorDto,
  DoctorListDto,
} from '../dtos/responses/doctor.response.dto';

@Injectable()
export class DoctorService implements IDoctorService {
  constructor(
    @Inject(IDoctorRepository)
    private readonly doctorRepository: IDoctorRepository,
  ) {}

  private toDoctorDto(doctor: any): DoctorDto {
    return {
      id: doctor.id,
      name: doctor.name,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    };
  }

  async createDoctor(data: { name: string }): Promise<DoctorDto> {
    const doctor = await this.doctorRepository.create(data);
    return this.toDoctorDto(doctor);
  }

  async getDoctorById(id: string): Promise<DoctorDto> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return this.toDoctorDto(doctor);
  }

  async getDoctors(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<DoctorListDto> {
    const { doctors, total } = await this.doctorRepository.findAll(
      page,
      pageSize,
    );
    return {
      data: doctors.map((d) => this.toDoctorDto(d)),
      totalRecords: total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async updateDoctor(id: string, data: { name?: string }): Promise<DoctorDto> {
    const existingDoctor = await this.doctorRepository.findById(id);
    if (!existingDoctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    const doctor = await this.doctorRepository.update(id, data);
    return this.toDoctorDto(doctor);
  }

  async deleteDoctor(id: string): Promise<DoctorDto> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    const deleted = await this.doctorRepository.delete(id);
    return this.toDoctorDto(deleted);
  }
}
