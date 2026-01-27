import api from "./api";

export const createBooking = async (bookingData) => {
  const res = await api.post("/bookings", bookingData);
  return res.data;
};

export const getMyBookings = async () => {
  const res = await api.get("/bookings/my");
  return res.data;
};

export const cancelBooking = async (bookingId) => {
  const res = await api.put(`/bookings/${bookingId}/cancel`);
  return res.data;
};
