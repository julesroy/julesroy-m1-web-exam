import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { BikeSellEntity } from "../customers/entities/bike-sell.entity";
import { BikeEntity } from "./entities/bike.entity";
import type {
  BikeModel,
  CreateBikeModel,
  PaginatedBikesModel,
  UpdateBikeModel,
} from "./models/bike.model";

@Injectable()
export class BikesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  // recuperation paginee des velos et du nombre total
  async findAll(page: number, limit: number): Promise<PaginatedBikesModel> {
    const [entities, totalCount] = await this.dataSource
      .getRepository(BikeEntity)
      .findAndCount({
        order: { brand: "ASC", model: "ASC", id: "ASC" },
        skip: (page - 1) * limit,
        take: limit,
      });

    return {
      totalCount,
      bikes: entities.map((entity) => this.toBikeModel(entity)),
    };
  }

  // recherche d'un velo avec son identifiant
  async findById(id: string): Promise<BikeModel | null> {
    const entity = await this.dataSource
      .getRepository(BikeEntity)
      .findOneBy({ id });
    return entity ? this.toBikeModel(entity) : null;
  }

  // creation velo
  async create(input: CreateBikeModel): Promise<BikeModel> {
    const repository = this.dataSource.getRepository(BikeEntity);
    const created = repository.create(input);
    const saved = await repository.save(created);
    return this.toBikeModel(saved);
  }

  // mise a jour d'un velo qui existe deja
  async update(id: string, input: UpdateBikeModel): Promise<BikeModel | null> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(BikeEntity);
      const entity = await repository.findOneBy({ id });
      if (!entity) return null;
      repository.merge(entity, input);
      const saved = await repository.save(entity);
      return this.toBikeModel(saved);
    });
  }

  // verification si le velo est deja lie a une vente
  async hasSales(id: string): Promise<boolean> {
    return this.dataSource
      .getRepository(BikeSellEntity)
      .existsBy({ bikeId: id });
  }

  // suppression velo
  async delete(id: string): Promise<boolean> {
    const result = await this.dataSource.getRepository(BikeEntity).delete(id);
    return (result.affected ?? 0) > 0;
  }

  // conversion de l'entite typeorm en modele metier
  private toBikeModel(entity: BikeEntity): BikeModel {
    return {
      id: entity.id,
      brand: entity.brand,
      model: entity.model,
      description: entity.description,
      category: entity.category,
      frameMaterial: entity.frameMaterial,
      frameSizeCm: entity.frameSizeCm,
      wheelSizeInches: entity.wheelSizeInches,
      gearCount: entity.gearCount,
      weightKg: entity.weightKg,
      electric: entity.electric,
      priceCents: entity.priceCents,
    };
  }
}
