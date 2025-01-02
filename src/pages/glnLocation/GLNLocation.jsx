import React, { useMemo, useState } from "react";
import MainLayout from "../../layout/PortalLayouts/MainLayout";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaPlus,
  FaFilePdf,
  FaFileExcel,
  FaFile,
} from "react-icons/fa";
import { format } from "date-fns";
import {
  useGetGLNLocationTypesQuery,
  useLazyExportGLNsToExcelQuery,
  useLazyExportGLNsToPDFQuery,
} from "../../store/apis/endpoints/gln";
import { useGetGtinsCountQuery } from "../../store/apis/endpoints/userProducts";
import { useNavigate } from "react-router-dom";
import DeleteGLNLocation from "./DeleteGLNLocation";

function GLNLocation() {
  const [page, setPage] = React.useState(1);
  const [selectedGLN, setSelectedGLN] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const { data: glnData, isLoading } = useGetGLNLocationTypesQuery();
  const { data: gtinsCount, isLoading: isLoadingGtinsCount } =
    useGetGtinsCountQuery();
  const [exportExcel, { isFetching: isExporting }] =
    useLazyExportGLNsToExcelQuery();
  const [exportPdf, { isFetching: isPdfExporting }] =
    useLazyExportGLNsToPDFQuery();

  const locations = glnData?.data?.glns || [];
  const pagination = glnData?.data?.pagination || { total: 0, totalPages: 1 };
  const availableGLNs = gtinsCount?.data?.barcodeTypes?.GLN || 0;

  const columns = [
    { name: "LOCATION NAME", uid: "locationName" },
    { name: "GLN IDENTIFICATION", uid: "identifier" },
    { name: "GLN BARCODE", uid: "gtin" },
    { name: "PHYSICAL LOCATION", uid: "physicalLocation" },
    { name: "STATUS", uid: "isActive" },
    { name: "CERTIFICATE", uid: "certificate" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "locationName":
        return (
          <div>
            <div className="font-medium">{item.locationNameEn}</div>
            <div className="text-sm text-gray-500">{item.locationNameAr}</div>
          </div>
        );
      case "gtin":
        return (
          <Chip
            className="cursor-pointer"
            color="primary"
            variant="flat"
            onClick={() => navigator.clipboard.writeText(item.gtin)}
          >
            {item.gtin}
          </Chip>
        );
      case "identifier":
        return (
          <Chip color="secondary" variant="flat">
            {item.identifier}
          </Chip>
        );
      case "isActive":
        return (
          <Chip color={item.isActive ? "success" : "danger"} variant="flat">
            {item.isActive ? "Active" : "Inactive"}
          </Chip>
        );
      case "certificate":
        return item.certificate ? (
          <Button
            isIconOnly
            variant="light"
            onClick={() => window.open(item.certificate, "_blank")}
          >
            <FaFile className="text-primary" />
          </Button>
        ) : (
          <span className="text-gray-400">-</span>
        );
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <FaEllipsisV className="text-default-400" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                startContent={<FaEdit />}
                onClick={() =>
                  navigate(`/member-portal/gln-location/edit/${item.id}`, {
                    state: { glnData: item },
                  })
                }
              >
                Edit
              </DropdownItem>
              <DropdownItem
                startContent={<FaTrash />}
                onClick={() => handleDeleteClick(item)}
                className="text-danger"
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return item[columnKey];
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await exportExcel().unwrap();
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `GLN_Locations_${format(new Date(), "yyyy-MM-dd")}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleExportPdf = async () => {
    try {
      const response = await exportPdf().unwrap();
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `GLN_Locations_${format(new Date(), "yyyy-MM-dd")}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Export failed:", error);
    }
  };

  const topContent = useMemo(
    () => (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">GLN Locations</h1>
            <div className="text-sm text-gray-500 mt-1">
              {isLoadingGtinsCount ? (
                <Spinner size="sm" />
              ) : (
                <Chip
                  size="sm"
                  color={availableGLNs > 0 ? "success" : "danger"}
                  variant="flat"
                >
                  {availableGLNs} GLN{availableGLNs !== 1 ? "s" : ""} Available
                </Chip>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="flat"
              startContent={<FaFilePdf />}
              color="danger"
              onClick={handleExportPdf}
              isDisabled={isPdfExporting}
            >
              {isPdfExporting ? "Exporting..." : "PDF Export"}
            </Button>
            <Button
              variant="flat"
              startContent={<FaFileExcel />}
              color="primary"
              onClick={handleExportExcel}
              isDisabled={isExporting}
            >
              {isExporting ? "Exporting..." : "Export Excel"}
            </Button>
            <Button
              onClick={() => navigate("/member-portal/gln-location/add")}
              color="primary"
              startContent={<FaPlus />}
              isDisabled={availableGLNs === 0}
            >
              Add Location
            </Button>
          </div>
        </div>
      </div>
    ),
    [
      exportExcel,
      exportPdf,
      isExporting,
      isPdfExporting,
      availableGLNs,
      isLoadingGtinsCount,
    ]
  );

  const bottomContent = useMemo(() => {
    return (
      <div className="flex justify-between items-center px-2 py-2">
        <span className="text-small text-default-400">
          Total {pagination.total} Locations
        </span>
        <Pagination
          showControls
          color="primary"
          page={page}
          total={pagination.totalPages}
          onChange={setPage}
        />
      </div>
    );
  }, [pagination, page]);

  const handleDeleteClick = (gln) => {
    setSelectedGLN(gln);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedGLN(null);
  };

  return (
    <MainLayout>
      <div className="mx-auto p-8">
        <Table
          aria-label="GLN Locations table"
          topContent={topContent}
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          topContentPlacement="outside"
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
            items={locations}
            loadingContent={<Spinner />}
            emptyContent={<div>No data found</div>}
            isLoading={isLoading}
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
        <DeleteGLNLocation
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          glnData={selectedGLN}
        />
      </div>
    </MainLayout>
  );
}

export default GLNLocation;
