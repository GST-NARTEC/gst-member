import React from "react";
import { useAmazonPayMutation } from "../../../../store/apis/endpoints/amazonPay";
import { useSelector } from "react-redux";
import { selectCartTotals } from "../../../../store/slices/cartSlice";
import { selectCurrentUser } from "../../../../store/slices/memberSlice";
import { Button } from "@nextui-org/react";

const PayCraditDebit = ({ isDisabled }) => {
  const [amazonPay, { isLoading }] = useAmazonPayMutation();

  const user = useSelector(selectCurrentUser);

  const cartTotals = useSelector(selectCartTotals);

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const paymentDetails = {
        amount: cartTotals.total, // Use actual total from cart
        pageType: "memberPortal",
        currency: "SAR",
        customerEmail: user.email,
        customerName: user.companyNameEn, // Using company name as customer name
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
        <Button
          isDisabled={isDisabled}
          type="submit"
          isLoading={isLoading}
          className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-navy-600 text-white rounded-lg hover:bg-navy-700"
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </Button>
      </form>
    </div>
  );
};

export default PayCraditDebit;
