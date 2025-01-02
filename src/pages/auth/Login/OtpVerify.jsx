import React, { useState } from "react";
import { Images } from "../../../assets/Index";
import { useNavigate } from "react-router-dom";
import { Button, InputOtp } from "@nextui-org/react";
import toast from "react-hot-toast";

function OtpVerify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast.error("Please enter a valid OTP");
      return;
    }
    console.log("OTP submitted:", otp);
    toast.success("OTP verified successfully");
    navigate("/member-portal/reset-password");
  };

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
                Enter OTP Code
              </h2>
              <p className="text-gray-500">
                Please enter the 4-digit code sent to your email
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div className="flex justify-center py-4">
                <InputOtp
                  length={4}
                  value={otp}
                  isInvalid={otp.length !== 4}
                  errorMessage="Invalid OTP code"
                  size="lg"
                  onValueChange={setOtp}
                  classNames={{
                    input: "w-12 h-12 text-2xl",
                  }}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-4 px-4 mt-4 border border-transparent rounded-lg
                             text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                             transition duration-200 shadow-sm"
              >
                Verify OTP
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                    onClick={() => {
                      toast.success("New OTP has been sent to your email");
                    }}
                  >
                    Resend OTP
                  </button>
                </p>
              </div>

              {/* Back to Login */}
              <div className="text-center">
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

export default OtpVerify;
