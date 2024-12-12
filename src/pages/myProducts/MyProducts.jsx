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
} from "@nextui-org/react";
import {
  useGetUserProductsQuery,
  useDeleteUserProductMutation,
} from "../../store/apis/endpoints/userProducts";
import { useDebounce } from "../../hooks/useDebounce";
import MainLayout from "../../layout/PortalLayouts/MainLayout";
import { FaTrash, FaEdit, FaEllipsisV, FaLink } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DeleteMyProduct from "./DeleteMyProduct";

const INITIAL_VISIBLE_COLUMNS = [
  "title",
  "sku",
  "gtin",
  "brandName",
  "status",
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

  const { data, isLoading, isFetching } = useGetUserProductsQuery({
    page,
    limit: rowsPerPage,
    search: debouncedSearch,
  });

  const [deleteProduct] = useDeleteUserProductMutation();

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
        <Input
          isClearable
          placeholder="Search products..."
          value={searchQuery}
          onClear={() => setSearchQuery("")}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-[44%]"
        />
        <Button
          size="sm"
          onClick={() => navigate("/member-portal/my-products/add")}
          color="primary"
        >
          Add New Product
        </Button>
      </div>
    ),
    [searchQuery]
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
