import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const BookCar = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
    }
  }, [loading, user, navigate, location]);

  // Fetch car details
  useEffect(() => {
    if (!carId) {
      setError("Invalid car selected");
      return;
    }

    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${carId}`);
        setCar(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load car details");
      }
    };

    fetchCar();
  }, [carId]);

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date");
      return;
    }

    try {
      setBookingLoading(true);
      setError("");

      await api.post("/bookings", {
        carId: Number(carId),
        startDate,
        endDate,
      });

      toast.success("Booking request submitted 🚗");
      navigate("/my-bookings");
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Car already booked for selected dates";

      setError(message);
      toast.error(message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <p className="text-gray-400">Loading...</p>;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-800 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Book Car</h2>

      {error && (
        <p className="mb-3 text-red-400 bg-red-900/30 p-2 rounded">{error}</p>
      )}

      {car ? (
        <div className="mb-4 bg-gray-900 p-3 rounded">
          <p className="text-lg font-semibold text-white">
            {car.brand} {car.model}
          </p>
          <p className="text-gray-400">Price per day: ₹{car.pricePerDay}</p>
          <p className="text-gray-400">Type: {car.type}</p>
        </div>
      ) : (
        <p className="text-gray-400 mb-4">Loading car details...</p>
      )}

      <input
        type="date"
        className="border p-2 w-full mb-3 rounded bg-gray-900 text-white"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        min={today}
      />

      <input
        type="date"
        className="border p-2 w-full mb-4 rounded bg-gray-900 text-white"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        min={startDate || today}
      />

      <button
        onClick={handleBooking}
        disabled={bookingLoading || !car}
        className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white px-4 py-2 w-full rounded font-semibold"
      >
        {bookingLoading ? "Booking..." : "Book Now"}
      </button>
    </div>
  );
};

export default BookCar;
