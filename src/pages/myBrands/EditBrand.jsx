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
import { useUpdateBrandMutation } from "../../store/apis/endpoints/brands";
import { FaFilePdf } from "react-icons/fa";

function EditBrand({ isOpen, onClose, brand }) {
  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    document: null,
  });

  const [updateBrand, { isLoading }] = useUpdateBrandMutation();

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (brand) {
      setFormData({
        nameEn: brand.nameEn || "",
        nameAr: brand.nameAr || "",
        document: null,
      });
    }
  }, [brand]);

  useEffect(() => {
    if (brand?.document) {
      setPreview(brand.document);
    }
  }, [brand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brand) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nameEn", formData.nameEn);
      formDataToSend.append("nameAr", formData.nameAr);
      if (formData.document) {
        formDataToSend.append("document", formData.document);
      }

      const payload = {
        id: brand.id,
        data: formDataToSend,
      };

      await updateBrand(payload).unwrap();
      onClose();
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

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const renderPreview = () => {
    if (!preview) return null;

    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(preview);
    const isPDF = /\.pdf$/i.test(preview);

    if (isImage) {
      return (
        <div className="mt-4">
          <img
            src={preview}
            alt="Document preview"
            className="max-w-full h-auto max-h-[200px] object-contain"
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="mt-4 flex items-center gap-2">
          <a href={preview} target="_blank" rel="noopener noreferrer">
            <FaFilePdf size={24} className="text-primary cursor-pointer" />
          </a>
          <p className="text-sm text-gray-500">Pdf Document</p>
        </div>
      );
    }

    return null;
  };

  if (!brand) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Edit Brand</ModalHeader>
          <ModalBody>
            <div className="space-y-7 ">
              <Input
                label="Brand Name (English)"
                labelPlacement="outside"
                value={formData.nameEn}
                onChange={(e) =>
                  setFormData({ ...formData, nameEn: e.target.value })
                }
                required
              />
              <Input
                label="Brand Name (Arabic)"
                labelPlacement="outside"
                value={formData.nameAr}
                onChange={(e) =>
                  setFormData({ ...formData, nameAr: e.target.value })
                }
                required
              />
              <Input
                type="file"
                label="Document"
                labelPlacement="outside"
                accept=".pdf,.doc,.docx"
                className="mt-4"
                onChange={handleFileChange}
              />
              {renderPreview()}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isLoading}>
              Update
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default EditBrand;
