import api from "./api";

export const getAllCars = async () => {
  const res = await api.get("/cars");
  return res;
};

export const getCarById = async (id) => {
  const res = await api.get(`/cars/${id}`);
  return res;
};
