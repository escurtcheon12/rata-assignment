import { Doctor } from '@prisma/client';

export interface IDoctorRepository {
  create(data: { name: string }): Promise<Doctor>;
  findById(id: string): Promise<Doctor | null>;
  findAll(page: number, pageSize: number): Promise<{ doctors: Doctor[]; total: number }>;
  update(id: string, data: { name?: string }): Promise<Doctor>;
  delete(id: string): Promise<Doctor>;
}

export const IDoctorRepository = Symbol('IDoctorRepository');