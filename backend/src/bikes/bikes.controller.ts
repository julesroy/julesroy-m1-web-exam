import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { BikesService } from "./bikes.service";
import {
  BikeResponseDto,
  PaginatedBikesResponseDto,
  PaginationQueryDto,
} from "./dto/bike-response.dto";
import { CreateBikeDto } from "./dto/create-bike.dto";
import { UpdateBikeDto } from "./dto/update-bike.dto";
import type { CreateBikeModel, UpdateBikeModel } from "./models/bike.model";

@Controller("bikes")
export class BikesController {
  constructor(@Inject(BikesService) private readonly service: BikesService) {}

  // liste paginee velos
  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedBikesResponseDto> {
    const result = await this.service.findAll(query.page, query.limit);
    return PaginatedBikesResponseDto.fromModel(result);
  }

  // creation velo
  @Post()
  async create(@Body() dto: CreateBikeDto): Promise<BikeResponseDto> {
    const input: CreateBikeModel = {
      brand: dto.brand,
      model: dto.model,
      description: dto.description,
      category: dto.category,
      frameMaterial: dto.frameMaterial,
      frameSizeCm: dto.frameSizeCm,
      wheelSizeInches: dto.wheelSizeInches,
      gearCount: dto.gearCount,
      weightKg: dto.weightKg,
      electric: dto.electric,
      priceCents: dto.priceCents,
    };
    return BikeResponseDto.fromModel(await this.service.create(input));
  }

  // consultation details velo
  @Get(":id")
  async findById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<BikeResponseDto> {
    return BikeResponseDto.fromModel(await this.service.findById(id));
  }

  // modification velo
  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateBikeDto,
  ): Promise<BikeResponseDto> {
    const input: UpdateBikeModel = {
      brand: dto.brand,
      model: dto.model,
      description: dto.description,
      category: dto.category,
      frameMaterial: dto.frameMaterial,
      frameSizeCm: dto.frameSizeCm,
      wheelSizeInches: dto.wheelSizeInches,
      gearCount: dto.gearCount,
      weightKg: dto.weightKg,
      electric: dto.electric,
      priceCents: dto.priceCents,
    };
    return BikeResponseDto.fromModel(await this.service.update(id, input));
  }

  // suppression d'un velo
  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    await this.service.delete(id);
  }
}
