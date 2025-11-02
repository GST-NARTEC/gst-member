import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { useCreateUdiMutation } from "../../../../store/apis/endpoints/udi";
import toast from "react-hot-toast";

function AddUDI({ isOpen, onClose, gtin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      gtin: gtin,
      batchNo: "",
      expiryDate: "",
      qty: 1,
    },
  });

  const [createUdi, { isLoading }] = useCreateUdiMutation();

  const onSubmit = async (data) => {
    try {
      const udiData = {
        ...data,
        qty: parseInt(data.qty, 10),
      };
      await createUdi(udiData).unwrap();
      toast.success("UDI created successfully");
      reset();
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create UDI");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex flex-col gap-1">Add New UDI</ModalHeader>
          <ModalBody>
            <Input
              type="text"
              label="GTIN"
              {...register("gtin", { required: "GTIN is required" })}
              value={gtin}
              isDisabled
              errorMessage={errors.gtin?.message}
            />
            <Input
              type="text"
              label="Batch Number"
              {...register("batchNo", { required: "Batch number is required" })}
              errorMessage={errors.batchNo?.message}
            />
            <Input
              type="number"
              label="Quantity"
              min={1}
              {...register("qty", {
                required: "Quantity is required",
                min: { value: 1, message: "Quantity must be at least 1" },
              })}
              errorMessage={errors.qty?.message}
            />
            <Input
              type="date"
              label="Expiry Date"
              {...register("expiryDate", {
                required: "Expiry date is required",
              })}
              errorMessage={errors.expiryDate?.message}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isLoading}>
              Add UDI
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default AddUDI;
