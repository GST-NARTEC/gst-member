import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useDeleteGLNLocationMutation } from "../../store/apis/endpoints/gln";

function DeleteGLNLocation({ isOpen, onClose, glnData }) {
  const [deleteGLN, { isLoading }] = useDeleteGLNLocationMutation();

  const handleDelete = async () => {
    try {
      await deleteGLN(glnData.id).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to delete GLN:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-2 items-center">
              <FaExclamationTriangle className="text-danger" />
              <span>Delete GLN Location</span>
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete the GLN location "
                {glnData?.locationNameEn}"? This action cannot be undone.
              </p>
              {glnData?.locationNameAr && (
                <p className="text-gray-500 mt-2">{glnData.locationNameAr}</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={isLoading}>
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
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DeleteGLNLocation;
