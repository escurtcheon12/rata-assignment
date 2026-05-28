import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { IDoctorService } from '../services/doctor.service.interface';
import {
  CreateDoctorResponseDto,
  UpdateDoctorResponseDto,
  DoctorListResponseDto,
  DoctorResponseDto,
} from '../dtos/responses/doctor.response.dto';
import {
  CreateDoctorDto,
  UpdateDoctorDto,
  DoctorPaginationDto,
} from '../dtos/requests/doctor.request.dto';

@Resolver()
export class DoctorResolver {
  constructor(
    @Inject(IDoctorService)
    private readonly doctorService: IDoctorService,
  ) {}

  @Mutation(() => CreateDoctorResponseDto)
  async createDoctor(@Args('input') input: CreateDoctorDto) {
    return this.doctorService.createDoctor({ name: input.name });
  }

  @Mutation(() => UpdateDoctorResponseDto)
  async updateDoctor(
    @Args('id') id: string,
    @Args('input') input: UpdateDoctorDto,
  ) {
    return this.doctorService.updateDoctor(id, { name: input.name });
  }

  @Mutation(() => DoctorResponseDto)
  async deleteDoctor(@Args('id') id: string) {
    return this.doctorService.deleteDoctor(id);
  }

  @Query(() => DoctorListResponseDto)
  async doctors(@Args('pagination') pagination: DoctorPaginationDto) {
    const page = pagination.page ? parseInt(pagination.page, 10) : 1;
    const pageSize = pagination.pageSize
      ? parseInt(pagination.pageSize, 10)
      : 10;
    return this.doctorService.getDoctors(page, pageSize);
  }

  @Query(() => DoctorResponseDto)
  async doctor(@Args('id') id: string) {
    return this.doctorService.getDoctorById(id);
  }
}
