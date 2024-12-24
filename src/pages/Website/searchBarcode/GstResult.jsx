import React from "react";
import {
  Package2,
  Building2,
  Globe,
  Tag,
  Info,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

function GstResult({ data }) {
  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary p-8 text-white">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-white/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{data.title || "N/A"}</h1>
          <p className="text-white/80">GTIN: {data.gtin || "N/A"}</p>
          <div className="mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                data.status === "ACTIVE"
                  ? "bg-green-500/20 text-green-100"
                  : "bg-red-500/20 text-red-100"
              }`}
            >
              {data.status || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Product Images */}
      {data.images && data.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.images.map((image, index) => (
            <div key={image.id} className="relative group">
              <div className="overflow-hidden rounded-lg shadow-lg aspect-square">
                <img
                  src={image.url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Package2 className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary">
              Product Details
            </h2>
          </div>
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Description:</span>{" "}
              {data.description || "N/A"}
            </p>
            <p>
              <span className="font-semibold">SKU:</span> {data.sku || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Brand:</span>{" "}
              {data.brandName || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Packing Unit:</span>{" "}
              {data.packingUnit || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Unit of Measure:</span>{" "}
              {data.unitOfMeasure || "N/A"}
            </p>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary">
              Company Information
            </h2>
          </div>
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Company (EN):</span>{" "}
              {data.user?.companyNameEn || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Company (AR):</span>{" "}
              {data.user?.companyNameAr || "N/A"}
            </p>
          </div>
        </div>

        {/* Classification Information */}
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary">
              Classification
            </h2>
          </div>
          <div className="space-y-3">
            <p>
              <span className="font-semibold">GPC:</span> {data.gpc || "N/A"}
            </p>
            <p>
              <span className="font-semibold">HS Code:</span>{" "}
              {data.hsCode || "N/A"}
            </p>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Location</h2>
          </div>
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Country of Origin:</span>{" "}
              {data.countryOfOrigin || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Country of Sale:</span>{" "}
              {data.countryOfSale || "N/A"}
            </p>
          </div>
        </div>

        {/* Dates Information */}
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow col-span-full">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Dates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>
              <span className="font-semibold">Created:</span>{" "}
              {formatDate(data.createdAt)}
            </p>
            <p>
              <span className="font-semibold">Updated:</span>{" "}
              {formatDate(data.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GstResult;
