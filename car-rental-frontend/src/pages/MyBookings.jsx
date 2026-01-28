import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/my");
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to load bookings", err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (loading) {
    return (
      <p className="text-center py-20 text-gray-400">Loading bookings...</p>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-400">No bookings found</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-gray-800 rounded-xl p-5 flex flex-col sm:flex-row sm:justify-between gap-3"
            >
              <div>
                <h3 className="text-lg font-semibold text-cyan-300">
                  {b.carName}
                </h3>
                <p className="text-gray-400 text-sm">
                  {b.startDate} → {b.endDate}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">₹{b.totalPrice}</p>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    b.status === "CONFIRMED"
                      ? "bg-green-700 text-green-200"
                      : b.status === "PENDING"
                        ? "bg-yellow-700 text-yellow-200"
                        : "bg-red-700 text-red-200"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
