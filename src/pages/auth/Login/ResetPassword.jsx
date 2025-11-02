import React, { useState, useEffect } from "react";
import { Images } from "../../../assets/Index";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@heroui/react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "../../../store/apis/endpoints/user";

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    if (!location.state?.token || !location.state?.email) {
      toast.error("Invalid session. Please try again");
      navigate("/member-portal/forget-password");
    }
  }, [location.state, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields, touchedFields },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  const onSubmit = async (data) => {
    try {
      const response = await resetPassword({
        token: location.state.token,
        newPassword: data.password,
      });

      if (response.data?.success) {
        toast.success(response.data?.message || "Password reset successfully");
        navigate("/member-portal/login");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-navy-600 to-navy-700">
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
                Reset Password
              </h2>
              <p className="text-gray-500">
                Please enter your new password below
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* New Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    onChange: (e) => {
                      if (
                        e.target.value.length < 8 &&
                        e.target.value.length > 0
                      ) {
                        return "Password must be at least 8 characters";
                      }
                    },
                  })}
                  className={`block w-full pl-11 pr-11 py-3.5 border ${
                    errors.password && touchedFields.password
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-lg
                           text-gray-900 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200`}
                  placeholder="Enter new password"
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
              {errors.password && touchedFields.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}

              {/* Confirm Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (val) => {
                      if (watch("password") !== val) {
                        return "Passwords do not match";
                      }
                    },
                  })}
                  className={`block w-full pl-11 pr-11 py-3.5 border ${
                    !passwordMatch && confirmPassword
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-lg
                           text-gray-900 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                isLoading={isLoading}
                isDisabled={!passwordMatch || !password || !confirmPassword}
                className="w-full py-4 px-4 mt-4 border border-transparent rounded-lg
                             text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                             transition duration-200 shadow-sm"
              >
                Reset Password
              </Button>

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

export default ResetPassword;
