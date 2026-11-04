// modele velo
export interface BikeModel {
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
}

// modele de creation velo
export interface CreateBikeModel {
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
}

// modele modification velo
export type UpdateBikeModel = Partial<CreateBikeModel>;

// pagination exo 2
export interface PaginatedBikesModel {
  totalCount: number;
  bikes: BikeModel[];
}
