import React, { useState } from "react";
import {
  Package2,
  Building2,
  Globe,
  Tag,
  Info,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

function GstResult({ data, type, gtin }) {
  if (!data) return null;
  console.log(data, type);

  const [activeTab, setActiveTab] = useState("product");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* GST Verification Header */}
      <div className="bg-gray-100 p-4 rounded-lg flex items-center">
        <div className="bg-green-100 p-2 rounded-full mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex items-center">
          <div className="bg-primary text-white px-2 py-1 rounded text-sm mr-2">
            GST
          </div>
          <div className="text-gray-700">
            This number is registered to{" "}
            <span className="font-bold">
              {type === "product"
                ? data.user?.companyNameEn || "N/A"
                : data.assignedTo?.companyNameEn || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`py-2 px-4 ${
              activeTab === "product"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            } font-medium`}
            onClick={() => setActiveTab("product")}
          >
            Product information
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "company"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            } font-medium`}
            onClick={() => setActiveTab("company")}
          >
            Company information
          </button>
        </div>
      </div>

      {/* Product Information Tab */}
      {activeTab === "product" && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-xl font-bold text-primary mb-4">
            {type === "product"
              ? data.title || data.description || "Product Information"
              : "Product Information"}
          </h1>
          <div className="flex flex-col md:flex-row">
            {/* Product Image */}
            <div className="mb-4 md:mb-0 md:mr-8 flex-shrink-0">
              <div className="w-full md:w-48 h-48 flex items-center justify-center overflow-hidden rounded-lg">
                {type === "product" && data.images && data.images.length > 0 ? (
                  <img
                    src={data.images[0].url}
                    alt={data.title || "Product"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-grow">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600 w-1/3">GTIN</td>
                    <td className="py-3 text-primary text-lg">
                      {data.gtin || gtin || "N/A"}
                    </td>
                  </tr>
                  {type === "product" ? (
                    <>
                      <tr className="border-b">
                        <td className="py-3 text-gray-600">Brand Name</td>
                        <td className="py-3 text-primary text-lg">
                          {data.brandName || "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-600">
                          Product Description
                        </td>
                        <td className="py-3 text-primary text-lg">
                          {data.description || "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-600">
                          Product Image Url
                        </td>
                        <td className="py-3 text-primary text-lg">
                          {data.images && data.images.length > 0
                            ? data.images[0].url
                            : "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-600">
                          Global product category
                        </td>
                        <td className="py-3 text-primary text-lg">
                          {data.gpc || data.category || "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-600">Net Content</td>
                        <td className="py-3 text-primary text-lg">
                          {data.unitOfMeasure
                            ? `${data.unitOfMeasure} ${
                                data.packagingType || ""
                              }`
                            : "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-600">Country</td>
                        <td className="py-3 text-primary text-lg">
                          {data.countryOfOrigin || "N/A"}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="border-b">
                        <td className="py-3 text-gray-600">Status</td>
                        <td className="py-3 text-primary text-lg">
                          {data.status || "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-600">Purchase Date</td>
                        <td className="py-3 text-primary text-lg">
                          {data.assignedTo?.purchaseDate
                            ? formatDate(data.assignedTo.purchaseDate)
                            : "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-600">Order Number</td>
                        <td className="py-3 text-primary text-lg">
                          {data.assignedTo?.orderNumber || "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-600">Barcode Type</td>
                        <td className="py-3 text-primary text-lg">
                          {data.assignedTo?.barcodeType || "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-600" colSpan={2}>
                          <p className="text-blue-500 italic">
                            Product information will be available once added by
                            the owner.
                          </p>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Company Information Tab */}
      {activeTab === "company" && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-primary mb-4">
            Company Information
          </h2>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-3 text-gray-600 w-1/3">Company Name</td>
                <td className="py-3 text-primary text-lg">
                  {type === "product"
                    ? data.user?.companyNameEn || "N/A"
                    : data.assignedTo?.companyNameEn || "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 text-gray-600">Company Name (Arabic)</td>
                <td className="py-3 text-primary text-lg">
                  {type === "product"
                    ? data.user?.companyNameAr || "N/A"
                    : data.assignedTo?.companyNameAr || "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 text-gray-600">Website</td>
                <td className="py-3 text-primary text-lg">N/A</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 text-gray-600">Licence Key</td>
                <td className="py-3 text-primary text-lg">
                  {data.gtin?.substring(0, 8) || gtin?.substring(0, 8) || "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 text-gray-600">Licence Type</td>
                <td className="py-3 text-primary text-lg">GCP</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 text-gray-600">
                  Global Location Number (GLN)
                </td>
                <td className="py-3 text-primary text-lg">
                  {data.gtin?.substring(0, 8) || gtin?.substring(0, 8) || "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 text-gray-600">
                  Licensing GST Member Organisation
                </td>
                <td className="py-3 text-primary text-lg">GST SAUDI ARABIA</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 text-gray-600">Date of Registration</td>
                <td className="py-3 text-primary text-lg">
                  {type === "product"
                    ? formatDate(data.createdAt)
                    : data.assignedTo?.purchaseDate
                    ? formatDate(data.assignedTo.purchaseDate)
                    : "N/A"}
                </td>
              </tr>
              {type === "product" && (
                <>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">Country of Origin</td>
                    <td className="py-3 text-primary text-lg">
                      {data.countryOfOrigin || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">Country of Sale</td>
                    <td className="py-3 text-primary text-lg">
                      {data.countryOfSale || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">Product Type</td>
                    <td className="py-3 text-primary text-lg">
                      {data.productType || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">Last Updated</td>
                    <td className="py-3 text-primary text-lg">
                      {formatDate(data.updatedAt)}
                    </td>
                  </tr>
                </>
              )}
              {type === "gtinInfo" && (
                <tr className="border-b">
                  <td className="py-3 text-gray-600">Barcode Type</td>
                  <td className="py-3 text-primary text-lg">
                    {data.assignedTo?.barcodeType || "N/A"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Enterprise capabilities banner */}
      <div className="bg-navy-700 text-white p-6 rounded-lg mt-8">
        <div className="flex items-start">
          <div className="mr-4 bg-yellow-400 p-3 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">
              Need to look up more barcodes? Expand your search.
            </h3>
            <p className="mb-4">
              Enterprise-level capabilities are also available for retrieving
              data such as batch querying and API connection. Contact your local
              GST office
            </p>
            <button
              className="bg-white hover:bg-gray-200 text-navy-700 font-medium px-4 py-2 rounded transition"
              onClick={() => {
                window.open(
                  "https://gstsa1.org/template3/contact-us",
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              Contact us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GstResult;
