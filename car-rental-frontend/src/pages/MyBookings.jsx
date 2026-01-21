import { useEffect, useState } from "react";
import { getMyBookings } from "../services/bookingService";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings()
      .then((res) => setBookings(res.data))
      .catch(() => alert("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center py-20 text-gray-400">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-400">No bookings yet</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <div key={b.id} className="bg-gray-800 rounded-2xl p-5 shadow">
              <h3 className="text-xl font-semibold mb-2">
                {b.car.brand} {b.car.model}
              </h3>

              <p className="text-gray-400">
                {b.startDate} → {b.endDate}
              </p>

              <p className="font-semibold text-cyan-400 mt-2">
                ₹{b.totalPrice}
              </p>

              <span className="inline-block mt-3 px-3 py-1 text-sm rounded-full bg-yellow-600">
                {b.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
