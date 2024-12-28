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
import toast from "react-hot-toast";
import { useCreateAggregationMutation } from "../../../../store/apis/endpoints/aggregation";

function AddAggregation({ isOpen, onClose, gtin }) {
  const [createAggregation, { isLoading }] = useCreateAggregationMutation();

  const [formData, setFormData] = useState({
    gtin: gtin || "",
    qty: "",
    batchNo: "",
    manufacturingDate: "",
    expiryDate: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const aggregationData = {
        ...formData,
        qty: parseInt(formData.qty, 10),
        gtin: formData.gtin || gtin,
      };

      await createAggregation(aggregationData).unwrap();
      toast.success("Aggregation added successfully");
      onClose();
    } catch (error) {
      console.error("Error creating aggregation:", error);
      toast.error(error.data?.message || "Failed to create aggregation");
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
            <h2 className="text-2xl font-bold text-primary">Add Aggregation</h2>
            {gtin && <p className="text-sm text-gray-500">GTIN # {gtin}</p>}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {!gtin && (
                  <Input
                    label="GTIN"
                    placeholder="Enter GTIN"
                    value={formData.gtin}
                    onChange={(e) => handleChange("gtin", e.target.value)}
                    isRequired
                    classNames={{
                      label: "text-primary",
                    }}
                  />
                )}
                <Input
                  label="Quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.qty}
                  onChange={(e) => handleChange("qty", e.target.value)}
                  isRequired
                  classNames={{
                    label: "text-primary",
                  }}
                />
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
              </div>
              <div className="space-y-4">
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

export default AddAggregation;
