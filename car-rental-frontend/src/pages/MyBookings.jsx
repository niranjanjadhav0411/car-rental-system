import { useEffect, useState } from "react";
import api from "../services/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api
      .get("/api/bookings/my")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">My Bookings</h1>

      {bookings.length === 0 && <p>No bookings yet</p>}

      {bookings.map((b) => (
        <div key={b.id} className="bg-gray-800 p-5 rounded-xl mb-4">
          <h3 className="text-xl font-semibold">
            {b.car.brand} {b.car.model}
          </h3>
          <p>
            {b.startDate} → {b.endDate}
          </p>
          <p>₹{b.totalPrice}</p>
          <span className="text-green-400">{b.status}</span>
        </div>
      ))}
    </section>
  );
}
