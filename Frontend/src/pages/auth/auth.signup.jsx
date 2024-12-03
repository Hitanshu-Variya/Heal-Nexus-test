import { Quote } from "../../components/auth/quote.auth.jsx";
import { Auth } from "../../components/auth/auth.auth.jsx";

const SignUp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center py-10 px-6 relative">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-30"></div>

      {/* Main Container */}
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl grid grid-cols-1 lg:grid-cols-2 relative z-10">
        {/* Authentication Form */}
        <div className="p-10">
          <Auth type="signup" />
        </div>

        {/* Quote Section */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-t from-blue-600 to-blue-500 rounded-r-3xl">
          <Quote />
        </div>
      </div>
    </div>
  );
};

export default SignUp;