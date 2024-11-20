import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, Radio, Input, Checkbox, Button } from "@nextui-org/react";
import { BsBank2, BsCreditCard2Front } from "react-icons/bs";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { SiStencyl } from "react-icons/si";
import { GiTakeMyMoney } from "react-icons/gi";
import PaymentSuccessModal from "../../../components/auth/registration/PaymentSuccessModal";

import { useCheckoutMutation } from "../../../store/apis/endpoints/checkout";
import toast from "react-hot-toast";

function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData"));

  const [
    checkout,
    { isLoading: isCheckoutLoading, isSuccess, isError, error },
  ] = useCheckoutMutation();

  // Get cart data from localStorage
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  const cartSubtotal = parseFloat(localStorage.getItem("cartSubtotal") || "0");
  const cartVAT = parseFloat(localStorage.getItem("cartVAT") || "0");
  const cartTotal = parseFloat(localStorage.getItem("cartTotal") || "0");

  const VAT_RATE = 10; // 10% VAT

  const handlePaymentComplete = async () => {
    try {
      const paymentTypeMap = {
        bank: "Bank Transfer",
        card: "Credit Card",
        debit: "Debit Card",
        stc: "STC Pay",
        tabby: "Tabby",
      };

      const response = await checkout({
        userId: userData?.id,
        paymentType: paymentTypeMap[paymentMethod],
        vat: VAT_RATE,
      });

      if (response.data) {
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartTotal");
        localStorage.removeItem("cartSubtotal");
        localStorage.removeItem("cartVAT");
        localStorage.removeItem("userData");
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setShowSuccessModal(true);
      localStorage.removeItem("userData");
    } else if (isError) {
      toast.error(error?.data?.message || "Payment failed");
    }
  }, [isSuccess, isError, error]);

  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-8">
          {/* Payment Methods Section */}
          <div className="col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl mb-6">Payment Type</h2>

            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="gap-4"
            >
              <div className="space-y-4">
                <div
                  className={`p-4 border rounded-lg transition-all ${
                    paymentMethod === "bank"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <Radio value="bank" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <BsBank2 className="text-xl" />
                      <span>Bank Transfer</span>
                    </div>
                  </Radio>
                </div>

                <div
                  className={`p-4 border rounded-lg transition-all ${
                    paymentMethod === "card"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <Radio value="card" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <FaCcVisa className="text-2xl text-blue-700" />
                        <FaCcMastercard className="text-2xl text-red-500" />
                      </div>
                      <span>Visa / Master Card</span>
                    </div>
                  </Radio>
                </div>

                <div
                  className={`p-4 border rounded-lg transition-all ${
                    paymentMethod === "debit"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <Radio value="debit" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <BsCreditCard2Front className="text-xl" />
                      <span>Credit/Debit card</span>
                    </div>
                  </Radio>
                </div>

                <div
                  className={`p-4 border rounded-lg transition-all ${
                    paymentMethod === "stc"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <Radio value="stc" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <SiStencyl className="text-xl" />
                      <span>STC Pay</span>
                    </div>
                  </Radio>
                </div>

                <div
                  className={`p-4 border rounded-lg transition-all ${
                    paymentMethod === "tabby"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <Radio value="tabby" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <GiTakeMyMoney className="text-xl" />
                      <span>Tabby</span>
                    </div>
                  </Radio>
                </div>
              </div>
            </RadioGroup>

            {/* Card Details Section - Show only when card is selected */}
            {(paymentMethod === "card" || paymentMethod === "debit") && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg mb-4">Credit card / debit card</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Card number</label>
                    <Input
                      placeholder="1234 1234 1234 1234"
                      className="max-w-md"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">
                        Expiration date
                      </label>
                      <Input placeholder="MM / YY" className="max-w-[200px]" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm mb-1">
                        Security code
                      </label>
                      <Input placeholder="CVC" className="max-w-[100px]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <Checkbox
                checked={acceptTerms}
                onChange={setAcceptTerms}
                size="sm"
              >
                Accept the Terms & Conditions (
                <a href="#" className="text-blue-500 hover:underline">
                  Download Terms & Conditions
                </a>
                )
              </Checkbox>
            </div>
          </div>

          {/* Enhanced Payment Summary Section */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl mb-6">Order Summary</h2>

            {/* Cart Items List */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2 border-b"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <div className="text-xs text-gray-500 mt-1">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      AED {item.price.toFixed(2)} × {item.quantity}
                    </div>
                    <div className="text-sm font-medium text-navy-600">
                      AED {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Calculations */}
            <div className="space-y-3 py-4 border-t border-dashed">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span>AED {cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (10%):</span>
                <span>AED {cartVAT.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2">
                <span>Total Amount:</span>
                <span>AED {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Edit Cart Link */}
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/register/barcodes")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Edit Cart
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/register/barcodes")}
            className="px-6 py-2 border border-navy-600 text-navy-600 rounded-lg hover:bg-navy-50"
          >
            Previous
          </button>
          <Button
            onClick={handlePaymentComplete}
            className="px-6 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 cursor-pointer"
            isDisabled={!acceptTerms || isCheckoutLoading}
            isLoading={isCheckoutLoading}
          >
            {isCheckoutLoading ? "Processing..." : "Complete Payment"}
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}

export default Payment;
