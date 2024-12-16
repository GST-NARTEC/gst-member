import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useUpdateDigitalLinkMutation } from "../../../store/apis/endpoints/digitalLink";
import toast from "react-hot-toast";

function EditDigitalLink({ isOpen, onClose, digitalLink }) {
  const [targetUrl, setTargetUrl] = useState("");
  const [updateDigitalLink, { isLoading }] = useUpdateDigitalLinkMutation();

  useEffect(() => {
    if (digitalLink) {
      setTargetUrl(digitalLink.url);
    }
  }, [digitalLink]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      id: digitalLink.id,
      data: {
        url: targetUrl,
        digitalType: digitalLink.digitalType,
        gtin: digitalLink.gtin,
      },
    };
    try {
      await updateDigitalLink(payload).unwrap();

      onClose();
      toast.success("Digital link updated successfully");
    } catch (error) {
      console.error("Failed to update digital link:", error);
      toast.error("Failed to update digital link");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Edit Digital Link</ModalHeader>
          <ModalBody className="gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">GTIN:</span>
                <span className="text-gray-600">{digitalLink?.gtin}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">
                  Digital Type:
                </span>
                <span className="text-gray-600">
                  {digitalLink?.digitalType}
                </span>
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
              Update Digital Link
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default EditDigitalLink;
