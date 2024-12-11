import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useDeleteUserProductMutation } from "../../store/apis/endpoints/userProducts";

function DeleteMyProduct({ isOpen, onClose, product }) {
  const [deleteProduct, { isLoading }] = useDeleteUserProductMutation();

  const handleDelete = async () => {
    try {
      await deleteProduct({ id: product.id }).unwrap();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Delete Product</ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete the product "{product?.title}"? This action cannot be undone.
          </p>
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

export default DeleteMyProduct;
