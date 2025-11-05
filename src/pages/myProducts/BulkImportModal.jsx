import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
} from "@heroui/react";
import {
  FileSpreadsheet,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useCreateBulkProductsMutation } from "../../store/apis/endpoints/userProducts";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

function BulkImportModal({ isOpen, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [importResult, setImportResult] = useState(null); // Store detailed import results

  const [createBulkProducts, { isLoading }] = useCreateBulkProductsMutation();

  const parseExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // Assuming the products are in the first sheet or a sheet named "products"
        const sheetName =
          workbook.SheetNames.find(
            (name) => name.toLowerCase() === "products"
          ) || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log("Raw Excel data:", jsonData); // Debug log

        // Map the Excel columns to our product structure
        const products = jsonData
          .map((row) => ({
            title: row.title || row.Title || "",
            description: row.description || row.Description || "",
            sku: row.sku?.toString() || row.SKU?.toString() || "",
            gpc: row.gpc?.toString() || row.GPC?.toString() || "",
            hsCode: row.hsCode?.toString() || row.HSCode?.toString() || "",
            unitOfMeasure: row.unitOfMeasure || row.UnitOfMeasure || "",
            brandName: row.brandName || row.BrandName || "",
            countryOfOrigin: row.countryOfOrigin || row.CountryOfOrigin || "",
            countryOfSale: row.countryOfSale || row.CountryOfSale || "",
            barcodeType: row.barcodeType || row.BarcodeType || "",
            packagingType: row.packagingType || row.PackagingType || "",
            productType: row.productType || row.ProductType || "",
          }))
          .filter((product) => {
            // Only filter out completely empty rows
            const hasAnyData =
              product.title || product.sku || product.barcodeType;
            return hasAnyData;
          });

        setParsedData(products);
        console.log("Parsed products:", products);
        console.log("Total products found:", products.length);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        toast.error("Error parsing Excel file. Please check the file format.");
        setSelectedFile(null);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setSelectedFile(file);
      parseExcelFile(file);
    } else {
      toast.error("Please select a valid Excel file (.xlsx)");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setSelectedFile(file);
      parseExcelFile(file);
    } else {
      toast.error("Please select a valid Excel file (.xlsx)");
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/products-template.xlsx";
    link.download = "products-template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    if (!parsedData || parsedData.length === 0) {
      toast.error(
        "No valid product data found in the file. Please check the Excel sheet has a 'products' sheet with data in the correct columns."
      );
      return;
    }

    try {
      setUploadStatus(null);
      setImportResult(null);

      // Send the products array to the API
      const response = await createBulkProducts({
        products: parsedData,
      }).unwrap();

      console.log("Upload response:", response);

      // Check if all products succeeded
      const summary = response?.data?.summary;
      if (summary && summary.succeeded > 0) {
        setUploadStatus("success");
        setImportResult(response.data);

        if (summary.failed > 0) {
          toast.success(
            `Partially imported: ${summary.succeeded} succeeded, ${summary.failed} failed`
          );
        } else {
          toast.success(`Successfully imported ${summary.succeeded} products!`);
        }

        // Close modal after a short delay only if all succeeded
        if (summary.failed === 0) {
          setTimeout(() => {
            handleModalClose();
          }, 2000);
        }
      } else {
        // All failed
        setUploadStatus("error");
        setImportResult(response.data);
        toast.error(response?.message || "All products failed to import");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");

      // Store the error details if available
      if (error?.data?.data) {
        setImportResult(error.data.data);
        const summary = error.data.data.summary;
        if (summary) {
          toast.error(
            `Import failed: ${summary.failed} of ${summary.total} products had errors`
          );
        } else {
          toast.error(error?.data?.message || "Failed to upload products.");
        }
      } else {
        toast.error(
          error?.data?.message || "Failed to upload products. Please try again."
        );
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setParsedData(null);
    setUploadStatus(null);
    setImportResult(null);
    // Reset the file input so the same file can be selected again
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleModalClose = () => {
    setSelectedFile(null);
    setParsedData(null);
    setIsDragging(false);
    setUploadStatus(null);
    setImportResult(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      scrollBehavior="outside"
      size="2xl"
      backdrop="blur"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-primary" size={24} />
                <span>Bulk Import Products</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {/* Instructions Card */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardBody>
                    <div className="flex gap-2">
                      <AlertCircle
                        className="text-blue-600 shrink-0"
                        size={20}
                      />
                      <div className="space-y-2 text-sm">
                        <p className="font-semibold text-blue-900">
                          Instructions:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-blue-800">
                          <li>Download the Excel template below</li>
                          <li>Fill in your product details in the template</li>
                          <li>Upload the completed Excel file</li>
                          <li>Review and confirm the import</li>
                        </ol>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Download Template Button */}
                <div className="flex justify-center">
                  <Button
                    color="success"
                    variant="flat"
                    startContent={<Download size={20} />}
                    onClick={handleDownloadTemplate}
                    size="lg"
                  >
                    Download Excel Template
                  </Button>
                </div>

                {/* File Upload Area */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Upload Completed Excel File
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      isDragging
                        ? "border-primary bg-primary-50"
                        : "border-gray-300 hover:border-primary"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("file-input").click()
                    }
                  >
                    <input
                      id="file-input"
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <Upload
                        size={48}
                        className={
                          isDragging ? "text-primary" : "text-gray-400"
                        }
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {isDragging
                            ? "Drop your file here"
                            : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Excel files only (.xlsx)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected File Display */}
                {selectedFile && (
                  <Card className="bg-green-50 border-green-200">
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet
                            className="text-green-600"
                            size={24}
                          />
                          <div>
                            <p className="font-medium text-green-900">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-green-700">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                              {parsedData && parsedData.length > 0 && (
                                <> • {parsedData.length} products found</>
                              )}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          onClick={handleRemoveFile}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* Upload Status Messages */}
                {uploadStatus === "success" && importResult && (
                  <Card
                    className={
                      importResult.summary.failed > 0
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-green-50 border-green-200"
                    }
                  >
                    <CardBody>
                      <div className="flex items-start gap-2">
                        <CheckCircle2
                          className={
                            importResult.summary.failed > 0
                              ? "text-yellow-600"
                              : "text-green-600"
                          }
                          size={24}
                        />
                        <div className="flex-1">
                          <p
                            className={`font-semibold ${
                              importResult.summary.failed > 0
                                ? "text-yellow-900"
                                : "text-green-900"
                            }`}
                          >
                            {importResult.summary.failed > 0
                              ? "Partial Import"
                              : "Upload Successful!"}
                          </p>
                          <div
                            className={`text-sm mt-2 ${
                              importResult.summary.failed > 0
                                ? "text-yellow-800"
                                : "text-green-800"
                            }`}
                          >
                            <p>✓ Succeeded: {importResult.summary.succeeded}</p>
                            <p>✗ Failed: {importResult.summary.failed}</p>
                            <p>Total: {importResult.summary.total}</p>
                          </div>
                          {importResult.failed &&
                            importResult.failed.length > 0 && (
                              <div className="mt-3 max-h-40 overflow-y-auto">
                                <p className="text-xs font-semibold text-yellow-900 mb-1">
                                  Failed Items:
                                </p>
                                {importResult.failed.map((item, index) => (
                                  <div
                                    key={index}
                                    className="text-xs text-yellow-800 bg-yellow-100 rounded p-2 mb-1"
                                  >
                                    <p>
                                      <strong>Row {item.row}:</strong>{" "}
                                      {item.title || item.sku}
                                    </p>
                                    <p className="text-red-600">{item.error}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}

                {uploadStatus === "error" && importResult && (
                  <Card className="bg-red-50 border-red-200">
                    <CardBody>
                      <div className="flex items-start gap-2">
                        <XCircle className="text-red-600" size={24} />
                        <div className="flex-1">
                          <p className="font-semibold text-red-900">
                            Upload Failed
                          </p>
                          <div className="text-sm mt-2 text-red-800">
                            <p>
                              ✗ Failed:{" "}
                              {importResult.summary?.failed ||
                                importResult.failed?.length}
                            </p>
                            <p>Total: {importResult.summary?.total}</p>
                          </div>
                          {importResult.failed &&
                            importResult.failed.length > 0 && (
                              <div className="mt-3 max-h-40 overflow-y-auto">
                                <p className="text-xs font-semibold text-red-900 mb-1">
                                  Errors:
                                </p>
                                {importResult.failed.map((item, index) => (
                                  <div
                                    key={index}
                                    className="text-xs text-red-800 bg-red-100 rounded p-2 mb-1"
                                  >
                                    <p>
                                      <strong>Row {item.row}:</strong>{" "}
                                      {item.title || item.sku}
                                    </p>
                                    <p className="text-red-700">{item.error}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={handleModalClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleUpload}
                isDisabled={!selectedFile || !parsedData}
                isLoading={isLoading}
                startContent={!isLoading && <Upload size={18} />}
              >
                {isLoading ? "Uploading..." : "Upload & Import"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

BulkImportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BulkImportModal;
