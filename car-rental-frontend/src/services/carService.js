import api from "./api";

export const getAllCars = () => api.get("/cars");
export const getCarById = (id) => api.get(`/cars/${id}`);
