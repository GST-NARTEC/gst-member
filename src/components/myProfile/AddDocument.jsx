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
import { useCreateUserDocMutation } from "../../store/apis/endpoints/userDocs";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function AddDocument({ isOpen, onClose }) {
  const { user } = useSelector((state) => state.member);

  const [formData, setFormData] = useState({
    name: "",
    doc: null,
  });
  const [createUserDoc, { isLoading }] = useCreateUserDocMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("doc", formData.doc);
    formDataToSend.append("userId", user.id);

    try {
      await createUserDoc(formDataToSend).unwrap();
      onClose();
      setFormData({ name: "", doc: null });
      toast.success("Document added successfully");
    } catch (error) {
      console.error("Failed to create document:", error);
      toast.error("Failed to add document");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add New Document</ModalHeader>
          <ModalBody className="gap-4">
            <Input
              label="Document Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              type="file"
              label="Upload Document"
              onChange={(e) =>
                setFormData({ ...formData, doc: e.target.files[0] })
              }
              required
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isLoading}>
              Add Document
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default AddDocument;
