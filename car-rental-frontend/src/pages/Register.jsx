import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-cyan-400 mb-6">
          Register
        </h2>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700"
          />

          <button className="w-full py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-semibold">
            Create Account
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          Already registered?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
