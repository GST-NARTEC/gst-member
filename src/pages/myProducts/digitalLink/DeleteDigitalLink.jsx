import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useDeleteDigitalLinkMutation } from "../../../store/apis/endpoints/digitalLink";
import toast from "react-hot-toast";

function DeleteDigitalLink({ isOpen, onClose, digitalLink }) {
  const [deleteDigitalLink, { isLoading }] = useDeleteDigitalLinkMutation();

  const handleDelete = async () => {
    try {
      await deleteDigitalLink(digitalLink.id).unwrap();
      onClose();
      toast.success("Digital link deleted successfully");
    } catch (error) {
      console.error("Failed to delete digital link:", error);
      toast.error("Failed to delete digital link");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Delete Digital Link</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this digital link?</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">GTIN:</span>
              <span className="text-gray-600">{digitalLink?.gtin}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Digital Type:</span>
              <span className="text-gray-600">{digitalLink?.digitalType}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">URL:</span>
              <span className="text-gray-600">{digitalLink?.url}</span>
            </div>
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

export default DeleteDigitalLink;
