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
  Card,
} from "@nextui-org/react";
import {
  FaSearch,
  FaFileInvoice,
  FaEdit,
  FaTrash,
  FaIdCard,
  FaPlus,
  FaFilePdf,
  FaSync,
} from "react-icons/fa";
import { useGetUserByIdQuery } from "../../store/apis/endpoints/user";
import { useSelector } from "react-redux";
import AddDocument from "./AddDocument";
import EditDocument from "./EditDocument";
import DeleteDocument from "./DeleteDocument";

function MemberDocuments() {
  const [search, setSearch] = useState("");
  const { user: memberUser } = useSelector((state) => state.member);
  const {
    data: docsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetUserByIdQuery(
    {
      id: memberUser?.id,
      params: { fields: "docs" },
    },
    {
      skip: !memberUser?.id,
    }
  );

  // Combine all documents into a single array with proper formatting
  const allDocuments = useMemo(() => {
    const docs = docsData?.data?.user;
    if (!docs) return [];

    // Format general docs
    const generalDocs = (docs.docs || []).map((doc) => ({
      ...doc,
      isGeneral: true,
      orderNumber: "-",
      category: "Personal Document",
      status: "Active",
      invoice: null,
    }));

    // Format categorized docs
    const categorizedDocs = [
      ...(docs.documents?.receipts || []).map((doc) => ({
        ...doc,
        name: "Receipt",
        category: "Receipt",
        isGeneral: false,
        invoice: null,
      })),
      ...(docs.documents?.certificates || []).map((doc) => ({
        ...doc,
        name: "Certificate",
        category: "Certificate",
        isGeneral: false,
        invoice: null,
      })),
      ...(docs.documents?.bankSlips || []).map((doc) => ({
        ...doc,
        name: "Bank Slip",
        category: "Bank Slip",
        isGeneral: false,
        invoice: null,
      })),
      ...(docs.documents?.invoices || []).map((doc) => ({
        ...doc,
        name: `Invoice ${doc.invoiceNumber}`,
        category: "Invoice",
        isGeneral: false,
        invoice: doc.path,
      })),
    ];

    return [...generalDocs, ...categorizedDocs];
  }, [docsData]);

  const columns = [
    { name: "DOCUMENT NAME", uid: "name" },
    { name: "ORDER ID", uid: "orderNumber" },
    { name: "DOCUMENT TYPE", uid: "category" },
    { name: "STATUS", uid: "status" },
    { name: "DOCUMENT", uid: "invoice" },
    { name: "DATE", uid: "createdAt" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const renderCell = (doc, columnKey) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-2">
            <FaIdCard className="text-primary" />
            <span>{doc.name || "-"}</span>
          </div>
        );
      case "orderNumber":
        return <p>{doc.orderNumber || "-"}</p>;
      case "category":
        return (
          <Chip color="primary" variant="flat">
            {doc.category}
          </Chip>
        );
      case "status":
        return (
          <Chip
            color={
              doc.status?.toLowerCase() === "activated" ? "success" : "warning"
            }
            variant="flat"
          >
            {doc.status}
          </Chip>
        );
      case "invoice":
        // Handle document viewing for all types
        if (doc.isGeneral) {
          return (
            <Tooltip content="View Document">
              <Button
                isIconOnly
                variant="light"
                as="a"
                href={doc.doc}
                target="_blank"
                className="text-primary"
              >
                <FaFileInvoice />
              </Button>
            </Tooltip>
          );
        }

        // For different document types
        switch (doc.category) {
          case "Invoice":
            return (
              <Tooltip content="View Invoice">
                <Button
                  isIconOnly
                  variant="light"
                  as="a"
                  href={doc.path}
                  target="_blank"
                  className="text-primary"
                >
                  <FaFileInvoice />
                </Button>
              </Tooltip>
            );
          case "Receipt":
            return (
              <Tooltip content="View Receipt">
                <Button
                  isIconOnly
                  variant="light"
                  as="a"
                  href={doc.path}
                  target="_blank"
                  className="text-primary"
                >
                  <FaFileInvoice />
                </Button>
              </Tooltip>
            );
          case "Certificate":
            return (
              <Tooltip content="View Certificate">
                <Button
                  isIconOnly
                  variant="light"
                  as="a"
                  href={doc.path}
                  target="_blank"
                  className="text-primary"
                >
                  <FaFileInvoice />
                </Button>
              </Tooltip>
            );
          case "Bank Slip":
            return (
              <Tooltip content="View Bank Slip">
                <Button
                  isIconOnly
                  variant="light"
                  as="a"
                  href={doc.path}
                  target="_blank"
                  className="text-primary"
                >
                  <FaFileInvoice />
                </Button>
              </Tooltip>
            );
          default:
            return <span>-</span>;
        }
      case "createdAt":
        return <p>{new Date(doc.createdAt).toLocaleDateString()}</p>;
      case "actions":
        if (doc.category === "Bank Slip") {
          return <span>-</span>;
        }

        if (doc.isGeneral) {
          return (
            <div className="flex gap-2">
              <Tooltip content="Edit Document">
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => {
                    setSelectedDocument(doc);
                    setIsEditModalOpen(true);
                  }}
                  className="text-default-400"
                >
                  <FaEdit />
                </Button>
              </Tooltip>
              <Tooltip content="Delete Document">
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => {
                    setSelectedDocument(doc);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-danger"
                >
                  <FaTrash />
                </Button>
              </Tooltip>
            </div>
          );
        }
        return (
          <Chip size="sm" variant="flat">
            System Generated
          </Chip>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full  mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[#1B2B65]">Documents</h1>
          <Tooltip content="Refresh Documents">
            <Button
              isIconOnly
              variant="light"
              onPress={() => refetch()}
              isLoading={isLoading}
              className="text-default-400"
            >
              <FaSync />
            </Button>
          </Tooltip>
        </div>
        <Button
          className="bg-[#1B2B65] text-white rounded-full px-6 hover:bg-[#2a3d7c] transition-all"
          endContent={<FaPlus size={20} />}
          onPress={() => setIsAddModalOpen(true)}
        >
          Add Document
        </Button>
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <Table
          aria-label="Documents table"
          classNames={{
            wrapper: "shadow-none",
            th: "bg-gray-50/50 font-medium text-gray-600",
            td: "py-4",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid}>{column.name}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={allDocuments}
            isLoading={isLoading || isFetching}
            loadingContent={<Spinner />}
            emptyContent="No documents found"
          >
            {(item) => (
              <TableRow key={item.id || `${item.orderNumber}-${item.category}`}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <AddDocument
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditDocument
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        document={selectedDocument}
      />
      <DeleteDocument
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        document={selectedDocument}
      />

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Terms & Conditions</h2>
        <div className="flex items-center space-x-4">
          <a
            href="https://api.gstsa1.org/assets/docs/terms-and-conditions.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <FaFilePdf className="text-red-600 text-xl" />
            <span>Terms and Conditions Document</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default MemberDocuments;
