import React, { useState } from "react";
import MainLayout from "../../layout/PortalLayouts/MainLayout";
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Input,
  Button,
  Image,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  MarkerF,
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";
import PhysicalLocationModal from "./PhysicalLocationModal";
import { useCreateGLNLocationMutation } from "../../store/apis/endpoints/gln";

const RiyadhLocation = { lat: 24.7136, lng: 46.6753 };
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function AddGLNLocation() {
  const navigate = useNavigate();
  const [createGLNLocation, { isLoading }] = useCreateGLNLocationMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    identifier: "",
    physicalLocation: null,
    locationNameEn: "",
    locationNameAr: "",
    addressEn: "",
    poBox: "",
    postalCode: "",
    longitude: RiyadhLocation.lng,
    latitude: RiyadhLocation.lat,
    isActive: true,
    image: null,
    barcodeType: "GLN",
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries: ["places"],
  });

  const [searchBox, setSearchBox] = useState(null);

  const glnIdentifyOptions = [
    { label: "Legal entity", value: "legal_entity" },
    { label: "Function", value: "function" },
    { label: "Physical location", value: "physical_location" },
    { label: "Digital location", value: "digital_location" },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Show location modal when GLN type is selected
    if (field === "identifier") {
      setIsLocationModalOpen(true);
    }
  };

  const handleLocationTypeSelect = (locationType) => {
    setFormData((prev) => ({
      ...prev,
      physicalLocation: locationType.name,
    }));
  };

  const handlePlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places?.[0]) {
        const place = places[0];
        setFormData((prev) => ({
          ...prev,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          addressEn: place.formatted_address,
        }));
      }
    }
  };

  const handleMarkerDragEnd = (event) => {
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === "OK" && results?.[0]) {
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            addressEn: results[0].formatted_address,
          }));
        }
      }
    );
  };

  const handleMapClick = (event) => {
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === "OK" && results?.[0]) {
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            addressEn: results[0].formatted_address,
          }));
        }
      }
    );
  };

  const isFormValid = () => {
    const requiredFields = [
      "identifier",
      "physicalLocation",
      "locationNameEn",
      "locationNameAr",
      "addressEn",
      "poBox",
      "postalCode",
      "latitude",
      "longitude",
    ];

    return requiredFields.every((field) => formData[field]);
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "image" && formData[key]) {
          formDataToSend.append("image", formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await createGLNLocation(formDataToSend).unwrap();
      navigate(-1);
    } catch (error) {
      console.error("Failed to create GLN location:", error);
    }
  };

  return (
    <MainLayout>
      <div className="p-5">
        <Button
          color="primary"
          variant="light"
          className="mb-4"
          onClick={() => navigate(-1)}
          startContent={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        >
          Back
        </Button>

        <Card className="max-w-5xl mx-auto p-5">
          <CardBody className="gap-6">
            <h1 className="text-2xl font-bold mb-6">Add GLN Location</h1>

            <div className="grid gap-6">
              {/* GLN Identify Type */}
              <div>
                <Select
                  label="What does a GLN identify?"
                  placeholder="Select GLN type"
                  className="max-w-full"
                  value={formData.identifier}
                  onChange={(e) =>
                    handleInputChange("identifier", e.target.value)
                  }
                  isRequired
                >
                  {glnIdentifyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                {/* Show selected location type if any */}
                {formData.physicalLocation && (
                  <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">
                      {formData.physicalLocation}
                    </span>
                    <Button
                      size="sm"
                      variant="light"
                      color="primary"
                      className="ml-auto"
                      onClick={() => setIsLocationModalOpen(true)}
                    >
                      Change
                    </Button>
                  </div>
                )}
              </div>

              {/* Location Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Location Name [English]"
                  placeholder="Enter location name in English"
                  value={formData.locationNameEn}
                  onChange={(e) =>
                    handleInputChange("locationNameEn", e.target.value)
                  }
                  isRequired
                />
                <Input
                  label="Location Name [Arabic]"
                  placeholder="Enter location name in Arabic"
                  value={formData.locationNameAr}
                  onChange={(e) =>
                    handleInputChange("locationNameAr", e.target.value)
                  }
                  isRequired
                />
              </div>

              {/* Address */}
              <div className="w-full">
                <Input
                  label="Address"
                  placeholder="Enter address in English"
                  value={formData.addressEn}
                  onChange={(e) =>
                    handleInputChange("addressEn", e.target.value)
                  }
                  isRequired
                />
              </div>

              {/* P.O. Box and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="P.O. BOX"
                  placeholder="Enter P.O. Box number"
                  value={formData.poBox}
                  onChange={(e) => handleInputChange("poBox", e.target.value)}
                  isRequired
                />
                <Input
                  label="Postal Code"
                  placeholder="Enter postal code"
                  value={formData.postalCode}
                  onChange={(e) =>
                    handleInputChange("postalCode", e.target.value)
                  }
                  isRequired
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Longitude"
                  placeholder="Enter longitude"
                  value={formData.longitude}
                  onChange={(e) =>
                    handleInputChange("longitude", e.target.value)
                  }
                  isRequired
                />
                <Input
                  label="Latitude"
                  placeholder="Enter latitude"
                  value={formData.latitude}
                  onChange={(e) =>
                    handleInputChange("latitude", e.target.value)
                  }
                  isRequired
                />
              </div>

              {/* Google Maps Section */}
              <div className="grid grid-cols-1 gap-4">
                {isLoaded ? (
                  <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
                    <GoogleMap
                      mapContainerStyle={{ height: "100%", width: "100%" }}
                      center={{
                        lat: formData.latitude,
                        lng: formData.longitude,
                      }}
                      zoom={13}
                      onClick={handleMapClick}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                      }}
                    >
                      <StandaloneSearchBox
                        onLoad={setSearchBox}
                        onPlacesChanged={handlePlacesChanged}
                      >
                        <input
                          type="text"
                          placeholder="Search for a location"
                          className="absolute left-1/2 -translate-x-1/2 top-4 w-[80%] max-w-md px-4 py-2 rounded-lg shadow-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent bg-white/95"
                        />
                      </StandaloneSearchBox>

                      <MarkerF
                        position={{
                          lat: formData.latitude,
                          lng: formData.longitude,
                        }}
                        draggable={true}
                        onDragEnd={handleMarkerDragEnd}
                      />
                    </GoogleMap>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy-600"></div>
                  </div>
                )}
              </div>

              {/* Image Upload Card */}
              <div className="flex justify- w-full">
                <Card className="p-2 w-48">
                  <CardBody className="flex flex-col items-center gap-2">
                    <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <div className="relative w-full h-full group">
                          <img
                            src={imagePreview}
                            alt="Location preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label
                              htmlFor="location-image"
                              className="cursor-pointer text-white text-sm"
                            >
                              Change
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="location-image"
                          className="cursor-pointer text-center p-2"
                        >
                          <div className="text-gray-500">
                            <svg
                              className="mx-auto h-6 w-6"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <p className="mt-1 text-xs">
                              Upload Your National Address
                            </p>
                            
                          </div>
                        </label>
                      )}
                      <input
                        id="location-image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  color="danger"
                  variant="light"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  onClick={handleSubmit}
                  isDisabled={!isFormValid()}
                >
                  Submit
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Location Type Modal */}
      <PhysicalLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelect={handleLocationTypeSelect}
      />
    </MainLayout>
  );
}

export default AddGLNLocation;
