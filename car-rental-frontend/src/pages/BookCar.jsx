import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../api/api";

const BookCar = () => {
  const { carId } = useParams();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const handleBooking = async () => {
    try {
      await api.post("/bookings", {
        carId,
        startDate,
        endDate,
      });
      alert("Booking successful");
    } catch (err) {
      setError(err.response?.data || "Booking failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Book Car</h2>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="date"
        className="border p-2 w-full mb-3"
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        className="border p-2 w-full mb-3"
        onChange={(e) => setEndDate(e.target.value)}
      />

      <button
        onClick={handleBooking}
        className="bg-black text-white px-4 py-2 w-full"
      >
        Book Now
      </button>
    </div>
  );
};

export default BookCar;
