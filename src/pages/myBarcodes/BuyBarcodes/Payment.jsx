import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, Radio, Input, Checkbox, Button } from "@nextui-org/react";
import { BsBank2, BsCreditCard2Front } from "react-icons/bs";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { SiStencyl } from "react-icons/si";
import { GiTakeMyMoney } from "react-icons/gi";
import ReactConfetti from "react-confetti";
import { calculatePrice } from "../../../utils/priceCalculations";
import MainLayout from "../../../layout/PortalLayouts/MainLayout";
import toast from "react-hot-toast";

import { useSelector, useDispatch } from "react-redux";
import { selectCurrencySymbol } from "../../../store/slices/currencySymbolSlice";
import {
  selectCartItems,
  selectCartTotals,
  selectVatDetails,
  clearCart,
} from "../../../store/slices/cartSlice";

import { useCreateOrderMutation } from "../../../store/apis/endpoints/checkout";

function Payment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createOrder, { isLoading, isSuccess, isError, error }] =
    useCreateOrderMutation();

  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const currencySymbol = useSelector(selectCurrencySymbol);
  const cartItems = useSelector(selectCartItems);
  const {
    subtotal: cartSubtotal,
    vat: cartVAT,
    total: cartTotal,
  } = useSelector(selectCartTotals);
  const vatDetails = useSelector(selectVatDetails);

  const userId = useSelector((state) => state.member.user?.id);

  const handlePaymentComplete = async () => {
    try {
      const formattedCartItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        addons: (item.selectedAddons || []).map((addon) => ({
          id: addon.id,
          quantity: addon.quantity,
        })),
      }));

      const checkoutPayload = {
        userId,
        cartItems: formattedCartItems,
        paymentType: "Bank Transfer",
        vat: vatDetails.value,
      };

      await createOrder(checkoutPayload);
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error(error?.data?.message || "Payment failed");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setShowConfetti(true);
      dispatch(clearCart());
      toast.success("Order created successfully");
      setTimeout(() => {
        setShowConfetti(false);
        navigate("/member-portal/my-barcodes");
      }, 3000);
    } else if (isError) {
      toast.error(error?.data?.message || "Payment failed");
    }
  }, [isSuccess, isError, error]);

  // Add this useEffect for window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <MainLayout>
        {showConfetti && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
            style={{ position: "fixed", top: 0, left: 0, zIndex: 9999 }}
          />
        )}
        <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Payment Methods Section */}
            <div className="col-span-1 lg:col-span-2 rounded-xl p-4 md:p-6">
              <h2 className="text-lg md:text-xl mb-4 md:mb-6">Payment Type</h2>

              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="gap-3 md:gap-4"
              >
                <div className="space-y-3 md:space-y-4">
                  <div
                    className={`p-3 md:p-4 border rounded-lg transition-all ${
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
                    className={`p-3 md:p-4 border rounded-lg transition-all ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <Radio
                      isDisabled={true}
                      value="card"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="flex gap-1">
                          <FaCcVisa className="text-2xl text-blue-700" />
                          <FaCcMastercard className="text-2xl text-red-500" />
                        </div>
                        <span>Visa / Master Card</span>
                        <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Coming Soon
                        </span>
                      </div>
                    </Radio>
                  </div>

                  <div
                    className={`p-3 md:p-4 border rounded-lg transition-all ${
                      paymentMethod === "debit"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <Radio
                      isDisabled={true}
                      value="debit"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <BsCreditCard2Front className="text-xl" />
                        <span>Credit/Debit card</span>
                        <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Coming Soon
                        </span>
                      </div>
                    </Radio>
                  </div>

                  <div
                    className={`p-3 md:p-4 border rounded-lg transition-all ${
                      paymentMethod === "stc"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <Radio
                      isDisabled={true}
                      value="stc"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <SiStencyl className="text-xl" />
                        <span>STC Pay</span>
                        <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Coming Soon
                        </span>
                      </div>
                    </Radio>
                  </div>

                  <div
                    className={`p-3 md:p-4 border rounded-lg transition-all ${
                      paymentMethod === "tabby"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <Radio
                      isDisabled={true}
                      value="tabby"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <GiTakeMyMoney className="text-xl" />
                        <span>Tabby</span>
                        <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Coming Soon
                        </span>
                      </div>
                    </Radio>
                  </div>
                </div>
              </RadioGroup>

              <div className="mt-6">
                <Checkbox
                  checked={acceptTerms}
                  onChange={setAcceptTerms}
                  size="sm"
                >
                  Accept the Terms & Conditions (
                  <a
                    href="https://api.gstsa1.org/assets/docs/terms-and-conditions.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Download Terms & Conditions
                  </a>
                  )
                </Checkbox>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="col-span-1 bg-white rounded-xl shadow-md p-4 md:p-6 h-fit">
              <h2 className="text-lg md:text-xl mb-4 md:mb-6">Order Summary</h2>

              {/* Cart Items List */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const { totalPrice } = calculatePrice(item.quantity);
                  const addonsTotal = (item.selectedAddons || []).reduce(
                    (sum, addon) => sum + addon.price * addon.quantity,
                    0
                  );

                  return (
                    <div
                      key={item.id}
                      className="flex justify-between py-2 border-b"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <div className="text-xs text-gray-500 mt-1">
                          Quantity: {item.quantity}
                        </div>
                        {item.selectedAddons &&
                          item.selectedAddons.length > 0 && (
                            <div className="mt-2 pl-3 border-l-2 border-gray-200">
                              {item.selectedAddons.map((addon, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs text-gray-500 flex justify-between"
                                >
                                  <span>
                                    {addon.name} × {addon.quantity}
                                  </span>
                                  <span>
                                    {currencySymbol}{" "}
                                    {(addon.price * addon.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-navy-600">
                          {currencySymbol}{" "}
                          {(totalPrice + addonsTotal).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Calculations */}
              <div className="space-y-3 py-4 border-t border-dashed">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>
                    {currencySymbol} {cartSubtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    VAT (
                    {vatDetails.type === "PERCENTAGE"
                      ? `${vatDetails.value}%`
                      : "Fixed"}
                    ):
                  </span>
                  <span>
                    {currencySymbol} {cartVAT.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2">
                  <span>Total Amount:</span>
                  <span>
                    {currencySymbol} {cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 md:mt-8">
            <Button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
            >
              Back
            </Button>
            <Button
              isLoading={isLoading}
              onClick={handlePaymentComplete}
              className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-navy-600 text-white rounded-lg hover:bg-navy-700"
              isDisabled={!acceptTerms}
            >
              Submit
            </Button>
          </div>
        </div>
      </MainLayout>
    </>
  );
}

export default Payment;
