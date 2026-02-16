import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCarById } from "../services/carService";

export default function CarDetails() {
  const { id } = useParams();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid car ID");
      setLoading(false);
      return;
    }

    const fetchCar = async () => {
      try {
        const carData = await getCarById(id);
        setCar(carData);
      } catch (err) {
        console.error("Failed to fetch car:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError("Car not found");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center py-20 text-gray-400">Loading car details...</p>
    );
  }

  if (error || !car) {
    return (
      <p className="text-center py-20 text-red-400">
        {error || "Car not found"}
      </p>
    );
  }

  const carId = car.id ?? car._id;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/cars" className="text-cyan-400 hover:underline">
        ← Back to Cars
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 items-center">
        <img
          src={
            car.image ||
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"
          }
          alt={`${car.brand} ${car.model}`}
          className="rounded-xl w-full object-cover h-80 lg:h-full"
        />

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">
              {car.brand} {car.model}
            </h1>

            <p className="mt-4 text-xl text-gray-200">
              Price per day:{" "}
              <span className="font-semibold">₹{car.pricePerDay}</span>
            </p>

            {car.type && <p className="mt-2 text-gray-400">Type: {car.type}</p>}
          </div>

          <Link
            to={`/booking/${carId}`}
            className="mt-6 inline-block bg-cyan-600 px-6 py-3 rounded-xl hover:bg-cyan-500 transition text-white font-semibold text-center"
          >
            Book This Car
          </Link>
        </div>
      </div>
    </section>
  );
}
