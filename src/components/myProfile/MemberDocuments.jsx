import React, { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Spinner,
  Chip,
  Tooltip,
  Button,
} from "@nextui-org/react";
import { FaSearch, FaFileInvoice } from "react-icons/fa";
import { useGetUserByIdQuery } from "../../store/apis/endpoints/user";
import { useSelector } from "react-redux";

function MemberDocuments() {
  const [search, setSearch] = useState("");
  const { user: memberUser } = useSelector((state) => state.member);
  const { data: docsData, isLoading } = useGetUserByIdQuery(
    {
      id: memberUser?.id,
      params: { fields: "docs" },
    },
    {
      skip: !memberUser?.id,
    }
  );

  // Flatten all document types into a single array
  const documents = useMemo(() => {
    const docs = docsData?.data?.user?.documents;
    if (!docs) return [];

    return [
      ...docs.receipts.map((doc) => ({ ...doc, category: "Receipt" })),
      ...docs.certificates.map((doc) => ({ ...doc, category: "Certificate" })),
      ...docs.bankSlips.map((doc) => ({ ...doc, category: "Bank Slip" })),
      ...docs.invoices.map((doc) => ({ ...doc, category: "Invoice" })),
    ];
  }, [docsData]);

  const columns = [
    { name: "ORDER ID", uid: "orderNumber" },
    { name: "DOCUMENT TYPE", uid: "category" },
    { name: "STATUS", uid: "status" },
    { name: "DATE", uid: "createdAt" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (doc, columnKey) => {
    switch (columnKey) {
      case "orderNumber":
        return (
          <Tooltip content={doc.orderNumber}>
            <p className="text-sm cursor-pointer">{doc.orderNumber}</p>
          </Tooltip>
        );
      case "status":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={doc.status === "Activated" ? "success" : "warning"}
          >
            {doc.status}
          </Chip>
        );
      case "createdAt":
        return (
          <p className="text-sm">
            {new Date(doc.createdAt).toLocaleDateString()}
          </p>
        );
      case "actions":
        return (
          <Tooltip content="View Document">
            <Button
              isIconOnly
              variant="light"
              as="a"
              href={doc.path}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg cursor-pointer text-default-400 hover:text-default-500"
            >
              <FaFileInvoice />
            </Button>
          </Tooltip>
        );
      default:
        return <p className="text-sm">{doc[columnKey]}</p>;
    }
  };

  const topContent = useMemo(
    () => (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div className="flex justify-between items-center">
          <Input
            isClearable
            value={search}
            onValueChange={setSearch}
            className="w-full sm:max-w-[44%]"
            placeholder="Search by order ID..."
            startContent={<FaSearch className="text-default-300" />}
          />
        </div>
      </div>
    ),
    [search]
  );

  return (
    <Table
      aria-label="Documents table"
      topContent={topContent}
      classNames={{
        wrapper: "shadow-md rounded-lg",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            className="bg-gray-50 text-gray-600"
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={documents}
        isLoading={isLoading}
        emptyContent="No documents found"
        loadingContent={<Spinner />}
      >
        {(item) => (
          <TableRow key={`${item.orderNumber}-${item.category}`}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default MemberDocuments;
