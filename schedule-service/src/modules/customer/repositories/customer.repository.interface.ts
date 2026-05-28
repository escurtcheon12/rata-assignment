import { Customer } from '@prisma/client';

export interface ICustomerRepository {
  create(data: { name: string; email: string }): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findAll(page: number, pageSize: number): Promise<{ customers: Customer[]; total: number }>;
  update(id: string, data: { name?: string; email?: string }): Promise<Customer>;
  delete(id: string): Promise<Customer>;
}

export const ICustomerRepository = Symbol('ICustomerRepository');