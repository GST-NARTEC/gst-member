import React, { useMemo } from "react";
import MainLayout from "../../layout/PortalLayouts/MainLayout";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FaSearch, FaEye, FaEdit, FaEllipsisV } from "react-icons/fa";

function MyProducts() {
  // Dummy data
  const products = [
    {
      id: 1,
      product: "Shrink drinking water bottles",
      sku: "SKU001",
      category: "Beverages",
      stock: 100,
      basePrice: 24.99,
      discountedPrice: 19.99,
      status: "Active",
      added: "2024-03-20",
    },
    {
      id: 2,
      product: "Drinking water bottles",
      sku: "SKU002",
      category: "Beverages",
      stock: 150,
      basePrice: 29.99,
      discountedPrice: 25.99,
      status: "Active",
      added: "2024-03-19",
    },
  ];

  const columns = [
    { name: "PRODUCT", uid: "product" },
    { name: "SKU", uid: "sku" },
    { name: "CATEGORY", uid: "category" },
    { name: "STOCK", uid: "stock" },
    { name: "BASE PRICE", uid: "basePrice" },
    { name: "DISCOUNTED PRICE", uid: "discountedPrice" },
    { name: "STATUS", uid: "status" },
    { name: "ADDED", uid: "added" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "status":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
            {item.status}
          </span>
        );
      case "basePrice":
      case "discountedPrice":
        return <span>${item[columnKey]}</span>;
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <FaEllipsisV className="text-default-400" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem startContent={<FaEye />}>View</DropdownItem>
              <DropdownItem startContent={<FaEdit />}>Edit</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return <p>{item[columnKey]}</p>;
    }
  };

  const topContent = useMemo(
    () => (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Product List</h1>
          <Button color="primary">Add Product</Button>
        </div>
        <div className="flex justify-between items-center">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search products..."
            startContent={<FaSearch className="text-default-300" />}
          />
        </div>
      </div>
    ),
    []
  );

  return (
    <MainLayout>
      <div className=" mx-auto p-8">  
        <Table
          aria-label="Products table"
        topContent={topContent}
        classNames={{
          wrapper: "shadow-md rounded-lg  mx-auto",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              className="bg-gray-50 text-gray-600 "
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={products}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
}

export default MyProducts;
