import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Image, Skeleton } from "@nextui-org/react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdClose } from "react-icons/md";

import { useSelector } from "react-redux";
import { selectCurrencySymbol } from "../../../store/slices/currencySymbolSlice";

// api
import { useGetProductsQuery } from "../../../store/apis/endpoints/products";
import { useAddToCartMutation } from "../../../store/apis/endpoints/cart";
import { useGetTaxQuery } from "../../../store/apis/endpoints/tax";

function Barcodes() {
  const navigate = useNavigate();
  const currencySymbol = useSelector(selectCurrencySymbol);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const { data: productsData, isLoading: isProductsLoading } =
    useGetProductsQuery();

  const { data: taxData, isLoading: isTaxLoading } = useGetTaxQuery();

  const [addItemToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const userData = JSON.parse(localStorage.getItem("userData"));

  const defaultImage =
    "https://www.sagedata.com/images/2007/Code_128_Barcode_Graphic.jpg";

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const getItemTotal = (item) => {
    return item.price * item.quantity;
  };

  const vatDetails = taxData?.data?.vats?.[0] || {
    value: 0,
    type: "PERCENTAGE",
  };

  const getCartTotals = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const vatAmount =
      vatDetails.type === "PERCENTAGE"
        ? subtotal * (vatDetails.value / 100)
        : vatDetails.value;

    return {
      subtotal,
      vatAmount,
      total: subtotal + vatAmount,
      vatId: vatDetails.id,
      vatValue: vatDetails.value,
      vatType: vatDetails.type,
    };
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const handleCheckout = async () => {
    try {
      const { subtotal, vatAmount, total, vatId } = getCartTotals();

      const cartData = {
        userId: userData?.id,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        // vatId: vatId,
      };

      const response = await addItemToCart(cartData);

      if (response.data) {
        localStorage.setItem("cartItems", JSON.stringify(cart));
        localStorage.setItem("cartSubtotal", subtotal);
        localStorage.setItem("cartVAT", vatAmount);
        localStorage.setItem("cartTotal", total);
        localStorage.setItem(
          "cartVatDetails",
          JSON.stringify({
            id: vatId,
            calculatedVat: vatAmount,
            value: vatDetails.value,
            type: vatDetails.type,
          })
        );
        navigate("/register/payment");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Navigation buttons at top */}
      <div className="mb-4 flex justify-start items-center">
        <button
          onClick={() => navigate("/register/membership-form")}
          className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
        >
          Back
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Products Grid */}
        <div className="flex-1">
          {isProductsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="p-4 shadow-md">
                  <div className="flex flex-col items-center text-center">
                    <Skeleton className="w-32 h-24 rounded-lg mb-3" />
                    <Skeleton className="w-3/4 h-4 rounded-lg mb-1" />
                    <Skeleton className="w-full h-8 rounded-lg mb-2" />
                    <Skeleton className="w-20 h-4 rounded-lg mb-3" />
                    <Skeleton className="w-full h-8 rounded-lg" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productsData?.data?.products.map((product) => (
                <Card
                  key={product.id}
                  className="p-4 shadow-md hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col items-center text-center">
                    <Image
                      src={product.image || defaultImage}
                      alt={product.title}
                      className="w-32 h-24 object-contain mb-3"
                    />
                    <h3 className="text-sm mb-1">{product.title}</h3>
                    <p className="text-gray-500 text-xs mb-2 h-8 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-sm font-bold text-navy-600 mb-3">
                      {currencySymbol} {product.price.toFixed(2)}
                    </p>
                    <Button
                      className="w-full bg-navy-600 hover:bg-navy-700 text-white"
                      size="sm"
                      onClick={() => addToCart(product)}
                      isLoading={isProductsLoading}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Cart - Fixed width sidebar */}
        <div className="w-full lg:w-[280px] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <Card className="p-4 h-full overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Your Cart</h3>
              <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full">
                {cart.length} items
              </span>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="relative border border-gray-200 rounded-lg p-3 shadow-sm"
                >
                  <div className="flex gap-3 ">
                    <div className="w-24 ">
                      <Image
                        src={item.image || defaultImage}
                        alt={item.name}
                        className="w-24 h-20 object-contain mb-1"
                      />
                      {/* <h4 className="text-sm">{item.name}</h4> */}
                      <div className="flex items-center bg-gray-50 rounded-md border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-gray-500 hover:text-gray-700"
                        >
                          −
                        </button>
                        <span className="px-2 py-0.5 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-gray-500 hover:text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-gray-500 text-sm">
                          {item.title}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MdClose size={16} />
                        </button>
                      </div>

                      <div className="flex justify-end flex-col items-end">
                        <span className="text-sm">
                          {currencySymbol} {item.price.toFixed(2)} ×{" "}
                          {item.quantity}
                        </span>
                        <span className="text-sm font-bold">
                          {currencySymbol} {getItemTotal(item).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
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
                      {vatDetails.type === "PERCENTAGE"
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
                  isLoading={isAddingToCart}
                  isDisabled={isAddingToCart}
                >
                  {isAddingToCart ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Barcodes;
