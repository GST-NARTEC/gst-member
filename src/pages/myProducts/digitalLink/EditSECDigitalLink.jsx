import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@heroui/react";
import toast from "react-hot-toast";
import { useUpdateDigitalLinkSECMutation } from "../../../store/apis/endpoints/digitalLink";

function EditSECDigitalLink({ isOpen, onClose, selectedItem }) {
  const [updateDigitalLink, { isLoading }] = useUpdateDigitalLinkSECMutation();

  const [formData, setFormData] = useState({
    materialNo: "",
    purchaseOrder: "",
    vendor: "",
    serialNo: "",
    date: "",
    text: "",
  });

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        materialNo: selectedItem.materialNo || "",
        purchaseOrder: selectedItem.purchaseOrder || "",
        vendor: selectedItem.vendor || "",
        serialNo: selectedItem.serialNo || "",
        date: selectedItem.date ? new Date(selectedItem.date).toISOString().split('T')[0] : "",
        text: selectedItem.text || "",
      });
    }
  }, [selectedItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDigitalLink({
        id: selectedItem.id,
        data: {
          ...formData,
          date: formData.date || null,
        },
      }).unwrap();
      toast.success("SEC Digital link updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating SEC digital link:", error);
      toast.error(error.data?.message || "Failed to update SEC digital link");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      classNames={{
        body: "py-6",
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-primary">
              Edit SEC Digital Link
            </h2>
            {selectedItem && (
              <p className="text-sm text-gray-500">
                ID # {selectedItem.id}
              </p>
            )}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Material No"
                  placeholder="Enter material number"
                  value={formData.materialNo}
                  onChange={(e) => handleChange("materialNo", e.target.value)}
                  isRequired
                  classNames={{
                    label: "text-primary",
                  }}
                />
                <Input
                  label="Purchase Order"
                  placeholder="Enter purchase order"
                  value={formData.purchaseOrder}
                  onChange={(e) => handleChange("purchaseOrder", e.target.value)}
                  isRequired
                  classNames={{
                    label: "text-primary",
                  }}
                />
                <Input
                  label="Vendor"
                  placeholder="Enter vendor name"
                  value={formData.vendor}
                  onChange={(e) => handleChange("vendor", e.target.value)}
                  isRequired
                  classNames={{
                    label: "text-primary",
                  }}
                />
              </div>
              <div className="space-y-4">
                <Input
                  label="Serial No"
                  placeholder="Enter serial number"
                  value={formData.serialNo}
                  onChange={(e) => handleChange("serialNo", e.target.value)}
                  isRequired
                  classNames={{
                    label: "text-primary",
                  }}
                />
                <Input
                  label="Date"
                  type="date"
                  placeholder="Select date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  isRequired
                  classNames={{
                    label: "text-primary",
                  }}
                />
                <Textarea
                  label="Additional Text"
                  placeholder="Enter additional information"
                  value={formData.text}
                  onChange={(e) => handleChange("text", e.target.value)}
                  isRequired
                  classNames={{
                    label: "text-primary",
                  }}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="mt-4">
            <Button
              color="danger"
              variant="light"
              onPress={onClose}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              color="primary"
              type="submit"
              className="min-w-[100px]"
            >
              Save Changes
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default EditSECDigitalLink;
