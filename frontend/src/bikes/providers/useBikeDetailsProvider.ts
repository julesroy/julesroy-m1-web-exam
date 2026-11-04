import axios from "axios";
import { useState } from "react";
import type { BikeModel, UpdateBikeModel } from "../models/BikeModel";

export const useBikeDetailsProvider = (bikeId: string) => {
  const [bike, setBike] = useState<BikeModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // chargement des details d'un velo
  const load = () => {
    setIsLoading(true);
    return axios
      .get<BikeModel>(`http://localhost:3000/bikes/${bikeId}`)
      .then((result) => setBike(result.data))
      .finally(() => {
        setIsLoading(false);
      });
  };

  // modification partielle des informations d'un velo
  const updateBike = (input: UpdateBikeModel) => {
    return axios
      .patch<BikeModel>(`http://localhost:3000/bikes/${bikeId}`, input)
      .then((result) => setBike(result.data));
  };

  return {
    bike,
    isLoading,
    load,
    updateBike,
  };
};
