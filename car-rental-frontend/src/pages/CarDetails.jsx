import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCarById } from "../services/carService";

export default function CarDetails() {
  const { id } = useParams();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCarById(id)
      .then((res) => setCar(res.data))
      .catch(() => setError("Car not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-center py-20 text-gray-400">Loading...</p>;
  }

  if (error) {
    return <p className="text-center py-20 text-red-400">{error}</p>;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Back */}
      <Link to="/cars" className="text-cyan-400 hover:underline">
        ← Back to Cars
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-6">
        {/* Image */}
        <img
          src={
            car.image ||
            "https://images.unsplash.com/photo-1555215695-3004980ad54e"
          }
          alt={`${car.brand} ${car.model}`}
          className="w-full h-[420px] object-cover rounded-2xl"
        />

        {/* Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-cyan-400">
            {car.brand} {car.model}
          </h1>

          <p className="text-gray-400">
            Premium {car.brand} {car.model} for smooth and safe journeys.
          </p>

          <div className="bg-gray-900 p-5 rounded-xl flex justify-between">
            <span className="text-gray-400">Price</span>
            <span className="text-2xl font-bold text-cyan-400">
              ₹{car.pricePerDay} / day
            </span>
          </div>

          {/* Booking */}
          {car.available ? (
            <Link
              to={`/booking/${car.id}`}
              className="block text-center bg-cyan-600 hover:bg-cyan-500 py-3 rounded-xl text-lg font-semibold transition"
            >
              Book This Car
            </Link>
          ) : (
            <button
              disabled
              className="w-full py-3 rounded-xl text-lg font-semibold bg-gray-700 cursor-not-allowed"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
