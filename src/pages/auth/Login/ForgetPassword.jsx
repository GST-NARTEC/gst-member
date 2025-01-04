import React, { useState, useEffect } from "react";
import { Images } from "../../../assets/Index";
import { IoMail } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import { useInitiatePasswordResetMutation } from "../../../store/apis/endpoints/user";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [initiatePasswordReset, { isLoading, error, isError, isSuccess }] =
    useInitiatePasswordResetMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await initiatePasswordReset({ email });
      if (response.data?.token) {
        navigate("/member-portal/verify-otp", {
          state: { token: response.data.token, email },
        });
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Failed to send OTP");
    } else if (isSuccess) {
      toast.success(
        response.data?.message || "OTP has been sent to your email"
      );
    }
  }, [isError, isSuccess, error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-navy-600 to-navy-700">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 cursor-pointer"
      >
        <div className="bg-white/90 p-3 rounded-xl shadow-lg">
          <img src={Images.Logo} alt="Company Logo" className="h-auto w-24" />
        </div>
      </div>

      {/* Main Container */}
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-xl shadow-xl p-8 space-y-4">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">
                Verify Your Email
              </h2>
              <p className="text-gray-500">
                Enter your email address and we'll send you an OTP to reset your
                password
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IoMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-11 pr-3 py-3.5 border border-gray-200 rounded-lg
                           text-gray-900 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200"
                  placeholder="Enter your registered email"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full py-4 px-4 mt-4 border border-transparent rounded-lg
                             text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                             transition duration-200 shadow-sm"
              >
                Send OTP
              </Button>

              {/* Back to Login */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/member-portal/login")}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-400">
                © 2024 Global Standard for Technology. v1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
