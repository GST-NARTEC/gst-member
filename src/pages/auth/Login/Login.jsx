import React, { useEffect, useState } from "react";
import { Images } from "../../../assets/Index";
import { IoMail } from "react-icons/io5";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../store/apis/endpoints/member";
import { Button, Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";
import { decrypt } from "../../../utils/encryption";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/memberSlice";

const LoadingAnimation = () => (
  <div className="relative">
    {/* Outer rotating ring */}
    <div className="w-20 h-20 border-4 border-blue-400/30 rounded-full animate-[spin_3s_linear_infinite]" />

    {/* Inner rotating ring */}
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-14 h-14 border-4 border-t-blue-500 border-r-transparent 
                    border-b-blue-300 border-l-transparent rounded-full 
                    animate-[spin_1.5s_linear_infinite]"
    />

    {/* Center pulsing dot */}
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-4 h-4 bg-blue-500 rounded-full 
                    animate-[pulse_1s_ease-in-out_infinite]"
    />
  </div>
);

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAutoLogging, setIsAutoLogging] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    dispatch(logout());

    const credentials = {
      email,
      password,
      companyLicenseNo: undefined,
    };
    await login(credentials);
  };

  useEffect(() => {
    const handleAutoLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get("auth");

      if (authParam) {
        setIsAutoLogging(true);
        try {
          dispatch(logout());
          const { email: autoEmail, companyLicenseNo } = decrypt(authParam);

          if (autoEmail && companyLicenseNo) {
            await login({
              email: autoEmail,
              companyLicenseNo,
              password: undefined,
            });
          }
        } catch (error) {
          toast.error("Invalid login credentials");
          setShowLoginForm(true);
        } finally {
          setIsAutoLogging(false);
        }
      } else {
        setShowLoginForm(true);
      }
    };

    handleAutoLogin();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login successful");
      navigate("/member-portal/dashboard");
    }
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isSuccess, isError, error]);

  // Loading spinner view
  if (isAutoLogging || isLoading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-blue-900 via-navy-600 to-navy-700 
                      flex flex-col items-center justify-center"
      >
        {/* <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl shadow-2xl mb-12">
          <img src={Images.Logo} alt="Company Logo" className="h-auto w-32" />
        </div> */}

        <div
          className="bg-white/10 backdrop-blur-lg p-12 rounded-2xl shadow-2xl 
                      flex flex-col items-center space-y-6"
        >
          <LoadingAnimation />
          <div className="flex flex-col items-center space-y-2">
            <p className="text-white/90 font-medium text-lg">Logging you in</p>
            <p className="text-white/60 text-sm animate-pulse">
              Please wait a moment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything while determining login state
  if (!showLoginForm) {
    return null;
  }

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
                Member Portal
              </h2>
              <p className="text-gray-500">
                Access your GST membership account to manage your services and
                barcodes
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
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-lg
                           text-gray-900 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/member-portal/forget-password")}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot password?
                </button>
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
                Sign in
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register/barcodes")}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Register now
                </button>
              </p>
            </div>

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
};

export default LoginPage;
