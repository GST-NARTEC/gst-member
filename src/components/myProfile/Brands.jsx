import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { FaFileAlt } from "react-icons/fa";
import { useGetBrandsQuery } from "../../store/apis/endpoints/brands";

function Brands() {
  const { data: brandsResponse, isLoading } = useGetBrandsQuery(1);

  const brands = brandsResponse?.data?.brands || [];

  const columns = [
    { name: "NAME (EN)", uid: "nameEn" },
    { name: "NAME (AR)", uid: "nameAr" },
    { name: "DOCUMENT", uid: "document" },
    { name: "CREATED AT", uid: "createdAt" },
    { name: "UPDATED AT", uid: "updatedAt" },
  ];

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "createdAt":
      case "updatedAt":
        return <p>{new Date(item[columnKey]).toLocaleDateString()}</p>;
      case "document":
        return item.document ? (
          <a
            href={item.document}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            <FaFileAlt />
          </a>
        ) : null;
      default:
        return <p>{item[columnKey]}</p>;
    }
  };

  return (
    <Table
      topContent={<h2 className="text-2xl font-bold">Brands</h2>}
      aria-label="Brands table"
      classNames={{
        wrapper: "shadow-md rounded-lg",
      }}
      loadingState={isLoading ? "loading" : "idle"}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align="start"
            className="bg-gray-50 text-gray-600"
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={brands}
        emptyContent={isLoading ? "Loading..." : "No brands found"}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default Brands;
