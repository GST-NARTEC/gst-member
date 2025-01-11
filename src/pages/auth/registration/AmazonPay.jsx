import React from "react";
import { useAmazonPayMutation } from "../../../store/apis/endpoints/amazonPay";
import { useSelector } from "react-redux";
import { selectCartTotals } from "../../../store/slices/cartSlice";
import { selectPersonalInfo } from "../../../store/slices/personalInfoSlice";

const AmazonPay = () => {
  const [amazonPay, { isLoading }] = useAmazonPayMutation();

  const cartTotals = useSelector(selectCartTotals);
  const personalInfo = useSelector(selectPersonalInfo);

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const paymentDetails = {
        amount: cartTotals.total, // Use actual total from cart
        currency: "SAR", // You might want to get this from a currency state/config
        customerEmail: personalInfo.email,
        customerName: personalInfo.companyNameEn, // Using company name as customer name
      };

      const response = await amazonPay(paymentDetails);

      // Create and submit form to PayFort
      const form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", response.data.gatewayUrl);

      Object.entries(response.data.paymentData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", key);
        input.setAttribute("value", value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="payment-form">
      <form onSubmit={handlePayment}>
        {/* Add your payment form fields here */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default AmazonPay;
