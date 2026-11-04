import type { CustomerModel, PaginatedCustomersModel } from "../models/customer.model";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class CustomerResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;

  static fromModel(model: CustomerModel): CustomerResponseDto {
    return Object.assign(new CustomerResponseDto(), model);
  }
}

// pagination exo 1
export class PaginationQueryDto {
  // numero de page, par defaut 1
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;
  // 10 clients par defaut, 50 max
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;
}

export class PaginatedCustomersResponseDto {
  totalCount: number;
  customers: CustomerResponseDto[];

  static fromModel(model: PaginatedCustomersModel): PaginatedCustomersResponseDto {
    return {
      totalCount: model.totalCount,
      customers: model.customers.map((customer) => CustomerResponseDto.fromModel(customer)), // on cree un customer response dto pour chaque customer model
    };
  }
}