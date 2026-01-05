import { useEffect, useRef } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { FaDownload, FaInfoCircle } from "react-icons/fa";
import Barcode from 'react-barcode';
import bwipjs from "bwip-js";
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const ProductBarcodes = ({ formData }) => {
    const ean13Ref = useRef(null);
    const qrcodeRef = useRef(null);

    useEffect(() => {
        if (!formData.gtin) return;

        // Generate DataMatrix with combined product information
        try {
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
    }, [formData.gtin, formData.sku, formData.title, formData.brandName]);

    const downloadCanvas = (canvasId, fileName) => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const scaleFactor = 3;
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = canvas.width * scaleFactor;
        tempCanvas.height = canvas.height * scaleFactor;

        tempCtx.fillStyle = "white";
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

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

    const handleDownloadEan13 = async () => {
        if (!ean13Ref.current) {
            toast.error('No barcode to download');
            return;
        }

        try {
            const scale = 4;
            const options = {
                scale: scale,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#FFFFFF",
                logging: false
            };

            const canvas = await html2canvas(ean13Ref.current, options);
            const fileName = `ean13-${formData.gtin || "barcode"}`;

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${fileName}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 'image/png');

            toast.success(`Barcode downloaded successfully!`);
        } catch (error) {
            console.error(error);
            toast.error(`Failed to download barcode.`);
        }
    };

    const handleDownloadQRCode = async () => {
        if (!qrcodeRef.current) {
            toast.error('No QR code to download');
            return;
        }

        try {
            const scale = 4;
            const options = {
                scale: scale,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#FFFFFF",
                logging: false
            };

            const canvas = await html2canvas(qrcodeRef.current, options);
            const fileName = `qrcode-${formData.gtin || "barcode"}`;

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${fileName}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 'image/png');

            toast.success(`QR Code downloaded successfully!`);
        } catch (error) {
            console.error(error);
            toast.error(`Failed to download QR code.`);
        }
    };

    // Generate QR Code text
    const qrText = [
        formData.gtin,
        formData.title,
        formData.brandName,
        formData.sku,
    ]
        .filter(Boolean)
        .join(" | ");

    return (
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
                                    onClick={handleDownloadEan13}
                                    startContent={<FaDownload />}
                                >
                                    Download
                                </Button>
                            </div>
                            <div className="flex justify-center bg-white p-2 rounded">
                                <div ref={ean13Ref} className="flex flex-col items-center">
                                    {formData.gtin ? (
                                        <Barcode
                                            value={formData.gtin}
                                            format="EAN13"
                                            width={2}
                                            height={60}
                                            displayValue={true}
                                        />
                                    ) : (
                                        <p className="text-gray-400 text-sm py-4">No GTIN available</p>
                                    )}
                                </div>
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
                                    <div
                                        ref={qrcodeRef}
                                        className="flex justify-center bg-white p-2 rounded"
                                    >
                                        {qrText ? (
                                            <QRCodeSVG
                                                value={qrText}
                                                size={120}
                                                level="H"
                                            />
                                        ) : (
                                            <div className="w-[120px] h-[120px] flex items-center justify-center">
                                                <p className="text-gray-400 text-xs">No data</p>
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        onClick={handleDownloadQRCode}
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
    );
};

export default ProductBarcodes;