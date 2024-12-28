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
import toast from "react-hot-toast";
import { useUpdateAggregationMutation } from "../../../../store/apis/endpoints/aggregation";

function EditAggregation({ isOpen, onClose, selectedItem }) {
  const [updateAggregation, { isLoading }] = useUpdateAggregationMutation();

  const [formData, setFormData] = useState({
    batchNo: "",
    manufacturingDate: "",
    expiryDate: "",
  });

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        batchNo: selectedItem.batchNo || "",
        manufacturingDate: selectedItem.manufacturingDate
          ? new Date(selectedItem.manufacturingDate).toISOString().slice(0, 16)
          : "",
        expiryDate: selectedItem.expiryDate
          ? new Date(selectedItem.expiryDate).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [selectedItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: selectedItem?.id,
        data: {
          batchNo: formData.batchNo,
          manufacturingDate: new Date(formData.manufacturingDate).toISOString(),
          expiryDate: new Date(formData.expiryDate).toISOString(),
        },
      };
      await updateAggregation(payload).unwrap();
      toast.success("Aggregation updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating aggregation:", error);
      toast.error(error.data?.message || "Failed to update aggregation");
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
              Edit Aggregation
            </h2>
            <p className="text-sm text-gray-500">
              Serial No: {selectedItem?.serialNo}
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Batch No"
                placeholder="Enter batch number"
                value={formData.batchNo}
                onChange={(e) => handleChange("batchNo", e.target.value)}
                isRequired
                classNames={{
                  label: "text-primary",
                }}
              />
              <Input
                label="Manufacturing Date"
                type="datetime-local"
                placeholder="Select manufacturing date"
                value={formData.manufacturingDate}
                onChange={(e) =>
                  handleChange("manufacturingDate", e.target.value)
                }
                isRequired
                classNames={{
                  label: "text-primary",
                }}
              />
              <Input
                label="Expiry Date"
                type="datetime-local"
                placeholder="Select expiry date"
                value={formData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                isRequired
                classNames={{
                  label: "text-primary",
                }}
              />
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
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default EditAggregation;
