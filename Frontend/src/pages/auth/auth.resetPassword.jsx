import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { z } from 'zod';

// Password validation schema
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const ResetPassword = () => {
  const [passwordDetails, setPasswordDetails] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate password details
      const validationResult = resetPasswordSchema.safeParse(passwordDetails);
      
      if (!validationResult.success) {
        validationResult.error.errors.forEach((err) => {
          toast.error(err.message);
        });
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/reset-password/${token}`,
        { password: passwordDetails.password }
      );

      if (response.status === 200) {
        toast.success("Your password has been reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Error resetting password:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.error || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="from-blue-500 via-blue-600 to-blue-700 flex justify-center items-center p-6 min-h-screen">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <img src="/assets/heal_logo.png" alt="Logo" className="w-16 mx-auto" />
          <h2 className="text-2xl font-extrabold text-gray-800">Reset Your Password</h2>
          <p className="text-sm text-gray-500 mt-2">
            Enter your new password below to regain access to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-blue-700">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={passwordDetails.password}
              onChange={(e) =>
                setPasswordDetails({ ...passwordDetails, password: e.target.value })
              }
              required
              className="w-full border border-blue-300 rounded-lg bg-blue-50 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your new password"
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-1 text-sm font-medium text-blue-700"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwordDetails.confirmPassword}
              onChange={(e) =>
                setPasswordDetails({
                  ...passwordDetails,
                  confirmPassword: e.target.value,
                })
              }
              required
              className="w-full border border-blue-300 rounded-lg bg-blue-50 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-700'
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              &lt; Back to Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
