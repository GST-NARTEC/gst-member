import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Card,
  CardBody,
  Image,
  Tooltip,
} from "@heroui/react";
import { FaMagic } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { useGenerateImageMutation } from "../../store/apis/endpoints/imageGenerateAi";

function ImageGenerationAi({
  isOpen,
  onClose,
  productDescription,
  onSelectImage,
}) {
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState([]);
  const [generateImage, { isLoading }] = useGenerateImageMutation();

  const handleGenerate = async (customPrompt = null) => {
    const finalPrompt = customPrompt || prompt.trim();
    if (!finalPrompt) return;

    try {
      const response = await generateImage({ prompt: finalPrompt }).unwrap();
      if (response.success && response.images) {
        setGeneratedImages(response.images);
      }
    } catch (error) {
      console.error("Failed to generate images:", error);
    }
  };

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${Date.now()}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  const handleImageSelect = (imageUrl) => {
    if (onSelectImage) {
      onSelectImage(imageUrl);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      classNames={{
        base: "max-h-[90vh]",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          AI Image Generation
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {productDescription && (
              <div className="flex gap-4 items-center">
                <Tooltip content={productDescription}>
                  <Button
                    color="secondary"
                    variant="flat"
                    className="flex-1"
                    onClick={() => handleGenerate(productDescription)}
                    startContent={<FaMagic />}
                  >
                    Generate from Product Description
                  </Button>
                </Tooltip>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <Input
                placeholder="Or enter a custom description..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-grow"
                size="lg"
              />
              <Button
                color="primary"
                onClick={() => handleGenerate()}
                className="min-w-[120px]"
                startContent={<FaMagic />}
                isDisabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            {isLoading
              ? Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={`skeleton-${index}`} className="w-full">
                      <CardBody className="p-0">
                        <div className="w-full h-[200px] bg-gray-200 animate-pulse rounded-lg" />
                      </CardBody>
                    </Card>
                  ))
              : generatedImages.map((image, index) => (
                  <Card key={index} className="w-full group relative">
                    <CardBody className="p-0 relative">
                      <Image
                        src={image}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-[200px] object-cover cursor-pointer"
                        onClick={() => handleImageSelect(image)}
                      />
                      <div
                        className="absolute bottom-2 right-2 p-2 rounded-full bg-black/60 cursor-pointer hover:bg-black/80 transition-all transform hover:scale-110 group-hover:opacity-100 opacity-0 z-50"
                        onClick={() => handleDownload(image)}
                      >
                        <FiDownload className="text-white text-xl" />
                      </div>
                    </CardBody>
                  </Card>
                ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ImageGenerationAi;
