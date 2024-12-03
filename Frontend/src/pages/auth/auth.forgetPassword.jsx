import { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/forget-password`,
        { email }
      );
      if (response.status === 200) {
        setTimeout(() => {
          toast.success("Password Reset Link has been sent!");
        }, 1000);
      }
    } catch (error) {
      console.error("Error logging in:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.error || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="from-blue-500 via-blue-600 to-blue-700 flex justify-center items-center p-6 min-h-screen">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <img src="/assets/heal_logo.png" alt="Logo" className="w-16 mx-auto" />
          <h2 className="text-2xl font-extrabold text-gray-800">Reset Your Password</h2>
          <p className="text-sm text-gray-500 mt-2">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-blue-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-blue-300 rounded-lg bg-blue-50 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Remember your password?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
