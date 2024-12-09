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
    setFormData(prev => ({
      ...prev,
      document: file
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
              <Input
                type="file"
                label="Document"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isLoading}
            >
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default AddBrand;
