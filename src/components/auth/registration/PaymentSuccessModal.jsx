import React from "react";
import { Modal, ModalContent, ModalBody, Button } from "@heroui/react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccessModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      size="lg"
      className="bg-white"
      style={{ zIndex: 9998 }}
    >
      <ModalContent>
        <ModalBody className="py-12 px-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Success Icon */}
            <div className="bg-green-100 p-4 rounded-full">
              <FaCheckCircle className="text-green-500 text-5xl" />
            </div>

            {/* Success Message */}
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                Registration Successful!
              </h2>
              <p className="text-green-500 font-medium text-lg">
                Welcome to our membership program
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-4 text-gray-600 max-w-md">
              <p>
                Your registration is complete! We've sent your member portal
                credentials to your registered email address. Please check your
                inbox to access your account.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col w-full gap-3 mt-4">
              <Button
                className="w-full bg-navy-700 text-white"
                size="lg"
                onClick={() => navigate("/member-portal/login")}
              >
                Go to Login
              </Button>

              <div className="flex items-center gap-2 justify-center text-sm">
                <span className="text-gray-600">Didn't receive the email?</span>
                <Button
                  variant="light"
                  className="text-navy-700 hover:text-navy-800 p-0"
                  // onClick={() => navigate("/support")}
                >
                  Contact support
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
