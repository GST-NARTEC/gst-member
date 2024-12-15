import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { 
  useUpdateUserDocMutation,
  useGetDocsTypesQuery 
} from "../../store/apis/endpoints/userDocs";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function EditDocument({ isOpen, onClose, document }) {
  const [formData, setFormData] = useState({
    name: "",
    doc: null,
  });
  const [updateUserDoc, { isLoading }] = useUpdateUserDocMutation();
  const [preview, setPreview] = useState(null);
  const { user } = useSelector((state) => state.member);
  const { data: docsTypesResponse, isLoading: docsTypesLoading } = useGetDocsTypesQuery();

  // Transform the docs types data for Autocomplete
  const documentTypes = docsTypesResponse?.data?.map(type => ({
    label: type.name,
    value: type.name,
    id: type.id
  })) || [];

  useEffect(() => {
    if (document) {
      setFormData({
        name: document.name || "",
        doc: null,
      });
      setPreview(document.doc);
    }
  }, [document]);

  useEffect(() => {
    return () => {
      // Cleanup preview URL when component unmounts
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);

      // Only append doc if a new file is selected
      if (formData.doc) {
        formDataToSend.append("doc", formData.doc);
      }

      const payload = {
        id: document.id,
        docData: formDataToSend,
      };

      await updateUserDoc(payload).unwrap();

      toast.success("Document updated successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to update document:", error);
      toast.error("Failed to update document");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload only images or PDF files");
        return;
      }

      // Validate file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setFormData({ ...formData, doc: file });
      // Create preview URL for the new file
      const newPreview = URL.createObjectURL(file);
      setPreview(newPreview);
    }
  };

  const isImage = formData.doc 
    ? formData.doc.type.startsWith('image/')
    : preview?.match(/\.(jpg|jpeg|png|gif)$/i);
  const isPDF = formData.doc 
    ? formData.doc.type === 'application/pdf'
    : preview?.match(/\.pdf$/i);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Edit Document</ModalHeader>
          <ModalBody className="gap-4">
            <Autocomplete
              label="Document Type"
              placeholder="Select document type"
              defaultItems={documentTypes}
              selectedKey={formData.name}
              onSelectionChange={(value) => 
                setFormData({ ...formData, name: value })
              }
              isLoading={docsTypesLoading}
              defaultSelectedKey={formData.name}
            >
              {(item) => (
                <AutocompleteItem key={item.value}>
                  {item.label}
                </AutocompleteItem>
              )}
            </Autocomplete>

            {/* Current Document Preview */}
            {preview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {formData.doc ? 'New Document Preview:' : 'Current Document:'}
                </p>
                <div className="border rounded-lg p-2">
                  {isImage ? (
                    <img
                      src={preview}
                      alt="Document Preview"
                      className="max-h-[200px] object-contain mx-auto"
                    />
                  ) : isPDF ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-8 h-8 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                      </svg>
                      {formData.doc ? (
                        <span className="text-gray-600">
                          Selected PDF: {formData.doc.name}
                        </span>
                      ) : (
                        <a
                          href={preview}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View Current PDF
                        </a>
                      )}
                    </div>
                  ) : (
                    <p>Unsupported file format</p>
                  )}
                </div>
              </div>
            )}

            {/* Upload New Document */}
            <div className="mt-4">
              <Input
                type="file"
                label="Upload New Document (Optional)"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: Images (JPG, PNG, GIF) and PDF. Max size: 5MB
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isLoading}>
              Update Document
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default EditDocument;
