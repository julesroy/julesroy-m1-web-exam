import type { BikeModel, PaginatedBikesModel } from "../models/bike.model";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

// reponse donnees d'un velo
export class BikeResponseDto {
  id: string;
  brand: string;
  model: string;
  description: string;
  category: string;
  frameMaterial: string;
  frameSizeCm: number;
  wheelSizeInches: number;
  gearCount: number;
  weightKg: number;
  electric: boolean;
  priceCents: number;

  static fromModel(model: BikeModel): BikeResponseDto {
    return Object.assign(new BikeResponseDto(), model);
  }
}

// pagination velos exo 2
export class PaginationQueryDto {
  // numero de page, par defaut 1
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  // nombre maximal de velos par page, 10 par defaut et 50 maximum
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;
}

export class PaginatedBikesResponseDto {
  totalCount: number;
  bikes: BikeResponseDto[];

  static fromModel(model: PaginatedBikesModel): PaginatedBikesResponseDto {
    return {
      totalCount: model.totalCount,
      bikes: model.bikes.map((bike) => BikeResponseDto.fromModel(bike)),
    };
  }
}
