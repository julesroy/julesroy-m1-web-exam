import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { BikesRepository } from "./bikes.repository";
import type {
  BikeModel,
  CreateBikeModel,
  PaginatedBikesModel,
  UpdateBikeModel,
} from "./models/bike.model";

@Injectable()
export class BikesService {
  constructor(
    @Inject(BikesRepository)
    private readonly repository: BikesRepository,
  ) {}

  // recuperation paginee des velos
  findAll(page: number, limit: number): Promise<PaginatedBikesModel> {
    return this.repository.findAll(page, limit);
  }

  // recuperation d'un velo par son identifiant
  async findById(id: string): Promise<BikeModel> {
    const bike = await this.repository.findById(id);
    if (!bike) throw new NotFoundException("Bike not found");
    return bike;
  }

  // creation d'un nouveau velo
  async create(input: CreateBikeModel): Promise<BikeModel> {
    return this.repository.create(input);
  }

  // mise a jour partielle d'un velo
  async update(id: string, input: UpdateBikeModel): Promise<BikeModel> {
    if (!Object.values(input).some((value) => value !== undefined)) {
      throw new BadRequestException("At least one field must be supplied");
    }
    const updated = await this.repository.update(id, input);
    if (!updated) throw new NotFoundException("Bike not found");
    return updated;
  }

  // suppression d'un velo en verifiant l'absence de ventes
  async delete(id: string): Promise<void> {
    const bike = await this.repository.findById(id);
    if (!bike) throw new NotFoundException("Bike not found");

    const hasSales = await this.repository.hasSales(id);
    if (hasSales) {
      throw new ConflictException(
        "Bike cannot be deleted because it is associated with sales",
      );
    }

    await this.repository.delete(id);
  }
}
