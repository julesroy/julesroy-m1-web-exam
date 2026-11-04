import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from "class-validator";

// dto pour la creation d'un velo
export class CreateBikeDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  frameMaterial: string;

  @IsNumber()
  @IsPositive()
  frameSizeCm: number;

  @IsNumber()
  @IsPositive()
  wheelSizeInches: number;

  @IsInt()
  @Min(1)
  gearCount: number;

  @IsNumber()
  @IsPositive()
  weightKg: number;

  @IsBoolean()
  electric: boolean;

  @IsInt()
  @Min(0)
  priceCents: number;
}
