import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useCreateBrandMutation } from "../../store/apis/endpoints/brands";

function AddBrand({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    document: null,
  });

  const [createBrand, { isLoading }] = useCreateBrandMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nameEn", formData.nameEn);
      formDataToSend.append("nameAr", formData.nameAr);
      if (formData.document) {
        formDataToSend.append("document", formData.document);
      }

      await createBrand(formDataToSend).unwrap();
      onClose();
      setFormData({ nameEn: "", nameAr: "", document: null });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      document: file,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add New Brand</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Brand Name (English)"
                value={formData.nameEn}
                onChange={(e) =>
                  setFormData({ ...formData, nameEn: e.target.value })
                }
                required
              />
              <Input
                label="Brand Name (Arabic)"
                value={formData.nameAr}
                onChange={(e) =>
                  setFormData({ ...formData, nameAr: e.target.value })
                }
                required
              />
              <div className="w-full">
                <label className="block text-sm mb-2">Brand Document</label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                    ${
                      formData.document
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  onClick={() =>
                    document.getElementById("document-upload").click()
                  }
                >
                  <input
                    id="document-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                  />

                  {formData.document ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center text-blue-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formData.document.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(formData.document.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData((prev) => ({ ...prev, document: null }));
                        }}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          Drop your file here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, PNG, JPG up to 10MB
                        </p>
                      </div>
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
            <Button color="primary" type="submit" isLoading={isLoading}>
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default AddBrand;
