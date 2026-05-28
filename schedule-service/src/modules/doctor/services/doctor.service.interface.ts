import { DoctorDto, DoctorListDto } from '../dtos/responses/doctor.response.dto';

export interface IDoctorService {
  createDoctor(data: { name: string }): Promise<DoctorDto>;
  getDoctorById(id: string): Promise<DoctorDto>;
  getDoctors(page: number, pageSize: number): Promise<DoctorListDto>;
  updateDoctor(id: string, data: { name?: string }): Promise<DoctorDto>;
  deleteDoctor(id: string): Promise<DoctorDto>;
}

export const IDoctorService = Symbol('IDoctorService');