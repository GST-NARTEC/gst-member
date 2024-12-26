import React, { useState } from "react";
import {
  Input,
  Textarea,
  Button,
  Card,
  CardBody,
  Image,
  Switch,
  Autocomplete,
  AutocompleteItem,
  Chip,
} from "@nextui-org/react";
import { FaArrowLeft, FaUpload, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/PortalLayouts/MainLayout";
import UnitOfMeasure from "../../components/myProducts/UnitOfMesure";
import CountryOfSale from "../../components/myProducts/CountryOfSale";
import CountryOfOrigon from "../../components/myProducts/CountryOfOrigon";
import MyBrands from "../../components/myProducts/MyBrands";
import {
  useCreateUserProductMutation,
  useGetGtinsCountQuery,
} from "../../store/apis/endpoints/userProducts";
import PackagingType from "../../components/myProducts/PackagingType";
import ProductType from "../../components/myProducts/ProductType";

function AddMyProduct() {
  const navigate = useNavigate();
  const { data: gtinsCount, isLoading: isLoadingGtinsCount } =
    useGetGtinsCountQuery();
  console.log(gtinsCount);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "ACTIVE",
    images: Array(5).fill(null), // Initialize with 5 null slots
    sku: "",
    gpc: "",
    hsCode: "",
    unitOfMeasure: "",
    brandName: "",
    countryOfOrigin: "",
    countryOfSale: "",
    barcodeType: "",
    packagingType: "",
    productType: "",
  });

  const [createUserProduct, { isLoading: isCreating }] =
    useCreateUserProductMutation();

  const barcodeTypes = gtinsCount?.data?.barcodeTypes
    ? Object.entries(gtinsCount.data.barcodeTypes).map(([key, value]) => ({
        label: key,
        value: key,
        count: value,
        disabled: value === 0,
      }))
    : [];

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages[index] = null;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async () => {
    try {
      // Create FormData object to handle file uploads
      const productData = new FormData();

      // Append basic fields
      productData.append("title", formData.title);
      productData.append("description", formData.description);
      productData.append("status", formData.status);
      productData.append("sku", formData.sku);
      productData.append("gpc", formData.gpc);
      productData.append("hsCode", formData.hsCode);
      productData.append("unitOfMeasure", formData.unitOfMeasure);
      productData.append("brandName", formData.brandName);
      productData.append("countryOfOrigin", formData.countryOfOrigin);
      productData.append("countryOfSale", formData.countryOfSale);
      productData.append("barcodeType", formData.barcodeType);
      productData.append("packagingType", formData.packagingType);
      productData.append("productType", formData.productType);

      // Append images, filtering out null values
      formData.images.forEach((image, index) => {
        if (image) {
          productData.append(`images`, image);
        }
      });

      // Send the data to the API
      const response = await createUserProduct(productData).unwrap();
      // Navigate back on success
      navigate(-1);
    } catch (error) {
      console.error("Failed to create product:", error);
      // You might want to add error handling/notification here
    }
  };

  return (
    <MainLayout>
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <Button
            color="default"
            startContent={<FaArrowLeft />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Basic Information Card */}
          <Card>
            <CardBody className="p-6">
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <Input
                    label="Title"
                    placeholder="Enter product title"
                    value={formData.title}
                    isRequired
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                  <Textarea
                    label="Description"
                    placeholder="Enter product description"
                    value={formData.description}
                    // variant="bordered"
                    // labelPlacement="outside"
                    minRows={4}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <Autocomplete
                      label="Barcode Type"
                      placeholder="Select barcode type"
                      defaultItems={barcodeTypes}
                      selectedKey={formData.barcodeType}
                      onSelectionChange={(value) =>
                        setFormData((prev) => ({ ...prev, barcodeType: value }))
                      }
                      isLoading={isLoadingGtinsCount}
                      isRequired
                    >
                      {(item) => (
                        <AutocompleteItem
                          key={item.value}
                          textValue={item.label}
                          isDisabled={item.disabled}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm">{item.label}</div>
                              <div className="text-xs text-gray-400">
                                {item.disabled
                                  ? "Not available"
                                  : "Available for use"}
                              </div>
                            </div>
                            <Chip
                              size="sm"
                              color={item.count > 0 ? "success" : "danger"}
                              variant="flat"
                            >
                              {item.count} available
                            </Chip>
                          </div>
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">
                        Product Status
                      </span>
                      <Switch
                        checked={formData.status === "ACTIVE"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: e.target.checked ? "ACTIVE" : "INACTIVE",
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {formData.status === "ACTIVE"
                        ? "Your product is visible to customers"
                        : "Your product is hidden from customers"}
                    </p>
                  </div>
                </div>
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
                            src={URL.createObjectURL(image)}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            size="sm"
                            color="danger"
                            isIconOnly
                            className="absolute top-2 right-2 z-10"
                            onClick={() => removeImage(index)}
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
          <Button
            isDisabled={
              !formData.title || !formData.barcodeType || !formData.sku
            }
            color="primary"
            onClick={handleSubmit}
            isLoading={isCreating}
          >
            Save Product
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

export default AddMyProduct;
