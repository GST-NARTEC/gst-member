import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import {
  useCreateHelpTicketMutation,
  Priority,
  TicketCategory,
} from "../../store/apis/endpoints/helpDisk";

function CreateTicket({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    category: "",
    priority: Priority.MEDIUM,
    doc: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [createTicket, { isLoading, isSuccess, isError, error }] =
    useCreateHelpTicketMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Ticket created successfully");
      handleClose();
    }
    if (isError) {
      toast.error(error?.data?.message || "Failed to create ticket");
    }
  }, [isSuccess, isError, error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        doc: file,
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClose = () => {
    setFormData({
      subject: "",
      message: "",
      category: "",
      priority: Priority.MEDIUM,
      doc: null,
    });
    setPreviewUrl(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData if there's a file
    const ticketData = new FormData();
    ticketData.append("subject", formData.subject);
    ticketData.append("message", formData.message);
    ticketData.append("category", formData.category);
    ticketData.append("priority", formData.priority);

    if (formData.doc) {
      ticketData.append("doc", formData.doc);
    }

    try {
      await createTicket(ticketData).unwrap();
    } catch (err) {
      console.error("Failed to create ticket:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create New Ticket
            </ModalHeader>
            <ModalBody>
              <div>
                <Input
                  label="Subject"
                  isInvalid={formData.subject === ""}
                  errorMessage="Subject is required"
                  isRequired
                  placeholder="Enter the subject of your inquiry"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="mb-4"
                />
                <Textarea
                  label="Message"
                  isInvalid={formData.message === ""}
                  errorMessage="Message is required"
                  isRequired
                  placeholder="Describe your issue or question"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="mb-4"
                />
                <Select
                  label="Category"
                  placeholder="Select a category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mb-4"
                  isInvalid={formData.category === ""}
                  errorMessage="Category is required"
                >
                  {Object.entries(TicketCategory).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Priority"
                  placeholder="Select priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="mb-4"
                  isInvalid={formData.priority === ""}
                  errorMessage="Priority is required"
                >
                  {Object.entries(Priority).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </Select>
                <div className="border-2 border-dashed rounded-lg p-4 mb-4 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <FaCloudUploadAlt className="text-3xl text-gray-400" />
                    <span className="text-gray-600">
                      {formData.doc
                        ? "Change attachment"
                        : "Click to upload an image (optional)"}
                    </span>
                  </label>

                  {previewUrl && (
                    <div className="mt-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-40 mx-auto rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            doc: null,
                          }));
                          setPreviewUrl(null);
                        }}
                        className="mt-2 text-red-500 text-sm"
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleClose}>
                Close
              </Button>
              <Button
                isLoading={isLoading}
                isDisabled={
                  formData.subject === "" ||
                  formData.message === "" ||
                  formData.category === "" ||
                  formData.priority === ""
                }
                color="primary"
                onClick={handleSubmit}
              >
                Create Ticket
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CreateTicket;
