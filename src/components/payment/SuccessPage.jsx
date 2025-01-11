import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { BiTime } from "react-icons/bi";
import { ImSpinner8 } from "react-icons/im";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useCheckoutMutation } from "../../store/apis/endpoints/checkout";
import {
  selectPersonalInfo,
  resetForm,
} from "../../store/slices/personalInfoSlice";
import {
  selectCartItems,
  selectVatDetails,
  clearCart,
} from "../../store/slices/cartSlice";
import toast from "react-hot-toast";

function PaymentResponse() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = new URLSearchParams(location.search);

  const status = params.get("status");
  const transactionId = params.get("transactionId");
  const orderNumber = params.get("orderNumber");

  const personalInfo = useSelector(selectPersonalInfo);
  const cartItems = useSelector(selectCartItems);
  const vatDetails = useSelector(selectVatDetails);
  const [checkout] = useCheckoutMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const completeCheckout = async () => {
      if (status === "success" && orderNumber && !loading) {
        try {
          const formattedCartItems = cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            addons:
              item.selectedAddons?.map((addon) => ({
                id: addon.id,
                quantity: addon.quantity,
              })) || [],
          }));

          const checkoutPayload = {
            email: personalInfo.email,
            companyNameEn: personalInfo.companyNameEn,
            companyNameAr: personalInfo.companyNameAr,
            mobile: personalInfo.mobile,
            landline: personalInfo.landline,
            country: personalInfo.country,
            region: personalInfo.region,
            city: personalInfo.city,
            companyLicenseNo: personalInfo.companyLicenseNo,
            streetAddress: personalInfo.streetAddress,
            zipCode: personalInfo.zipCode,
            latitude: personalInfo.latitude,
            longitude: personalInfo.longitude,
            cartItems: formattedCartItems,
            paymentType: "card",
            vat: vatDetails.value,
            orderNumber: orderNumber,
          };

          await checkout(checkoutPayload);
          dispatch(resetForm());
          dispatch(clearCart());
        } catch (error) {
          console.error("Checkout failed:", error);
          toast.error(error?.data?.message || "Checkout failed");
        }
      }
    };

    completeCheckout();
  }, [status, orderNumber, loading]);

  const handleReturn = () => {
    navigate("/");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: 0.2,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-10 rounded-2xl shadow-2xl bg-white max-w-md w-full mx-4 border border-gray-100"
        >
          <ImSpinner8 className="animate-spin text-blue-500 text-5xl mx-auto mb-6" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-3">
            Processing Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your payment...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {status === "success" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center p-10 rounded-2xl shadow-2xl bg-white max-w-md w-full border border-gray-100"
        >
          <motion.div variants={iconVariants}>
            <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-6">
            Payment Successful! 🎉
          </h2>
          <div className="space-y-4 mb-8">
            <p className="text-gray-600 text-lg">
              Your payment has been processed successfully.
            </p>
            {transactionId && (
              <div className="bg-gray-50 p-4 rounded-xl backdrop-blur-sm border border-gray-100">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Transaction ID:</span>{" "}
                  <span className="font-mono">{transactionId}</span>
                </p>
              </div>
            )}
            {orderNumber && (
              <div className="bg-gray-50 p-4 rounded-xl backdrop-blur-sm border border-gray-100">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Order Number:</span>{" "}
                  <span className="font-mono">{orderNumber}</span>
                </p>
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReturn}
            className="bg-gradient-to-r from-green-500 to-green-400 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform"
          >
            Return to Home
          </motion.button>
        </motion.div>
      )}

      {status === "pending" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center p-10 rounded-2xl shadow-2xl bg-white max-w-md w-full border border-gray-100"
        >
          <motion.div variants={iconVariants}>
            <BiTime className="text-yellow-500 text-7xl mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent mb-6">
            Payment Pending
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Your payment is being processed. Please wait...
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReturn}
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform"
          >
            Return to Home
          </motion.button>
        </motion.div>
      )}

      {(status === "failed" || status === "error" || !status) && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center p-10 rounded-2xl shadow-2xl bg-white max-w-md w-full border border-gray-100"
        >
          <motion.div variants={iconVariants}>
            <FaTimesCircle className="text-red-500 text-7xl mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-6">
            Payment Failed
          </h2>
          <div className="space-y-3 mb-8">
            <p className="text-gray-600 text-lg">
              Sorry, there was an error processing your payment.
            </p>
            <p className="text-gray-500">
              Please try again or contact support if the problem persists.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReturn}
            className="bg-gradient-to-r from-red-500 to-red-400 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform"
          >
            Try Again
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

export default PaymentResponse;
