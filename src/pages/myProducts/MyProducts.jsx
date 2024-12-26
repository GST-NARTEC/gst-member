import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  Chip,
  Image,
  Spinner,
  Select,
  SelectItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "@nextui-org/react";
import {
  useGetUserProductsQuery,
  useDeleteUserProductMutation,
  useLazyGetExportExcelQuery,
} from "../../store/apis/endpoints/userProducts";
import { useDebounce } from "../../hooks/useDebounce";
import MainLayout from "../../layout/PortalLayouts/MainLayout";
import { FaTrash, FaEdit, FaEllipsisV, FaLink } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DeleteMyProduct from "./DeleteMyProduct";
import { useGetUserTotalSECQuantityQuery } from "../../store/apis/endpoints/user";
import { FileSpreadsheet, FileDown } from "lucide-react";

const INITIAL_VISIBLE_COLUMNS = [
  "title",
  "sku",
  "gtin",
  "brandName",
  "status",
  "barcodeType",
  "images",
  "actions",
];

function MyProducts() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { data: totalSECQuantity } = useGetUserTotalSECQuantityQuery();

  const { data, isLoading, isFetching } = useGetUserProductsQuery({
    page,
    limit: rowsPerPage,
    search: debouncedSearch,
  });

  const [deleteProduct] = useDeleteUserProductMutation();
  const [exportExcel, { isFetching: isExporting }] =
    useLazyGetExportExcelQuery();

  const handleExcelExport = async () => {
    try {
      const response = await exportExcel().unwrap();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(response.data);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.xlsx");

      // Append to body, click, and clean up
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // Release the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/member-portal/my-products/edit/${productId}`);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const columns = [
    { name: "TITLE", uid: "title" },
    { name: "SKU", uid: "sku" },
    { name: "GTIN", uid: "gtin" },
    { name: "BRAND", uid: "brandName" },
    { name: "STATUS", uid: "status" },
    { name: "BARCODE TYPE", uid: "barcodeType" },
    { name: "IMAGES", uid: "images" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (product, columnKey) => {
    switch (columnKey) {
      case "title":
        return (
          <div className="font-medium line-clamp-2 max-w-[200px]">
            {product.title}
          </div>
        );
      case "status":
        return (
          <Chip
            color={product.status === "ACTIVE" ? "success" : "warning"}
            size="sm"
            classNames={{
              base: "text-sm text-white",
            }}
          >
            {product.status}
          </Chip>
        );
      case "images":
        return product.images?.length > 0 ? (
          <Image
            src={product.images[0].url}
            alt={product.title}
            className="w-12 h-12 object-cover rounded"
          />
        ) : null;
      case "barcodeType":
        return (
          <Chip
            color="primary"
            size="sm"
            classNames={{
              base: "text-sm text-white",
            }}
          >
            {product.barcodeType}
          </Chip>
        );
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <FaEllipsisV className="text-lg" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Product Actions">
              <DropdownItem
                key="edit"
                startContent={<FaEdit className="text-primary" />}
                onClick={() => handleEdit(product.id)}
              >
                Edit Product
              </DropdownItem>
              <DropdownItem
                key="digital-link"
                startContent={<FaLink className="text-blue-500" />}
                onClick={() =>
                  navigate(
                    `/member-portal/my-products/digital-link/${product.id}`,
                    {
                      state: {
                        gtin: product.gtin,
                        productName: product.title,
                        brandName: product.brandName,
                        barcodeType: product.barcodeType,
                      },
                    }
                  )
                }
              >
                Digital Link
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<FaTrash className="text-danger" />}
                onClick={() => handleDelete(product)}
              >
                Delete Product
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return product[columnKey];
    }
  };

  const topContent = useMemo(
    () => (
      <div className="flex justify-between gap-4 items-center">
        <div className="flex gap-2 items-center flex-1 sm:max-w-[44%]">
          <Input
            isClearable
            placeholder="Search products..."
            value={searchQuery}
            onClear={() => setSearchQuery("")}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="flat"
            color="success"
            startContent={<FileSpreadsheet size={20} />}
            onClick={handleExcelExport}
            isDisabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Excel Export"}
          </Button>
          <Button
            size="sm"
            variant="flat"
            color="danger"
            startContent={<FileDown size={20} />}
            onClick={() => {
              /* Add your PDF export logic here */
            }}
          >
            PDF Export
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/member-portal/my-products/add")}
            color="primary"
          >
            Add New Product
          </Button>
        </div>
      </div>
    ),
    [searchQuery, isExporting]
  );

  const bottomContent = useMemo(
    () => (
      <div className="flex justify-between items-center">
        <div className="hidden sm:flex gap-2">
          Total Products: {data?.pagination?.total}
          {/* select selectItems to change limits  */}
        </div>

        <Pagination
          showControls
          color="primary"
          page={page}
          total={data?.pagination?.totalPages || 1}
          onChange={setPage}
        />
      </div>
    ),
    [page, data?.pagination?.totalPages]
  );

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  return (
    <MainLayout>
      <div className="p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary my-4 mx-4">
            My Products
          </h1>
        </div>
        <Table
          aria-label="Products table"
          isHeaderSticky
          bottomContent={bottomContent}
          // bottomContentPlacement="outside"
          topContent={topContent}
          // topContentPlacement="outside"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid}>{column.name}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={data?.products || []}
            loadingContent={<Spinner />}
            isLoading={isLoading || isFetching}
          >
            {(product) => (
              <TableRow key={product.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(product, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DeleteMyProduct
          isOpen={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          product={productToDelete}
        />
      </div>
    </MainLayout>
  );
}

export default MyProducts;
