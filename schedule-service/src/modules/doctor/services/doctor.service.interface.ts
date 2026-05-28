import {
  CustomerDto,
  CustomerListDto,
} from '../dtos/responses/doctor.response.dto';

export interface IDoctorService {
  createCustomer(data: { name: string; email: string }): Promise<CustomerDto>;
  getCustomerById(id: string): Promise<CustomerDto>;
  getCustomers(page: number, pageSize: number): Promise<CustomerListDto>;
  updateCustomer(
    id: string,
    data: { name?: string; email?: string },
  ): Promise<CustomerDto>;
  deleteCustomer(id: string): Promise<CustomerDto>;
}

export const IDoctorService = Symbol('IDoctorService');
