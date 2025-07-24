import React from "react";
import { Card, Button, Image } from "@nextui-org/react";
import { MdClose } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  updateQuantity,
  removeFromCart,
  selectCartItems,
  selectCartTotals,
  setCartTotals,
  setVatDetails,
} from "../../../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import Addons from "./Addons";
import { calculatePrice } from "../../../utils/priceCalculations";

function Cart({ currencySymbol, vatDetails, defaultImage }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems) || [];
  const [isAddonsOpen, setIsAddonsOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(null);

  const handleAddonsClick = (item, index) => {
    setSelectedItem(item);
    setSelectedItemIndex(index);
    setIsAddonsOpen(true);
  };

  const getCartTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const itemTotal = getItemTotal(item);
      return sum + itemTotal;
    }, 0);

    const vatAmount =
      vatDetails?.type === "PERCENTAGE"
        ? subtotal * ((vatDetails?.value || 0) / 100)
        : vatDetails?.value || 0;

    const total = subtotal + vatAmount;

    dispatch(setCartTotals({ subtotal, vat: vatAmount, total }));
    return { subtotal, vatAmount, total, vatId: vatDetails?.id };
  };

  const handleCheckout = () => {
    const { vatAmount, vatId } = getCartTotals();
    dispatch(
      setVatDetails({
        id: vatId,
        calculatedVat: vatAmount,
        value: vatDetails?.value || 0,
        type: vatDetails?.type || "PERCENTAGE",
      })
    );
    navigate("/register/membership-form");
  };

  const getItemTotal = (item) => {
    if (!item) return 0;
    const { totalPrice } = calculatePrice(item.quantity || 0);
    const addonsTotal = (item.selectedAddons || []).reduce(
      (sum, addon) => sum + (addon.price || 0) * (addon.quantity || 1),
      0
    );
    return totalPrice + addonsTotal;
  };

  const updateItemQuantity = (productId, change) => {
    dispatch(updateQuantity({ productId, change }));
  };

  const removeItemFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <Card className="p-4 h-full overflow-auto">
      <Addons
        isOpen={isAddonsOpen}
        onOpenChange={setIsAddonsOpen}
        selectedItem={selectedItem}
        selectedItemIndex={selectedItemIndex}
        currencySymbol={currencySymbol}
      />
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Your Cart</h3>
        <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full">
          {cartItems.length} items
        </span>
      </div>

      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
        {cartItems.map((item, index) => {
          const { unitPrice, totalPrice } = calculatePrice(item.quantity || 1);
          return (
            <div
              key={item.id}
              className="relative border border-gray-200 rounded-lg p-3 shadow-sm"
            >
              <div className="flex gap-3">
                <div className="w-24">
                  <Image
                    src={item.image || defaultImage}
                    alt={item.title}
                    className="w-24 h-20 object-contain mb-1"
                  />
                  <div className="flex items-center bg-gray-50 rounded-md border border-gray-200 min-w-[110px] max-w-[140px]">
                    <button
                      onClick={() => updateItemQuantity(item.id, -1)}
                      className="px-2 py-0.5 text-gray-500 hover:text-gray-700"
                    >
                      −
                    </button>
                    <input
                      // type="number"
                      min={1}
                      value={item.quantity || 1}
                      onChange={(e) => {
                        let value = parseInt(e.target.value, 10);
                        if (isNaN(value) || value < 1) value = 1;
                        dispatch(
                          updateQuantity({
                            productId: item.id,
                            change: value - (item.quantity || 1),
                            absolute: true,
                          })
                        );
                      }}
                      className="flex-1 w-10 px-2 py-0.5 text-sm text-center border-none bg-transparent focus:outline-none"
                    />

                    <button
                      onClick={() => updateItemQuantity(item.id, 1)}
                      className="px-2 py-0.5 text-gray-500 hover:text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-gray-500 text-sm">
                        {item.title}
                      </span>
                      {Array.isArray(item.addons) && item.addons.length > 0 && (
                        <button
                          onClick={() => handleAddonsClick(item, index)}
                          className="ml-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <FaPlus size={10} />
                          Add Options
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => removeItemFromCart(item.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MdClose size={16} />
                    </button>
                  </div>

                  {Array.isArray(item.selectedAddons) &&
                    item.selectedAddons.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500">
                          {item.selectedAddons.map((addon, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>
                                {addon.name} × {addon.quantity || 1}
                              </span>
                              <span>
                                {currencySymbol}{" "}
                                {(
                                  (addon.price || 0) * (addon.quantity || 1)
                                ).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="flex justify-end flex-col items-end">
                    <span className="text-sm font-bold">
                      {currencySymbol} {getItemTotal(item).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cartItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Subtotal:</span>
              <span>
                {currencySymbol} {getCartTotals().subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">
                VAT (
                {vatDetails?.type === "PERCENTAGE"
                  ? `${vatDetails.value}%`
                  : "Fixed"}
                ):
              </span>
              <span>
                {currencySymbol} {getCartTotals().vatAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span>Total:</span>
              <span>
                {currencySymbol} {getCartTotals().total.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            className="w-full mt-4 bg-navy-600 hover:bg-navy-700 text-white"
          >
            Save & Next
          </Button>
        </div>
      )}
    </Card>
  );
}

export default Cart;
