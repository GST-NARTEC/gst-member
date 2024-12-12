import React, { useState } from "react";
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
} from "@nextui-org/react";
import MainLayout from "../../../layout/PortalLayouts/MainLayout";
import { Images } from "../../../assets/Index";

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
    icon: Images.ControllSerial,
    title: "Controlled Serials",
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
];

const dummyTableData = [
  {
    id: 1,
    targetUrl: "https://example.com/safety/123",
    digitalInfoType: "Safety Information",
    gtin: "6287021565303",
    createdAt: "2024-03-20",
    updatedAt: "2024-03-21",
  },
  // Add more dummy data as needed
];

function DigitalLink() {
  const location = useLocation();
  const { gtin, productName, brandName } = location.state || {};
  const [page, setPage] = useState(1);

  const columns = [
    { name: "ID", uid: "id" },
    { name: "TARGET URL", uid: "targetUrl" },
    { name: "DIGITAL INFORMATION TYPE", uid: "digitalInfoType" },
    { name: "GTIN", uid: "gtin" },
    { name: "CREATED AT", uid: "createdAt" },
    { name: "UPDATED AT", uid: "updatedAt" },
    { name: "ACTIONS", uid: "actions" },
  ];

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
          <div className="flex justify-between items-start">
            <div>
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
            <Button
              color="primary"
              className="px-8"
              startContent={<span>+</span>}
            >
              Add Digital Link
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {digitalLinks.map((link, index) => (
            <Card
              key={index}
              isPressable
              className="hover:scale-105 transition-transform"
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
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-primary mb-4">
            Controlled Serials
          </h2>
          <Table aria-label="Controlled Serials table">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={dummyTableData}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      {columnKey === "actions" ? (
                        <Button size="sm" color="primary">
                          View
                        </Button>
                      ) : (
                        item[columnKey]
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4">
            <Pagination
              total={10}
              page={page}
              onChange={setPage}
              color="primary"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default DigitalLink;
