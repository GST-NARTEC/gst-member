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
} from "react-icons/fa";
import { useGetUserByIdQuery } from "../../store/apis/endpoints/user";
import { useSelector } from "react-redux";
import AddDocument from "./AddDocument";
import EditDocument from "./EditDocument";
import DeleteDocument from "./DeleteDocument";

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

  // Separate general documents and categorized documents
  const generalDocs = useMemo(() => {
    return docsData?.data?.user?.docs || [];
  }, [docsData]);

  const categorizedDocs = useMemo(() => {
    const docs = docsData?.data?.user?.documents;
    if (!docs) return [];

    return [
      ...docs.receipts.map((doc) => ({ ...doc, category: "Receipt" })),
      ...docs.certificates.map((doc) => ({ ...doc, category: "Certificate" })),
      ...docs.bankSlips.map((doc) => ({ ...doc, category: "Bank Slip" })),
      ...docs.invoices.map((doc) => ({
        ...doc,
        category: "Invoice",
      })),
    ];
  }, [docsData]);

  const columns = {
    general: [
      { name: "NAME", uid: "name" },
      { name: "DATE", uid: "createdAt" },
      { name: "ACTIONS", uid: "actions" },
    ],
    categorized: [
      { name: "ORDER ID", uid: "orderNumber" },
      { name: "DOCUMENT TYPE", uid: "category" },
      { name: "STATUS", uid: "status" },
      { name: "DATE", uid: "createdAt" },
      { name: "ACTIONS", uid: "actions" },
    ],
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const renderCell = (doc, columnKey, isGeneral = false) => {
    if (isGeneral) {
      switch (columnKey) {
        case "name":
          return (
            <div className="flex items-center gap-2">
              <FaIdCard className="text-primary" />
              <span>{doc.name}</span>
            </div>
          );
        case "createdAt":
          return <p>{new Date(doc.createdAt).toLocaleDateString()}</p>;
        case "actions":
          return (
            <div className="flex ">
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
        default:
          return null;
      }
    }

    // For categorized documents
    switch (columnKey) {
      case "orderNumber":
        return <p>{doc.orderNumber}</p>;
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
      case "createdAt":
        return <p>{new Date(doc.createdAt).toLocaleDateString()}</p>;
      case "actions":
        return (
          <div className="flex gap-2 justify-center">
            <Tooltip content="View Document">
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 space-y-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-[#1B2B65]">Documents</h1>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Personal Documents
            </h2>
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
              aria-label="Personal documents"
              classNames={{
                wrapper: "shadow-none",
                th: "bg-gray-50/50 font-medium text-gray-600",
                td: "py-4",
              }}
            >
              <TableHeader columns={columns.general}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={generalDocs}
                isLoading={isLoading}
                loadingContent={<Spinner />}
                emptyContent="No personal documents found"
              >
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey, true)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Business Documents
          </h2>
          <Card className="border border-gray-100 shadow-sm">
            <Table
              aria-label="Business documents"
              classNames={{
                wrapper: "shadow-none",
                th: "bg-gray-50/50 font-medium text-gray-600",
                td: "py-4",
              }}
            >
              <TableHeader columns={columns.categorized}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={categorizedDocs}
                isLoading={isLoading}
                loadingContent={<Spinner />}
                emptyContent="No business documents found"
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
          </Card>
        </div>

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
    </div>
  );
}

export default MemberDocuments;
