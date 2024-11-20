import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Image, Skeleton } from "@nextui-org/react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdClose } from "react-icons/md";

// api
import { useGetProductsQuery } from "../../../store/apis/endpoints/products";
import { useAddToCartMutation } from "../../../store/apis/endpoints/cart";

const VAT_RATE = 0.1; // 10% VAT

function Barcodes() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const { data: productsData, isLoading: isProductsLoading } =
    useGetProductsQuery();

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

  const getCartTotals = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const vatAmount = subtotal * VAT_RATE;

    return {
      subtotal,
      vatAmount,
      total: subtotal + vatAmount,
    };
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const handleCheckout = async () => {
    try {
      const { subtotal, vatAmount, total } = getCartTotals();

      const cartData = {
        userId: userData?.id,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await addItemToCart(cartData);

      if (response.data) {
        localStorage.setItem("cartItems", JSON.stringify(cart));
        localStorage.setItem("cartSubtotal", subtotal);
        localStorage.setItem("cartVAT", vatAmount);
        localStorage.setItem("cartTotal", total);
        navigate("/register/payment");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-">
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
      <div className="flex gap-6">
        {/* Products Grid */}
        <div className="flex-grow">
          {isProductsLoading ? (
            <div className="grid grid-cols-3 gap-4">
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
            <div className="grid grid-cols-3 gap-4">
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
                      AED {product.price.toFixed(2)}
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

        {/* Cart */}
        <div className="w-96">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl">Your Cart</h3>
              <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full">
                {cart.length} items
              </span>
            </div>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="relative border-b border-gray-200 p-1 shadow-md"
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
                          AED {item.price.toFixed(2)} × {item.quantity}
                        </span>
                        <span className="text-sm font-bold">
                          AED {getItemTotal(item).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Subtotal:</span>
                    <span>AED {getCartTotals().subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">VAT (10%):</span>
                    <span>AED {getCartTotals().vatAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span>AED {getCartTotals().total.toFixed(2)}</span>
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
