import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useDeleteUdiMutation } from "../../../../store/apis/endpoints/udi";
import toast from "react-hot-toast";

function DeleteUDI({ isOpen, onClose, selectedItem }) {
  const [deleteUdi, { isLoading }] = useDeleteUdiMutation();

  const handleDelete = async () => {
    try {
      await deleteUdi(selectedItem.id).unwrap();
      toast.success("UDI deleted successfully");
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete UDI");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Delete UDI</ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete UDI with serial number:{" "}
            <span className="font-semibold">{selectedItem?.serialNo}</span>?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="danger" onPress={handleDelete} isLoading={isLoading}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteUDI;
