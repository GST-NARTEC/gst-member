import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useSelector } from "react-redux";
import { selectCurrencySymbol } from "../../store/slices/currencySymbolSlice";

function OrderDetailsModal({ isOpen, onOpenChange, order }) {
  if (!order) return null;

  const currencySymbol = useSelector(selectCurrencySymbol);

  const calculateItemTotal = (item) => {
    const productTotal = item.price * item.quantity;
    const addonsTotal =
      item.addonItems?.reduce(
        (sum, addon) => sum + addon.price * addon.quantity,
        0
      ) || 0;
    return productTotal + addonsTotal;
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      size="3xl"
      classNames={{
        base: "bg-white",
        header: "border-b border-gray-200",
        body: "py-6",
        footer: "border-t border-gray-200",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold text-navy-700">
                Order Details
              </h3>
              <p className="text-sm text-gray-500">
                Order ID: {order?.orderNumber}
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{order.paymentType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{order.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">
                      {currencySymbol} {order.overallAmount}
                    </p>
                  </div>
                </div>

                {/* Updated Order Items Display */}
                <div className="space-y-6">
                  {order.orderItems?.map((item, index) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-start items-center mb-3">
                        <h4 className="text-lg font-semibold">
                          Order Item #{index + 1}
                        </h4>
                       
                      </div>

                      {/* Main Product */}
                      <div className="bg-white p-4 rounded-md mb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-navy-700">
                              {item.product.title}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {item.product.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {currencySymbol} {item.price}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Addons Section */}
                      {item.addonItems && item.addonItems.length > 0 && (
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Add-ons:
                          </p>
                          <div className="space-y-2">
                            {item.addonItems.map((addonItem) => (
                              <div
                                key={addonItem.id}
                                className="bg-white p-3 rounded-md flex justify-between items-center border border-gray-100"
                              >
                                <div>
                                  <p className="font-medium text-sm">
                                    {addonItem.addon.name}
                                  </p>
                                  {addonItem.addon.unit && (
                                    <p className="text-xs text-gray-500">
                                      Unit: {addonItem.addon.unit}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-sm">
                                    {currencySymbol} {addonItem.price}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Qty: {addonItem.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Order Totals - with divider */}
                <div className="border-t pt-4 mt-6">
                  <div className="space-y-2 text-right">
                    <p className="text-sm">
                      Subtotal:{" "}
                      <span className="font-medium">
                        {currencySymbol} {order.totalAmount}
                      </span>
                    </p>
                    {order.taxAmount > 0 && (
                      <p className="text-sm">
                        Tax:{" "}
                        <span className="font-medium">
                          {currencySymbol} {order.taxAmount}
                        </span>
                      </p>
                    )}
                    {order.vat > 0 && (
                      <p className="text-sm">
                        VAT:{" "}
                        <span className="font-medium">
                          {currencySymbol} {order.vat}
                        </span>
                      </p>
                    )}
                    <p className="text-lg font-semibold border-t pt-2">
                      Total:{" "}
                      <span>
                        {currencySymbol} {order.overallAmount}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
                className="text-gray-600 hover:bg-gray-100"
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default OrderDetailsModal;
