import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const BookCar = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select start and end dates");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/api/bookings", {
        carId: Number(carId),
        startDate,
        endDate,
      });

      alert("Booking request submitted 🚗");
      navigate("/my-bookings");
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Car already booked for selected dates";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-800 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Book Car</h2>

      {error && (
        <p className="mb-3 text-red-400 bg-red-900/30 p-2 rounded">{error}</p>
      )}

      <input
        type="date"
        className="border p-2 w-full mb-3 rounded bg-gray-900 text-white"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <input
        type="date"
        className="border p-2 w-full mb-4 rounded bg-gray-900 text-white"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <button
        onClick={handleBooking}
        disabled={loading}
        className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white px-4 py-2 w-full rounded font-semibold"
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
    </div>
  );
};

export default BookCar;
