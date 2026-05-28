import { Injectable } from '@nestjs/common';
import { ICustomerRepository } from './customer.repository.interface';
import { DBConfig } from '../../../config/db.config';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly dbConfig: DBConfig) {}

  async create(data: { name: string; email: string }): Promise<Customer> {
    return this.dbConfig.customer.create({ data });
  }

  async findById(id: string): Promise<Customer | null> {
    return this.dbConfig.customer.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.dbConfig.customer.findUnique({ where: { email } });
  }

  async findAll(page: number, pageSize: number): Promise<{ customers: Customer[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const [customers, total] = await Promise.all([
      this.dbConfig.customer.findMany({ skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      this.dbConfig.customer.count(),
    ]);
    return { customers, total };
  }

  async update(id: string, data: { name?: string; email?: string }): Promise<Customer> {
    return this.dbConfig.customer.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Customer> {
    return this.dbConfig.customer.delete({ where: { id } });
  }
}