import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-6 drop-shadow-lg text-center">
        Task Manager
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Organize your tasks efficiently and stay productive!
      </p>
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <Link to="/login">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105 cursor-pointer text-nowrap">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105 cursor-pointer text-nowrap">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
