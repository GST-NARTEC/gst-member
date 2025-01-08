import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { useAmazonPayMutation } from "../../../store/apis/endpoints/amazonPay";
import { useSelector } from "react-redux";
import { selectPersonalInfo } from "../../../store/slices/personalInfoSlice";
import { generateOrderId } from "../../../utils/generateUniqueId";
import { selectCartTotals } from "../../../store/slices/cartSlice";
import toast from "react-hot-toast";

function AmazonPay() {
  const [paymentData, setPaymentData] = useState(null);
  const [payWithAmazon, { isLoading }] = useAmazonPayMutation();
  const personalInfo = useSelector(selectPersonalInfo);
  const cartTotals = useSelector(selectCartTotals);

  const handlePayment = async () => {
    try {
      const orderId = generateOrderId();
      const payload = {
        orderId,
        amount: cartTotals.total,
        email: personalInfo.email,
        currency: "SAR",
      };

      // Store complete order details in localStorage
      localStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          ...payload,
          personalInfo,
          cartTotals,
          timestamp: new Date().toISOString(),
        })
      );

      const response = await payWithAmazon(payload);
      console.log("Payment Response:", response);

      if (response.data && response.data.data) {
        setPaymentData(response.data.data);

        // Create and submit form
        const form = document.createElement("form");
        form.method = "post";
        form.action = response.data.data.url;

        // Add all form fields from the response
        Object.entries(response.data.data.params).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        toast.error("Invalid payment response structure");
        console.error("Invalid payment response structure:", response);
      }
    } catch (err) {
      toast.error("Payment initialization failed");
      console.error("Amazon Pay initialization failed:", err);
    }
  };

  return (
    <div
      className="amazon-pay-container"
      style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
    >
      <Button
        color="primary"
        size="lg"
        onClick={handlePayment}
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
}

export default AmazonPay;
