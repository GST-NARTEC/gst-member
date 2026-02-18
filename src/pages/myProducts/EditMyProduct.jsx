import { useState, useEffect } from "react";
import {
  Input,
  Textarea,
  Button,
  Card,
  CardBody,
  Image,
  Switch,
  Spinner,
} from "@heroui/react";
import {
  FaTrash,
  FaSearch,
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
import {
  useLazyGetGpcSearchQuery,
  useLazyGetHsSearchQuery,
} from "../../store/apis/externalApis/embeddingsApi";
import ProductBarcodes from "../../components/myProducts/ProductBarcodes";

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

  const [triggerGpcSearch, { data: gpcSearchResults, isFetching: isGpcSearching }] = useLazyGetGpcSearchQuery();
  const [triggerHsSearch, { data: hsSearchResults, isFetching: isHsSearching }] = useLazyGetHsSearchQuery();

  const [gpcInput, setGpcInput] = useState("");
  const [hsInput, setHsInput] = useState("");

  const handleGpcSearch = async () => {
    if (!gpcInput || gpcInput.length < 2) return;
    try {
      await triggerGpcSearch(gpcInput).unwrap();
    } catch (err) {
      // console.error("GPC Search Error:", err);
    }
  };

  const handleGpcSelect = async (key) => {
    if (!key) return;
    const selectedGpc = gpcSearchResults?.results?.find(item => (item.metadata?.code || item.metadata?.brick) === key);
    if (!selectedGpc) return;

    setFormData(prev => ({ ...prev, gpc: key }));
    
    // Trigger HS search based on GPC title
    const gpcTitle = selectedGpc.metadata?.bricks_title || selectedGpc.content;
    if (gpcTitle) {
      try {
        await triggerHsSearch(gpcTitle).unwrap();
      } catch (err) {
        // console.error("HS Search Error:", err);
      }
    }
  };

  const gpcItems = gpcSearchResults?.results?.map(item => ({
    label: `${item.content} (${item.metadata?.code || item.metadata?.brick || ""})`,
    value: item.metadata?.code || item.metadata?.brick,
  })) || [];

  const hsItems = hsSearchResults?.results?.map(item => {
    const code = item.metadata?.['رمز النظام المنسق \r\n Harmonized Code'] || item.metadata?.['HS Code'] || item.metadata?.['code'] || "";
    const name = item.content || item.metadata?.['الصنف باللغة الانجليزية \r\n Item English Name'] || item.metadata?.['Item English Name'] || "";
    return {
      label: `${name} (${code})`,
      value: code,
    };
  }) || [];

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

        {/* Barcode Component */}
        <ProductBarcodes formData={formData} />

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
                  readOnly
                  value={formData.gtin}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, gtin: e.target.value }))
                  }
                  isRequired
                />
                <Autocomplete
                  label="GPC"
                  placeholder="Enter GPC"
                  items={gpcItems}
                  isLoading={isGpcSearching}
                  onInputChange={(value) => setGpcInput(value)}
                  onSelectionChange={handleGpcSelect}
                  selectedKey={formData.gpc}
                  allowsCustomValue={true}
                  scrollShadowProps={{
                    isEnabled: false,
                  }}
                  endContent={
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGpcSearch();
                      }}
                    >
                      <FaSearch className="text-gray-400 hover:text-primary transition-colors" />
                    </Button>
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleGpcSearch();
                    }
                  }}
                >
                  {(item) => (
                    <AutocompleteItem key={item.value} textValue={item.label}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>

                <Autocomplete
                  label="HS Code"
                  placeholder="Enter HS Code"
                  items={hsItems}
                  isLoading={isHsSearching}
                  allowsCustomValue={true}
                  onInputChange={(value) => setHsInput(value)}
                  onSelectionChange={(key) => setFormData(prev => ({ ...prev, hsCode: key }))}
                  selectedKey={formData.hsCode}
                >
                  {(item) => (
                    <AutocompleteItem key={item.value} textValue={item.label}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
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