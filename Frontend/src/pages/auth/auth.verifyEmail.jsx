import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ReceivedCode = otp.join("");

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/verify-email`,
        { ReceivedCode },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success("Email verified successfully");
        setTimeout(() => {
          navigate(`/profile/${response.data.role.toLowerCase()}`);
        }, 1000);
      }
    } catch (error) {
      console.error("Error verifying email:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.error || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;

    setOtp(newOtp);

    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleBackspace = (element, index) => {
    if (element.value === "" && element.previousSibling) {
      element.previousSibling.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);

    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("").concat(new Array(6 - pasteData.length).fill(""));
      setOtp(newOtp);

      const nextInputIndex = pasteData.length < 6 ? pasteData.length : 5;
      const nextInput = document.getElementById(`otp-${nextInputIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="from-blue-500 via-blue-600 to-blue-700 flex justify-center items-center p-6 min-h-screen">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <img src="/assets/heal_logo.png" alt="Logo" className="w-16 mx-auto" />
          <h2 className="text-2xl font-extrabold text-gray-800">Verify Your Email</h2>
          <p className="text-sm text-gray-500 mt-2">
            We've sent a 6-digit code to your email. Enter it below to verify your email address.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                name="otp"
                id={`otp-${index}`}
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => e.key === "Backspace" && handleBackspace(e.target, index)}
                onFocus={(e) => e.target.select()}
                onPaste={handlePaste}
                className="w-12 h-12 border border-blue-300 rounded-lg bg-blue-50 text-center text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Didn't receive the code?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            Resend
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;