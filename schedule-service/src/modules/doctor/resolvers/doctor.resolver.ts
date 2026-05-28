import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { IDoctorService } from '../services/doctor.service.interface';
import {
  CustomerDto,
  CustomerListDto,
  CreateCustomerResponseDto,
  UpdateCustomerResponseDto,
  CustomerListResponseDto,
} from '../dtos/responses/doctor.response.dto';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerPaginationDto,
} from '../dtos/requests/doctor.request.dto';

@Resolver()
export class DoctorResolver {
  constructor(
    @Inject(IDoctorService)
    private readonly doctorService: IDoctorService,
  ) {}

  @Mutation(() => CreateCustomerResponseDto)
  async createCustomer(@Args('input') input: CreateCustomerDto) {
    return this.doctorService.createCustomer({
      name: input.name,
      email: input.email,
    });
  }

  @Mutation(() => UpdateCustomerResponseDto)
  async updateCustomer(
    @Args('id') id: string,
    @Args('input') input: UpdateCustomerDto,
  ) {
    return this.doctorService.updateCustomer(id, {
      name: input.name,
      email: input.email,
    });
  }

  @Mutation(() => CustomerDto)
  async deleteCustomer(@Args('id') id: string) {
    return this.doctorService.deleteCustomer(id);
  }

  @Query(() => CustomerListResponseDto)
  async customers(@Args('pagination') pagination: CustomerPaginationDto) {
    const page = pagination.page ? parseInt(pagination.page, 10) : 1;
    const pageSize = pagination.pageSize
      ? parseInt(pagination.pageSize, 10)
      : 10;
    return this.doctorService.getCustomers(page, pageSize);
  }

  @Query(() => CustomerDto)
  async customer(@Args('id') id: string) {
    return this.doctorService.getCustomerById(id);
  }
}
