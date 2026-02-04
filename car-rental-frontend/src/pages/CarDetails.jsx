import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCarById } from "../services/carService";

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchCar = async () => {
      try {
        const data = await getCarById(id);
        setCar(data);
      } catch (err) {
        setError("Car not found");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) {
    return <p className="text-center py-20">Loading car details...</p>;
  }

  if (error || !car) {
    return (
      <p className="text-center py-20 text-red-400">
        {error || "Car not found"}
      </p>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/cars" className="text-cyan-400">
        ← Back
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <img
          src={
            car.image ||
            "https://images.unsplash.com/photo-1555215695-3004980ad54e"
          }
          alt={`${car.brand} ${car.model}`}
          className="rounded-xl"
        />

        <div>
          <h1 className="text-3xl font-bold text-cyan-400">
            {car.brand} {car.model}
          </h1>

          <p className="mt-4 text-xl">₹{car.pricePerDay} / day</p>

          {/* ✅ FIX: use correct ID */}
          <Link
            to={`/booking/${car._id || car.id}`}
            className="mt-6 inline-block bg-cyan-600 px-6 py-3 rounded-xl"
          >
            Book This Car
          </Link>
        </div>
      </div>
    </section>
  );
}
