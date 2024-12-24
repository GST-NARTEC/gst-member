import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Package2,
  Building2,
  Globe,
  Tag,
  Info,
  Box,
  MapPin,
} from "lucide-react";
import WebsiteLayout from "../../../layout/WebsiteLayouts/Layout";
import SearchGtin from "../../../components/Website/HomePage/SearchGtin";
import {
  fetchBarcodeData,
  resetExternalData,
} from "../../../store/apis/externalApis/externalDataSlice";
import { formatImageUrl } from "../../../utils/formatImageUrl";
import BarcodeLookup from "./BarcodeLookup";
import GstResult from "./GstResult";

function BarcodeResult() {
  const { barcode } = useParams();
  const dispatch = useDispatch();
  const { data, source, loading, error } = useSelector(
    (state) => state.externalData
  );

  useEffect(() => {
    if (barcode) {
      dispatch(resetExternalData());
      dispatch(fetchBarcodeData(barcode));
    }
  }, [barcode, dispatch]);

  const renderGS1Data = (data) => (
    <div className="space-y-8">
      {/* Hero Section - Updated with primary colors */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary p-8 text-white">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-white/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{data.productName}</h1>
          <p className="text-white/80">GTIN: {data.gtin}</p>
        </div>
      </div>

      {/* Product Image and Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative group">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={formatImageUrl(data.productImageUrl?.value)}
              alt={data.productName}
              className="w-full h-[400px] object-contain transform transition-transform group-hover:scale-105"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Brand and Company Info - Updated icons color */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-primary">
                Company Details
              </h2>
            </div>
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <span className="font-semibold">Brand:</span>
                <span className="bg-navy-400/10 text-primary px-2 py-1 rounded">
                  {data.brandName?.value}
                </span>
              </p>
              <p>
                <span className="font-semibold">Company:</span>{" "}
                {data.companyName}
              </p>
              <p>
                <span className="font-semibold">License:</span>{" "}
                {data.licenceType}
              </p>
            </div>
          </div>

          {/* Product Details - Updated icons color */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Package2 className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-primary">
                Product Details
              </h2>
            </div>
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {data.gpcCategoryName}
              </p>
              <p>
                <span className="font-semibold">Net Content:</span>{" "}
                {data.unitValue} {data.unitCode}
              </p>
              <p className="text-gray-700">{data.productDescription?.value}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information - Updated icons color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Distribution</h2>
          </div>
          <p>
            <span className="font-semibold">Market:</span>{" "}
            {data.countryOfSaleName}
          </p>
          <p className="mt-2">
            <span className="font-semibold">Address:</span>{" "}
            {data.formattedAddress}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary">
              Additional Info
            </h2>
          </div>
          <p>
            <span className="font-semibold">Registration Date:</span>{" "}
            {new Date(data.companyRegistrationDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Type:</span> {data.type}
          </p>
        </div>
      </div>
    </div>
  );

  const renderBarcodeReportData = (data) => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">Barcode:</span> {data.barcode}
        </p>
        <p>
          <span className="font-semibold">Created:</span>{" "}
          {new Date(data.created_at).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Updated:</span>{" "}
          {new Date(data.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

  const renderGS1CompanyData = (data) => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary p-8 text-white">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-white/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{data.companyName}</h1>
          <p className="text-white/80">GTIN: {data.gtin}</p>
        </div>
      </div>

      {/* Company Information Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary">
              Company Details
            </h2>
          </div>
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Company:</span> {data.companyName}
            </p>
            <p>
              <span className="font-semibold">License Key:</span>{" "}
              {data.licenceKey}
            </p>
            <p>
              <span className="font-semibold">License Type:</span>{" "}
              {data.licenceType}
            </p>
            <p>
              <span className="font-semibold">License Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded ${
                  data.licenceStatus === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {data.licenceStatus}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary">
              GS1 Information
            </h2>
          </div>
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Licensing MO:</span>{" "}
              {data.licensingMOName}
            </p>
            <p>
              <span className="font-semibold">Primary MO:</span>{" "}
              {data.primaryMOName}
            </p>
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {data.formattedAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Dates Information */}
      <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-primary">
            Additional Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <span className="font-semibold">Created:</span>{" "}
            {new Date(data.dateCreated).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Updated:</span>{" "}
            {new Date(data.dateUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <WebsiteLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <SearchGtin />

          <div className="mt-8">
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-lg text-gray-600">
                  Searching for product information...
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-red-800">
                      Search Result
                    </h3>
                    <p className="mt-1 text-red-600">
                      {error === "Barcode not found in any of our databases"
                        ? `We couldn't find the barcode ${barcode} in our databases. Please verify the number and try again.`
                        : error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {data && (
              <div className="mt-8">
                {source === "gst" && <GstResult data={data} />}
                {source === "gs1" && renderGS1Data(data)}
                {source === "gs1Company" && renderGS1CompanyData(data)}
                {source === "barcodeLookup" && <BarcodeLookup data={data} />}
                {source === "barcodeReport" && renderBarcodeReportData(data)}
              </div>
            )}
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
}

export default BarcodeResult;
