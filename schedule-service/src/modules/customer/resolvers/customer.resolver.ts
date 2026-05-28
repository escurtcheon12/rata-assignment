import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ICustomerService } from '../services/customer.service.interface';
import {
  CustomerDto,
  CustomerListDto,
  CreateCustomerResponseDto,
  UpdateCustomerResponseDto,
  CustomerListResponseDto,
} from '../dtos/responses/customer.response.dto';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerPaginationDto,
} from '../dtos/requests/customer.request.dto';

@Resolver()
export class CustomerResolver {
  constructor(
    @Inject(ICustomerService)
    private readonly customerService: ICustomerService,
  ) {}

  @Mutation(() => CreateCustomerResponseDto)
  async createCustomer(@Args('input') input: CreateCustomerDto) {
    return this.customerService.createCustomer({
      name: input.name,
      email: input.email,
    });
  }

  @Mutation(() => UpdateCustomerResponseDto)
  async updateCustomer(
    @Args('id') id: string,
    @Args('input') input: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(id, {
      name: input.name,
      email: input.email,
    });
  }

  @Mutation(() => CustomerDto)
  async deleteCustomer(@Args('id') id: string) {
    return this.customerService.deleteCustomer(id);
  }

  @Query(() => CustomerListResponseDto)
  async customers(@Args('pagination') pagination: CustomerPaginationDto) {
    const page = pagination.page ? parseInt(pagination.page, 10) : 1;
    const pageSize = pagination.pageSize
      ? parseInt(pagination.pageSize, 10)
      : 10;
    return this.customerService.getCustomers(page, pageSize);
  }

  @Query(() => CustomerDto)
  async customer(@Args('id') id: string) {
    return this.customerService.getCustomerById(id);
  }
}
