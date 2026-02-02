import api from "./api";

export const getAllCars = async () => {
  const response = await api.get("/cars");
  return response.data;
};

export const getCarById = async (id) => {
  if (!id) {
    throw new Error("Car ID is required");
  }

  const response = await api.get(`/cars/${id}`);
  return response.data;
};
