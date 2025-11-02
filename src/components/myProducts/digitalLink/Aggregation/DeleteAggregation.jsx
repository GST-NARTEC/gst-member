import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import toast from "react-hot-toast";
import { useDeleteAggregationMutation } from "../../../../store/apis/endpoints/aggregation";

function DeleteAggregation({ isOpen, onClose, selectedItem }) {
  const [deleteAggregation, { isLoading }] = useDeleteAggregationMutation();

  const handleDelete = async () => {
    try {
      if (!selectedItem?.id) {
        throw new Error("No aggregation ID provided");
      }
      await deleteAggregation({ id: selectedItem.id }).unwrap();
      toast.success("Aggregation deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting aggregation:", error);
      toast.error(error.data?.message || "Failed to delete aggregation");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-danger">Delete Aggregation</h2>
        </ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete this aggregation?
            <br />
            <span className="font-semibold">
              Serial No: {selectedItem?.serialNo}
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={onClose}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={handleDelete}
            isLoading={isLoading}
            className="min-w-[100px]"
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteAggregation;
