import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Button,
  Pagination,
  useDisclosure,
  Input,
  Spinner,
} from "@nextui-org/react";
import MainLayout from "../../../layout/PortalLayouts/MainLayout";
import { Images } from "../../../assets/Index";
import AddDigitalLink from "./AddDigitalLink";
import EditDigitalLink from "./EditDigitalLink";
import DeleteDigitalLink from "./DeleteDigitalLink";
import toast from "react-hot-toast";
import { useDebounce } from "../../../hooks/useDebounce";
// react icons
import { FaSearch, FaEdit, FaTrash, FaLeaf, FaDownload } from "react-icons/fa";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/slices/memberSlice";
import {
  useGetDigitalLinksQuery,
  useGetDigitalLinksSECQuery,
} from "../../../store/apis/endpoints/digitalLink";

import AddDigitalLinkSEC from "./AddDigitalLinkSEC";
import DigitalLinkSECTable from "./DigitalLinkSECTable";
import bwipjs from "bwip-js";
import AggregationTable from "../../../components/myProducts/digitalLink/Aggregation/AggregationTable";
import UDITable from "../../../components/myProducts/digitalLink/UDI/UDITable";

const digitalLinks = [
  {
    icon: Images.SafetyInformation,
    title: "Safety Information",
    description: "Product safety details and guidelines",
  },
  {
    icon: Images.SaudiElectricity,
    title: "Saudi Electricity Company",
    description: "Power consumption information",
  },
  {
    icon: Images.ProductContents,
    title: "Product Contents",
    description: "Detailed product specifications",
  },
  {
    icon: Images.Aggregation,
    title: "Aggregation/Serialization",
    description: "Track and manage serial numbers",
  },
  {
    icon: Images.ProductRecall,
    title: "Product Recall",
    description: "Important recall notifications",
  },
  {
    icon: Images.Recipe,
    title: "Recipe",
    description: "Usage instructions and recipes",
  },
  {
    icon: Images.Packaging,
    title: "Packaging",
    description: "Packaging specifications",
  },
  {
    icon: Images.ElectronicLeaflet,
    title: "Electronic Leaflets",
    description: "Digital product documentation",
  },
  {
    icon: Images.SustainabilityInfo,
    title: "Sustainability Info",
    description: "Environmental impact and sustainability details",
  },
  {
    icon: Images.Traceability,
    title: "Traceability",
    description: "Product tracking and supply chain visibility",
  },
  {
    icon: Images.UDI,
    title: "UDI",
    description: "Unique Device Identification for medical devices",
  },
  {
    icon: Images.Compliance,
    title: "Compliance",
    description: "Regulatory compliance and certification information",
  },
];

function DigitalLink() {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  const { gtin, productName, brandName, barcodeType } = location.state || {};
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCard, setSelectedCard] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [selectedDigitalLink, setSelectedDigitalLink] = useState(null);
  const {
    isOpen: isSecOpen,
    onOpen: onSecOpen,
    onClose: onSecClose,
  } = useDisclosure();

  const hasSecAccess = barcodeType === "SEC";

  // Only fetch digital links data if we're not showing SEC or Aggregation tables
  const shouldFetchDigitalLinks =
    selectedCard !== null &&
    digitalLinks[selectedCard].title !== "Saudi Electricity Company" &&
    digitalLinks[selectedCard].title !== "Aggregation/Serialization" &&
    digitalLinks[selectedCard].title !== "UDI";

  const {
    data: digitalLinksData,
    isLoading,
    isFetching,
  } = useGetDigitalLinksQuery(
    {
      gtin,
      digitalLinkType:
        selectedCard !== null ? digitalLinks[selectedCard].title : "",
      page,
      limit: rowsPerPage,
      search: debouncedSearch,
    },
    {
      skip: !gtin || !shouldFetchDigitalLinks,
    }
  );

  // Only fetch SEC data if SEC card is selected
  const {
    data: secData,
    isLoading: isSecLoading,
    isFetching: isSecFetching,
  } = useGetDigitalLinksSECQuery(
    {
      page,
      limit: rowsPerPage,
      search: debouncedSearch,
      gtin,
    },
    {
      skip:
        !selectedCard ||
        digitalLinks[selectedCard]?.title !== "Saudi Electricity Company",
    }
  );

  const tableData = useMemo(() => {
    return digitalLinksData?.data?.digitalLinks || [];
  }, [digitalLinksData]);

  const pages = useMemo(() => {
    return digitalLinksData?.data?.pagination?.totalPages || 0;
  }, [digitalLinksData]);

  const columns = [
    { name: "ID", uid: "id" },
    { name: "TARGET URL", uid: "url" },
    { name: "DIGITAL TYPE", uid: "digitalType" },
    { name: "GTIN", uid: "gtin" },
    { name: "CREATED AT", uid: "createdAt" },
    { name: "UPDATED AT", uid: "updatedAt" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const handleCardClick = (index) => {
    if (
      digitalLinks[index].title === "Saudi Electricity Company" &&
      !hasSecAccess
    ) {
      return;
    }
    setSelectedCard(index);
  };

  const handleAddDigitalLink = () => {
    if (selectedCard !== null) {
      if (digitalLinks[selectedCard].title === "Saudi Electricity Company") {
        onSecOpen();
      } else {
        onOpen();
      }
    } else {
      toast.error("Please select a digital link type first");
    }
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-4">
              {selectedCard !== null
                ? digitalLinks[selectedCard].title
                : "Digital Links"}
            </h1>
          </div>
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by URL or digital type..."
            startContent={<FaSearch className="text-default-300" />}
            value={search}
            onClear={() => setSearch("")}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="">
            <Button
              color="primary"
              className="px-8"
              startContent={<span>+</span>}
              onClick={handleAddDigitalLink}
            >
              Add Digital Link
            </Button>
          </div>
        </div>
      </div>
    );
  }, [selectedCard, search]);

  useEffect(() => {
    if (!gtin) return;

    try {
      bwipjs.toCanvas("ean13-canvas", {
        bcid: "ean13",
        text: gtin,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
      });
    } catch (err) {
      console.error("Error generating EAN-13:", err);
    }

    try {
      const dataMatrixText = [gtin, productName, brandName]
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

    try {
      const qrText = [gtin, productName, brandName].filter(Boolean).join(" | ");

      bwipjs.toCanvas("qrcode-canvas", {
        bcid: "qrcode",
        text: qrText,
        scale: 3,
        includetext: false,
      });
    } catch (err) {
      console.error("Error generating QR Code:", err);
    }
  }, [gtin, productName, brandName]);

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
      a.download = `${fileName}-${gtin || "barcode"}.png`; // Using gtin from props
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <MainLayout>
      <div className="p-8">
        <Button
          color="primary"
          variant="light"
          className="mb-4"
          onClick={() => window.history.back()}
          startContent={<span>←</span>}
        >
          Back to Products
        </Button>

        <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary mb-4">
                Digital Links
              </h1>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Product:</span>
                  <span className="text-gray-600">{productName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Brand:</span>
                  <span className="text-gray-600">{brandName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">GTIN:</span>
                  <span className="text-gray-600">{gtin}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center ">
                <div className="bg-white p-2">
                  <canvas
                    id="ean13-canvas"
                    className="w-[220px] h-[100px] mt-4"
                  ></canvas>
                </div>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  className="mt-3"
                  onClick={() => downloadCanvas("ean13-canvas", "ean13")}
                  startContent={<FaDownload />}
                >
                  Download Barcode
                </Button>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="bg-white p-2">
                  <canvas
                    id="datamatrix-canvas"
                    className="w-[120px] h-[120px]"
                  ></canvas>
                </div>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onClick={() =>
                    downloadCanvas("datamatrix-canvas", "datamatrix")
                  }
                  startContent={<FaDownload />}
                >
                  Download Matrix
                </Button>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="bg-white p-2">
                  <canvas
                    id="qrcode-canvas"
                    className="w-[120px] h-[120px]"
                  ></canvas>
                </div>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onClick={() => downloadCanvas("qrcode-canvas", "qrcode")}
                  startContent={<FaDownload />}
                >
                  Download QR
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {digitalLinks.map((link, index) => (
            <Card
              key={index}
              isPressable={
                !(link.title === "Saudi Electricity Company" && !hasSecAccess)
              }
              className={`transition-transform ${
                selectedCard === index ? "border-2 border-primary" : ""
              } ${
                link.title === "Saudi Electricity Company" && !hasSecAccess
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105"
              }`}
              onClick={() => {
                if (
                  link.title === "Saudi Electricity Company" &&
                  !hasSecAccess
                ) {
                  toast.error(
                    "This feature is only available for SEC products"
                  );
                  return;
                }
                handleCardClick(index);
              }}
            >
              <CardBody className="flex flex-row items-center p-4 gap-4">
                <img
                  src={link.icon}
                  alt={link.title}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="font-semibold text-primary">{link.title}</h3>
                  <p className="text-sm text-gray-500">{link.description}</p>
                  {link.title === "Saudi Electricity Company" &&
                    !hasSecAccess && (
                      <span className="text-xs text-danger mt-1 block">
                        Only available for SEC products
                      </span>
                    )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          {selectedCard !== null &&
          digitalLinks[selectedCard].title === "Saudi Electricity Company" ? (
            <DigitalLinkSECTable
              data={secData?.data}
              isLoading={isSecLoading || isSecFetching}
              page={page}
              setPage={setPage}
              search={search}
              setSearch={setSearch}
              onAdd={onSecOpen}
            />
          ) : selectedCard !== null &&
            digitalLinks[selectedCard].title === "Aggregation/Serialization" ? (
            <AggregationTable gtin={gtin} />
          ) : selectedCard !== null &&
            digitalLinks[selectedCard].title === "UDI" ? (
            <UDITable gtin={gtin} />
          ) : selectedCard !== null ? (
            <Table
              topContent={topContent}
              bottomContent={
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              }
              aria-label="Digital links table"
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={tableData}
                isLoading={isFetching || isLoading}
                loadingContent={<Spinner />}
                emptyContent={<div>No digital links found</div>}
              >
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>
                        {columnKey === "actions" ? (
                          <div className="flex gap-2">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              onClick={() => {
                                setSelectedDigitalLink(item);
                                onEditOpen();
                              }}
                            >
                              <FaEdit className="text-primary" />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              onClick={() => {
                                setSelectedDigitalLink(item);
                                onDeleteOpen();
                              }}
                            >
                              <FaTrash className="text-danger" />
                            </Button>
                          </div>
                        ) : columnKey === "createdAt" ||
                          columnKey === "updatedAt" ? (
                          new Date(item[columnKey]).toLocaleDateString()
                        ) : (
                          item[columnKey]
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : null}
        </div>
      </div>

      <AddDigitalLink
        isOpen={isOpen}
        onClose={onClose}
        gtin={gtin}
        digitalType={
          selectedCard !== null ? digitalLinks[selectedCard].title : ""
        }
      />

      <AddDigitalLinkSEC isOpen={isSecOpen} onClose={onSecClose} gtin={gtin} />

      <EditDigitalLink
        isOpen={isEditOpen}
        onClose={onEditClose}
        digitalLink={selectedDigitalLink}
      />

      <DeleteDigitalLink
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        digitalLink={selectedDigitalLink}
      />
    </MainLayout>
  );
}

export default DigitalLink;
