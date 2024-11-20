import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";

// api
import {
  useVerifyOtpMutation,
  useSendOtpMutation,
} from "../../../store/apis/endpoints/User";
import toast from "react-hot-toast";

const OtpVerificationModal = ({
  isOpen,
  onOpenChange,
  onVerify,
  email,
  emailData,
}) => {
  const [
    verifyOtp,
    { isLoading: isVerifyingOtp, isSuccess: isVerified, isError, error },
  ] = useVerifyOtpMutation();

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();

  console.log(emailData);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    } else if (isVerified) {
      toast.success("OTP verified successfully");
      onVerify();
      onOpenChange(false);
    }
  }, [isError, error, isVerified]);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = Array(4)
    .fill(0)
    .map(() => React.createRef());

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", ""]);
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (value !== "" && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 4) {
      toast.error("Please enter all 4 digits");
      return;
    }

    try {
      await verifyOtp({
        otp: otpString,
        token: emailData?.token,
      }).unwrap();
    } catch (err) {
      // Error handled in useEffect
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp({ email }).unwrap();
      toast.success("OTP resent successfully");
      setOtp(["", "", "", ""]);
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl">Email Verification</h3>
              <p className="text-sm text-default-500">
                Enter the 4-digit code sent to {email}
              </p>
            </ModalHeader>

            <ModalBody>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14"
                    classNames={{
                      input: "text-center text-xl",
                      inputWrapper: "h-14",
                    }}
                    size="lg"
                    disabled={isVerifyingOtp}
                  />
                ))}
              </div>
            </ModalBody>

            <ModalFooter className="flex flex-col items-center">
              <p className="text-sm text-default-500 mb-4">
                Didn't receive the code?{" "}
                <Button
                  variant="light"
                  className="text-navy-600 p-0"
                  onPress={handleResend}
                  isDisabled={isSendingOtp}
                >
                  {isSendingOtp ? "Sending..." : "Resend"}
                </Button>
              </p>
              <div className="flex gap-2 justify-end w-full">
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-navy-600 text-white hover:bg-navy-700"
                  onClick={handleVerify}
                  isDisabled={!otp.every((digit) => digit) || isVerifyingOtp}
                  isLoading={isVerifyingOtp}
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default OtpVerificationModal;
