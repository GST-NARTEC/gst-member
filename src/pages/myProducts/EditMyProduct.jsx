import React, { useState, useEffect } from "react";
import {
  Input,
  Textarea,
  Button,
  Card,
  CardBody,
  Image,
  Switch,
  Spinner,
} from "@nextui-org/react";
import {
  FaArrowLeft,
  FaUpload,
  FaTrash,
  FaDownload,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../layout/PortalLayouts/MainLayout";
import UnitOfMeasure from "../../components/myProducts/UnitOfMesure";
import CountryOfSale from "../../components/myProducts/CountryOfSale";
import CountryOfOrigon from "../../components/myProducts/CountryOfOrigon";
import MyBrands from "../../components/myProducts/MyBrands";
import PackagingType from "../../components/myProducts/PackagingType";
import ProductType from "../../components/myProducts/ProductType";
import {
  useGetUserProductByIdQuery,
  useUpdateUserProductMutation,
  useDeleteUserProductImageMutation,
} from "../../store/apis/endpoints/userProducts";
import bwipjs from "bwip-js";

function EditMyProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: productData, isLoading } = useGetUserProductByIdQuery({ id });
  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateUserProductMutation();
  const [deleteImage, { isLoading: isDeletingImage }] =
    useDeleteUserProductImageMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "ACTIVE",
    images: Array(5).fill(null),
    sku: "",
    gtin: "",
    gpc: "",
    hsCode: "",
    unitOfMeasure: "",
    brandName: "",
    countryOfOrigin: "",
    countryOfSale: "",
    packagingType: "",
    productType: "",
  });

  // Pre-fill form data when product data is loaded
  useEffect(() => {
    if (productData?.data?.product) {
      const product = productData.data.product;
      setFormData({
        title: product.title || "",
        description: product.description || "",
        status: product.status || "ACTIVE",
        images: [
          ...(product.images || []).map((img) => ({
            url: img.url,
            id: img.id,
          })),
          ...Array(5 - (product.images?.length || 0)).fill(null),
        ],
        sku: product.sku || "",
        gtin: product.gtin || "",
        gpc: product.gpc || "",
        hsCode: product.hsCode || "",
        unitOfMeasure: product.unitOfMeasure || "",
        brandName: product.brandName || "",
        countryOfOrigin: product.countryOfOrigin || "",
        countryOfSale: product.countryOfSale || "",
        packagingType: product.packagingType || "",
        productType: product.productType || "",
      });
    }
  }, [productData]);

  useEffect(() => {
    if (!formData.gtin) return;

    // Generate EAN-13 barcode
    try {
      bwipjs.toCanvas("ean13-canvas", {
        bcid: "ean13",
        text: formData.gtin,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
      });
    } catch (err) {
      console.error("Error generating EAN-13:", err);
    }

    // Generate DataMatrix with combined product information
    try {
      // Format: GTIN | Title | Brand | SKU
      const dataMatrixText = [
        formData.gtin,
        formData.title,
        formData.brandName,
        formData.sku,
      ]
        .filter(Boolean)
        .join(" | ");

      bwipjs.toCanvas("datamatrix-canvas", {
        bcid: "datamatrix",
        text: dataMatrixText,
        scale: 3,
        includetext: false,
        textxalign: "center",
      });
    } catch (err) {
      console.error("Error generating DataMatrix:", err);
    }

    // Generate QR Code
    try {
      const qrText = [
        formData.gtin,
        formData.title,
        formData.brandName,
        formData.sku,
      ]
        .filter(Boolean)
        .join(" | ");

      bwipjs.toCanvas("qrcode-canvas", {
        bcid: "qrcode",
        text: qrText,
        scale: 3,
        includetext: false,
      });
    } catch (err) {
      console.error("Error generating QR Code:", err);
    }
  }, [formData.gtin, formData.sku, formData.title, formData.brandName]);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const [deletingImageIds, setDeletingImageIds] = useState([]);

  const removeImage = async (index) => {
    const image = formData.images[index];

    // If it's a local image (newly selected), just remove it from state
    if (image && !image.url) {
      const newImages = [...formData.images];
      newImages[index] = null;
      setFormData((prev) => ({ ...prev, images: newImages }));
      return;
    }

    // If it's an existing image from API, delete it
    if (image?.id) {
      try {
        setDeletingImageIds((prev) => [...prev, image.id]);
        await deleteImage({
          productId: productData.data.product.id,
          imageId: image.id,
        }).unwrap();
        const newImages = [...formData.images];
        newImages[index] = null;
        setFormData((prev) => ({ ...prev, images: newImages }));
      } catch (error) {
        console.error("Failed to delete image:", error);
      } finally {
        setDeletingImageIds((prev) => prev.filter((id) => id !== image.id));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const productData = new FormData();

      // Append basic fields
      productData.append("title", formData.title);
      productData.append("description", formData.description);
      productData.append("status", formData.status);
      productData.append("sku", formData.sku);
      productData.append("gtin", formData.gtin);
      productData.append("gpc", formData.gpc);
      productData.append("hsCode", formData.hsCode);
      productData.append("unitOfMeasure", formData.unitOfMeasure);
      productData.append("brandName", formData.brandName);
      productData.append("countryOfOrigin", formData.countryOfOrigin);
      productData.append("countryOfSale", formData.countryOfSale);
      productData.append("packagingType", formData.packagingType);
      productData.append("productType", formData.productType);

      // Append only new images
      formData.images.forEach((image) => {
        if (image && !image.url) {
          // Only append if it's a new File object
          productData.append("images", image);
        }
      });

      await updateProduct({ id, data: productData }).unwrap();
      navigate(-1);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const downloadCanvas = (canvasId, fileName) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Create a larger canvas for better quality
    const scaleFactor = 3;
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = canvas.width * scaleFactor;
    tempCanvas.height = canvas.height * scaleFactor;

    // Fill white background
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw scaled image
    tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

    // Convert to blob and download
    tempCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}-${formData.gtin || "barcode"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <Button
            color="default"
            startContent={<FaArrowLeft />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>

        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Product Info */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Product Identifiers
                  </h2>
                  <div className="grid gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">
                        GTIN:{" "}
                      </span>
                      <span className="font-mono">{formData.gtin || "-"}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">SKU: </span>
                      <span className="font-mono">{formData.sku || "-"}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-700">
                        Product:{" "}
                      </span>
                      <span className="font-mono">{formData.title || "-"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaInfoCircle className="text-blue-600" />
                    <h3 className="text-sm font-medium text-blue-900">
                      About Barcodes
                    </h3>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your product includes both 1D (EAN-13) and 2D (DataMatrix)
                    barcodes for maximum compatibility. Download either format
                    for your packaging and labeling needs.
                  </p>
                </div>
              </div>

              {/* Right side - Barcodes */}
              <div className="space-y-4">
                {/* EAN-13 Section */}
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-base font-medium">EAN-13</h3>
                      <p className="text-xs text-gray-600">1D Linear Barcode</p>
                    </div>
                    <Button
                      size="sm"
                      variant="flat"
                      onClick={() => downloadCanvas("ean13-canvas", "ean13")}
                      startContent={<FaDownload />}
                    >
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-center bg-white p-2 rounded">
                    <canvas
                      id="ean13-canvas"
                      className="max-w-[200px]"
                    ></canvas>
                  </div>
                </div>

                {/* 2D Barcodes Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* DataMatrix Section */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="mb-2">
                      <h3 className="text-base font-medium">Data Matrix</h3>
                      <p className="text-xs text-gray-600">2D Matrix Barcode</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex justify-center bg-white p-2 rounded">
                        <canvas
                          id="datamatrix-canvas"
                          className="w-[120px] h-[120px]"
                        ></canvas>
                      </div>
                      <Button
                        size="sm"
                        variant="flat"
                        onClick={() =>
                          downloadCanvas("datamatrix-canvas", "datamatrix")
                        }
                        startContent={<FaDownload />}
                        className="w-full"
                      >
                        Download
                      </Button>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="mb-2">
                      <h3 className="text-base font-medium">QR Code</h3>
                      <p className="text-xs text-gray-600">2D QR Code</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex justify-center bg-white p-2 rounded">
                        <canvas
                          id="qrcode-canvas"
                          className="w-[120px] h-[120px]"
                        ></canvas>
                      </div>
                      <Button
                        size="sm"
                        variant="flat"
                        onClick={() =>
                          downloadCanvas("qrcode-canvas", "qrcode")
                        }
                        startContent={<FaDownload />}
                        className="w-full"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          {/* Basic Information Card */}
          <Card>
            <CardBody className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Title"
                  placeholder="Enter product title"
                  value={formData.title}
                  isRequired
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
                <div className="flex items-center space-x-4">
                  <span className="text-sm">Status:</span>
                  <Switch
                    isSelected={formData.status === "ACTIVE"}
                    onValueChange={(isSelected) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: isSelected ? "ACTIVE" : "INACTIVE",
                      }))
                    }
                  />
                  <span className="text-sm">{formData.status}</span>
                </div>
                <Textarea
                  label="Description"
                  placeholder="Enter product description"
                  value={formData.description}
                  className="md:col-span-2"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </CardBody>
          </Card>

          {/* Product Details Card */}
          <Card>
            <CardBody className="p-6">
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="SKU"
                  placeholder="Enter SKU"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, sku: e.target.value }))
                  }
                  isRequired
                />
                <Input
                  label="GTIN"
                  placeholder="Enter GTIN"
                  value={formData.gtin}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, gtin: e.target.value }))
                  }
                  isRequired
                />
                <Input
                  label="GPC"
                  placeholder="Enter GPC"
                  value={formData.gpc}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, gpc: e.target.value }))
                  }
                />
                <Input
                  label="HS Code"
                  placeholder="Enter HS Code"
                  value={formData.hsCode}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, hsCode: e.target.value }))
                  }
                />
                <PackagingType
                  value={formData.packagingType}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      packagingType: value,
                    }))
                  }
                />
                <UnitOfMeasure
                  value={formData.unitOfMeasure}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      unitOfMeasure: value,
                    }))
                  }
                />
                <MyBrands
                  value={formData.brandName}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      brandName: value,
                    }))
                  }
                />
                <CountryOfOrigon
                  value={formData.countryOfOrigin}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      countryOfOrigin: value,
                    }))
                  }
                />
                <CountryOfSale
                  value={formData.countryOfSale}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      countryOfSale: value,
                    }))
                  }
                />
                <ProductType
                  value={formData.productType}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      productType: value,
                    }))
                  }
                />
              </div>
            </CardBody>
          </Card>

          {/* Product Images Card */}
          <Card>
            <CardBody className="p-6">
              <h2 className="text-xl font-semibold mb-4">Product Images</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {formData.images.map((image, index) => (
                  <Card key={index} className="w-full aspect-square">
                    <CardBody className="p-2">
                      {image ? (
                        <div className="relative h-full">
                          <Image
                            src={image.url || URL.createObjectURL(image)}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            size="sm"
                            color="danger"
                            isIconOnly
                            className="absolute top-2 right-2 z-10"
                            onClick={() => removeImage(index)}
                            isLoading={
                              image.id && deletingImageIds.includes(image.id)
                            }
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="h-full flex flex-col items-center justify-center cursor-pointer"
                          onClick={() =>
                            document
                              .getElementById(`image-upload-${index}`)
                              .click()
                          }
                        >
                          <FaUpload className="text-2xl text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Upload Image</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, index)}
                            className="hidden"
                            id={`image-upload-${index}`}
                          />
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button color="danger" variant="light" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit} isLoading={isUpdating}>
            Update Product
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

export default EditMyProduct;
