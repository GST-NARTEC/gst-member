import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
} from "@nextui-org/react";
import { FaTrash, FaUpload, FaEye, FaReceipt, FaFilePdf } from "react-icons/fa";
import {
  useUploadBankSlipMutation,
  useDeleteBankSlipMutation,
} from "../../store/apis/endpoints/order";
import toast from "react-hot-toast";

import { useSelector } from "react-redux";
import { selectCurrencySymbol } from "../../store/slices/currencySymbolSlice";

function BankSlipModal({ isOpen, onOpenChange, order }) {
  const [
    uploadBankSlip,
    {
      isLoading: isUploading,
      isSuccess: isUploadSuccess,
      error: uploadError,
      isError: isUploadError,
    },
  ] = useUploadBankSlipMutation();
  const [
    deleteBankSlip,
    {
      isLoading: isDeleting,
      isSuccess: isDeleteSuccess,
      error: deleteError,
      isError: isDeleteError,
    },
  ] = useDeleteBankSlipMutation();

  const currencySymbol = useSelector(selectCurrencySymbol);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("bankSlip", file);
      formData.append("orderNumber", order.orderNumber);

      try {
        await uploadBankSlip(formData).unwrap();
        onOpenChange(false); // Close modal on success
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBankSlip(order.orderNumber).unwrap();
      onOpenChange(false); // Close modal on success
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
    if (isUploadSuccess) {
      toast.success("Bank slip uploaded successfully");
    } else if (isUploadError) {
      toast.error(uploadError.data.message || "Failed to upload bank slip");
    }
  }, [isUploadSuccess, uploadError, isUploadError]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success("Bank slip deleted successfully");
    } else if (isDeleteError) {
      toast.error(deleteError.data.message || "Failed to delete bank slip");
    }
  }, [isDeleteSuccess, deleteError, isDeleteError]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      size="2xl"
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
              <div className="flex items-center gap-2">
                <FaReceipt className="text-xl text-primary" />
                <h3 className="text-xl font-semibold text-navy-700">
                  Payment Slip
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                Order ID: {order?.orderNumber}
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{order?.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{order?.paymentType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium">
                      {currencySymbol} {order?.overallAmount}
                    </p>
                  </div>
                </div>

                {order?.bankSlip ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          Current Payment Slip
                        </h4>
                        {/* <p className="text-sm text-gray-500">
                          {order.bankSlip}
                        </p> */}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          color="primary"
                          variant="flat"
                          className="hover:scale-105 transition-transform"
                          onClick={() => window.open(order.bankSlip, "_blank")}
                          isDisabled={isDeleting}
                        >
                          <FaEye className="text-lg" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="flat"
                          className="hover:scale-105 transition-transform"
                          onClick={handleDelete}
                          isLoading={isDeleting}
                          isDisabled={isDeleting}
                        >
                          {!isDeleting && <FaTrash className="text-lg" />}
                        </Button>
                      </div>
                    </div>
                    <div className="aspect-video relative bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                      {order.bankSlip.toLowerCase().endsWith(".pdf") ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-3">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <FaFilePdf className="text-4xl text-red-500" />
                          </div>
                          <p className="text-sm font-medium text-gray-600">
                            PDF Document
                          </p>
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            className="mt-2"
                            onClick={() =>
                              window.open(order.bankSlip, "_blank")
                            }
                          >
                            View PDF
                          </Button>
                        </div>
                      ) : (
                        <div className="relative w-full h-full group">
                          <Image
                            src={order.bankSlip}
                            alt="Bank Slip"
                            className="object-contain w-full h-full transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 hover:border-primary/50 transition-colors relative">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="file-upload"
                      className={`flex flex-col items-center justify-center ${
                        isUploading
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <div className="p-4 bg-primary-50 rounded-full mb-4 transition-transform hover:scale-110">
                        {isUploading ? (
                          <div className="animate-spin">
                            <svg
                              className="w-6 h-6 text-primary"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </div>
                        ) : (
                          <FaUpload className="text-3xl text-primary" />
                        )}
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">
                        {isUploading ? "Uploading..." : "Upload Payment Slip"}
                      </h4>
                      <p className="text-sm text-gray-500 text-center">
                        {isUploading ? (
                          "Please wait while we process your file"
                        ) : (
                          <>
                            Click to upload or drag and drop
                            <br />
                            PDF or Image files
                          </>
                        )}
                      </p>
                    </label>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default BankSlipModal;
