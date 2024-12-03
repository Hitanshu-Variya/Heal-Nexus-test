import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signUpSchema,loginSchema } from "./AuthSchema.js";
import { z } from "zod";

export function Auth({ type }) {
  const [userDetails, setUserDetails] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showRoleSection, setShowRoleSection] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Validate userDetails against loginSchema
      loginSchema.parse(userDetails);
  
      setLoading(true); // Set loading state to true while request is in progress
  
      // Make the API call to login
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/login`,
        {
          email: userDetails.email, // Email from userDetails
          password: userDetails.password, // Password from userDetails
        },
        { withCredentials: true } // Send cookies with the request
      );

      if (response.status === 200 && response.data.message === 'Profile is yet to be verified by Admin!') {
        toast.error("Your profile is yet to be verified by the Admin! Please wait for approval.", {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxWidth: '400px',
            textAlign: 'center'
          },
        });
        navigate('/login');
        return;
      }
      else if (response.status === 200) {
        toast.success(`Welcome ${response.data.role}`);
        navigate(`/${response.data.role.toLowerCase()}-dashboard`);
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } 
      else {
        // Handle other types of errors (e.g., server or network errors)
        const errorMessage =
          error.response?.data?.error || "An error occurred. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      // Ensure loading state is reset
      setLoading(false);
    }
  };
  

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      signUpSchema.parse(userDetails);
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/signup`,
        userDetails,
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success("Sign up successful! Please verify your email.");
        navigate("/verify-email");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        const errorMessage =
          error.response?.data?.error || "An error occurred. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="from-blue-500 via-blue-600 to-blue-700 flex justify-center items-center p-6 min-h-screen">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <img src="/assets/heal_logo.png" alt="Logo" className="w-16 mx-auto" />
          <h2 className="text-2xl font-extrabold text-gray-800">
            {type === "login" ? "Login to Your Account" : "Create Your Account"}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {type === "login" ? (
              <>
                Don't have an account?{" "}
                <Link className="text-blue-600 hover:underline" to="/signup">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link className="text-blue-600 hover:underline" to="/login">
                  Login
                </Link>
              </>
            )}
          </p>
        </div>

        <form onSubmit={type === "signup" ? handleSignUp : handleLogin}>
          {type === "signup" && (
            <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-300">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowRoleSection(!showRoleSection)}
              >
                <p className="font-medium text-blue-700">
                  Register Details:
                </p>
                <span className="text-sm text-gray-500">
                  {showRoleSection ? "Hide" : "Show"}
                </span>
              </div>
              {showRoleSection && (
                <>
                  <Inputbox
                    placeholder="Username"
                    title="Username"
                    type="text"
                    value={userDetails.userName}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, userName: e.target.value })
                    }
                  />
                  <RegisterAs
                    onRoleChange={(e) =>
                      setUserDetails({ ...userDetails, role: e.target.value })
                    }
                  />
                </>
              )}
            </div>
          )}

          <Inputbox
            placeholder="Email"
            title="Email"
            type="email"
            value={userDetails.email}
            onChange={(e) =>
              setUserDetails({ ...userDetails, email: e.target.value })
            }
          />
          <Inputbox
            placeholder="Password"
            title="Password"
            type="password"
            value={userDetails.password}
            onChange={(e) =>
              setUserDetails({ ...userDetails, password: e.target.value })
            }
          />
          {type === "signup" && (
            <Inputbox
              placeholder="Confirm Password"
              title="Confirm Password"
              type="password"
              value={userDetails.confirmPassword}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  confirmPassword: e.target.value,
                })
              }
            />
          )}

          {type === "login" && (
            <div className="flex justify-between items-center text-sm text-gray-500 mt-2 mb-4">
              <Link to="/forget-password" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {loading ? "Processing..." : type === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Inputbox({ placeholder, title, type, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-blue-700">
        {title}
      </label>
      <input
        type={type}
        className="w-full border border-blue-300 rounded-lg bg-blue-50 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}

function RegisterAs({ onRoleChange }) {
  return (
    <div className="mt-2">
      {["Admin", "Patient", "Doctor", "Pharmacist", "Lab Technician"].map((role) => (
        <label key={role} className="flex items-center mb-2">
          <input
            type="radio"
            name="role"
            value={role}
            className="mr-2 accent-blue-600"
            onChange={onRoleChange}
          />
          {role}
        </label>
      ))}
    </div>
  );
}