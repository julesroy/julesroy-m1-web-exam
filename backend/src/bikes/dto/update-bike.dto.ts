import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from "class-validator";

// dto modification d'un velo
export class UpdateBikeDto {
  @IsOptional() // isoptional car la modification peut etre partielle
  @IsString()
  @IsNotEmpty()
  brand?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  model?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  frameMaterial?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  frameSizeCm?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  wheelSizeInches?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  gearCount?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  weightKg?: number;

  @IsOptional()
  @IsBoolean()
  electric?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  priceCents?: number;
}
