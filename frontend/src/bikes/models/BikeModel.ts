// modele de donnees pour un velo
export type BikeModel = {
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
};

// modele de creation d'un velo
export type CreateBikeModel = {
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
};

// modele de modification d'un velo
export type UpdateBikeModel = Partial<CreateBikeModel>;

// modele de reponse paginee pour les velos
export type PaginatedBikesModel = {
  totalCount: number;
  bikes: BikeModel[];
};
