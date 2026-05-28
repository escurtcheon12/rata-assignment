import { Module } from '@nestjs/common';
import { DBConfig } from '../../config/db.config';
import { ICustomerService } from './services/customer.service.interface';
import { CustomerService } from './services/customer.service';
import { ICustomerRepository } from './repositories/customer.repository.interface';
import { CustomerRepository } from './repositories/customer.repository';
import { CustomerResolver } from './resolvers/customer.resolver';

@Module({
  controllers: [],
  providers: [
    {
      provide: ICustomerService,
      useClass: CustomerService,
    },
    {
      provide: ICustomerRepository,
      useClass: CustomerRepository,
    },
    DBConfig,
    CustomerResolver,
  ],
})
export class CustomerModule {}
