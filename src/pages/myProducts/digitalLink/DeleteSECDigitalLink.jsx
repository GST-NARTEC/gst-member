import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useDeleteDigitalLinkSECMutation } from "../../../store/apis/endpoints/digitalLink";

function DeleteSECDigitalLink({ isOpen, onClose, selectedItem }) {
  const [deleteDigitalLink, { isLoading }] = useDeleteDigitalLinkSECMutation();

  const handleDelete = async () => {
    try {
      await deleteDigitalLink(selectedItem.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete digital link:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Delete Digital Link</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this digital link?
          <div className="mt-2">
            <p><strong>Material No:</strong> {selectedItem?.materialNo}</p>
            <p><strong>Purchase Order:</strong> {selectedItem?.purchaseOrder}</p>
            <p><strong>Serial No:</strong> {selectedItem?.serialNo}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={handleDelete}
            isLoading={isLoading}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteSECDigitalLink;
