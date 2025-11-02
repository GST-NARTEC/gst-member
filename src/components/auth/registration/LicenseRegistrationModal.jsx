import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { FiUploadCloud } from "react-icons/fi";
import { MdOutlineFilePresent, MdClose } from "react-icons/md";
import { useRegisterLicenseMutation } from "../../../store/apis/endpoints/license";
import toast from "react-hot-toast";

const LicenseRegistrationModal = ({ isOpen, onClose, onLicenseSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [error, setError] = useState("");

  const [
    registerLicense,
    { isLoading, isSuccess, isError, error: registerLicenseError },
  ] = useRegisterLicenseMutation();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleLicenseChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setLicenseNumber(value);
    setError(
      value.length === 10 || value.length === 0
        ? ""
        : "License number must be exactly 10 digits"
    );
  };

  const handleSubmit = async () => {
    if (licenseNumber.length !== 10) {
      setError("License number must be exactly 10 digits");
      return;
    }

    const formData = new FormData();
    formData.append("license", licenseNumber);
    formData.append("document", selectedFile);

    try {
      const response = await registerLicense(formData).unwrap();
      const registeredLicense = licenseNumber;

      setLicenseNumber("");
      setSelectedFile(null);
      setError("");

      onLicenseSuccess({
        licenseNumber: registeredLicense,
        isVerified: true,
      });
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  useEffect(() => {
    if (isError) {
      toast.error(
        registerLicenseError?.data?.message || "Something went wrong"
      );
    } else if (isSuccess) {
      toast.success("License registered successfully");
    }
  }, [isError, registerLicenseError, isSuccess, registerLicenseError]);


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">
            Upload your company License Document
          </h3>
          <p className="text-sm text-gray-500">
            Please provide your license details below
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div>
              <Input
                label="License Number"
                placeholder="Enter 10-digit license number"
                value={licenseNumber}
                onChange={handleLicenseChange}
                maxLength={10}
                color={error ? "danger" : "default"}
                errorMessage={error}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be exactly 10 digits
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                License Document
              </label>

              <div className="relative">
                {!selectedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex flex-col items-center text-sm">
                        <p className="font-semibold text-navy-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-gray-500">
                          Please upload the PDF document of your company license
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PDF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-navy-50 rounded-lg">
                        <MdOutlineFilePresent className="h-6 w-6 text-navy-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <MdClose className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
            isDisabled={licenseNumber.length !== 10 || !selectedFile}
          >
            Register License
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LicenseRegistrationModal;
