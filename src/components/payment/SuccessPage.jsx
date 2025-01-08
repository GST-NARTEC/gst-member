import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { useCheckoutMutation } from "../../store/apis/endpoints/checkout";
import toast from "react-hot-toast";

function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [checkout] = useCheckoutMutation();
  const [verificationStatus, setVerificationStatus] = useState("pending");

  useEffect(() => {
    const verifyTransaction = async () => {
      try {
        // Get the pending order from localStorage
        const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));
        if (!pendingOrder) {
          setVerificationStatus("failed");
          toast.error("No pending order found");
          return;
        }

        // Get all the parameters from the URL
        const paymentResponse = {
          status: searchParams.get("status"),
          responseCode: searchParams.get("response_code"),
          responseMessage: searchParams.get("response_message"),
          fortId: searchParams.get("fort_id"),
          merchantReference: searchParams.get("merchant_reference"),
          amount: searchParams.get("amount"),
          currency: searchParams.get("currency"),
          paymentOption: searchParams.get("payment_option"),
          customerEmail: searchParams.get("customer_email"),
          customerIp: searchParams.get("customer_ip"),
          language: searchParams.get("language"),
          authorizationCode: searchParams.get("authorization_code"),
        };

        // Add payment response to the order data
        const orderData = {
          ...pendingOrder,
          paymentResponse,
        };

        // Call checkout API with the complete order data
        const response = await checkout(orderData).unwrap();

        if (response.success) {
          setVerificationStatus("success");
          toast.success("Payment verified successfully");
          localStorage.removeItem("pendingOrder");
        } else {
          setVerificationStatus("failed");
          toast.error(response.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setVerificationStatus("failed");
        toast.error(error?.data?.message || "Payment verification failed");
      }
    };

    // Verify transaction if we have URL parameters
    if (searchParams.size > 0) {
      verifyTransaction();
    }
  }, [searchParams, checkout]);

  useEffect(() => {
    // Only redirect if verification was successful
    if (verificationStatus === "success") {
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [verificationStatus, navigate]);

  if (verificationStatus === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Verifying Payment...
          </h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-20 h-20 mb-6 flex items-center justify-center"
        >
          {verificationStatus === "success" ? (
            <BsCheckCircleFill className="w-full h-full text-green-500" />
          ) : (
            <BsXCircleFill className="w-full h-full text-red-500" />
          )}
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-gray-800 mb-4"
        >
          {verificationStatus === "success"
            ? "Payment Successful!"
            : "Payment Failed"}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 mb-8"
        >
          {verificationStatus === "success"
            ? "Thank you for your payment. Your transaction has been completed successfully."
            : "There was an issue processing your payment. Please try again."}
        </motion.p>

        {verificationStatus === "success" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-gray-500 mb-8"
          >
            You will be redirected to homepage in 5 seconds...
          </motion.div>
        )}

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className={`w-full py-3 px-6 ${
            verificationStatus === "success"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          } text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg`}
        >
          {verificationStatus === "success" ? "Return to Home" : "Try Again"}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default SuccessPage;
