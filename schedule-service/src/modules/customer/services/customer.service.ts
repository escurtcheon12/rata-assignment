import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ICustomerRepository } from '../repositories/customer.repository.interface';
import { ICustomerService } from './customer.service.interface';
import {
  CustomerDto,
  CustomerListDto,
} from '../dtos/responses/customer.response.dto';

@Injectable()
export class CustomerService implements ICustomerService {
  constructor(
    @Inject(ICustomerRepository)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  private toCustomerDto(customer: any): CustomerDto {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  async createCustomer(data: {
    name: string;
    email: string;
  }): Promise<CustomerDto> {
    const existingCustomer = await this.customerRepository.findByEmail(
      data.email,
    );
    if (existingCustomer) {
      throw new ConflictException('Customer with this email already exists');
    }
    const customer = await this.customerRepository.create(data);
    return this.toCustomerDto(customer);
  }

  async getCustomerById(id: string): Promise<CustomerDto> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return this.toCustomerDto(customer);
  }

  async getCustomers(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<CustomerListDto> {
    const { customers, total } = await this.customerRepository.findAll(
      page,
      pageSize,
    );
    return {
      data: customers.map((c) => this.toCustomerDto(c)),
      totalRecords: total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async updateCustomer(
    id: string,
    data: { name?: string; email?: string },
  ): Promise<CustomerDto> {
    const existingCustomer = await this.customerRepository.findById(id);
    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    if (data.email && data.email !== existingCustomer.email) {
      const customerWithEmail = await this.customerRepository.findByEmail(
        data.email,
      );
      if (customerWithEmail) {
        throw new ConflictException('Customer with this email already exists');
      }
    }
    const customer = await this.customerRepository.update(id, data);
    return this.toCustomerDto(customer);
  }

  async deleteCustomer(id: string): Promise<CustomerDto> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    const deleted = await this.customerRepository.delete(id);
    return this.toCustomerDto(deleted);
  }
}
