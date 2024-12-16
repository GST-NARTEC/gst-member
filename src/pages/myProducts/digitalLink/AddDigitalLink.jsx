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
import { useCreateDigitalLinkMutation } from "../../../store/apis/endpoints/digitalLink";
import toast from "react-hot-toast";

function AddDigitalLink({ isOpen, onClose, gtin, digitalType }) {
  const [targetUrl, setTargetUrl] = useState("");
  const [createDigitalLink, { isLoading }] = useCreateDigitalLinkMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createDigitalLink({
        url: targetUrl,
        digitalType: digitalType,
        gtin: gtin,
      }).unwrap();

      onClose();
      setTargetUrl("");
      toast.success("Digital link added successfully");
    } catch (error) {
      console.error("Failed to create digital link:", error);
      toast.error("Failed to add digital link");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add Digital Link</ModalHeader>
          <ModalBody className="gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">GTIN:</span>
                <span className="text-gray-600">{gtin}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">
                  Digital Type:
                </span>
                <span className="text-gray-600">{digitalType}</span>
              </div>
            </div>
            <Input
              type="text"
              label="Target URL"
              placeholder="Enter target URL"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              required
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isLoading}>
              Add Digital Link
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default AddDigitalLink;
