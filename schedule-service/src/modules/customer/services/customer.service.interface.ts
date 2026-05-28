import { Customer } from '@prisma/client';
import {
  CustomerDto,
  CustomerListDto,
} from '../dtos/responses/customer.response.dto';

export interface ICustomerService {
  createCustomer(data: { name: string; email: string }): Promise<CustomerDto>;
  getCustomerById(id: string): Promise<CustomerDto>;
  getCustomers(page: number, pageSize: number): Promise<CustomerListDto>;
  updateCustomer(id: string, data: { name?: string; email?: string }): Promise<CustomerDto>;
  deleteCustomer(id: string): Promise<CustomerDto>;
}

export const ICustomerService = Symbol('ICustomerService');