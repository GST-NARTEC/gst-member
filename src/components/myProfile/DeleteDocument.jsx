import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useDeleteUserDocMutation } from "../../store/apis/endpoints/userDocs";
import toast from "react-hot-toast";

function DeleteDocument({ isOpen, onClose, document }) {
  const [deleteUserDoc, { isLoading }] = useDeleteUserDocMutation();

  const handleDelete = async () => {
    try {
      await deleteUserDoc(document.id).unwrap();
      onClose();
      toast.success("Document deleted successfully!");
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Delete Document</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this document? This action cannot be
          undone.
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

export default DeleteDocument;
