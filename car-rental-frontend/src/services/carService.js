import api from "./api";

export const getAllCars = async () => {
  const res = await api.get("/api/cars");
  return res.data;
};

export const getCarById = async (id) => {
  const res = await api.get(`/api/cars/${id}`);
  return res.data;
};
