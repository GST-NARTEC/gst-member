import React, { useMemo, useState } from "react";
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
  useDisclosure,
  Pagination,
} from "@heroui/react";
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaEllipsisV,
  FaFileAlt,
  FaTrash,
} from "react-icons/fa";
import { useGetBrandsQuery } from "../../store/apis/endpoints/brands";
import AddBrand from "./AddBrand";
import EditBrand from "./EditBrand";
import DeleteBrand from "./DeleteBrand";

function MyBrands() {
  const addModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [page, setPage] = useState(1);

  // API Hooks
  const { data: brandsResponse, isLoading } = useGetBrandsQuery(page);

  const brands = brandsResponse?.data?.brands || [];
  const pagination = brandsResponse?.data?.pagination || {
    total: 0,
    page: 1,
    totalPages: 0,
    hasMore: false,
  };

  const filteredBrands = useMemo(() => {
    return brands.filter(
      (brand) =>
        brand.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.nameAr.includes(searchTerm)
    );
  }, [brands, searchTerm]);

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    editModal.onOpen();
  };

  const handleDelete = (brand) => {
    setSelectedBrand(brand);
    deleteModal.onOpen();
  };

  const columns = [
    { name: "NAME (EN)", uid: "nameEn" },
    { name: "NAME (AR)", uid: "nameAr" },
    { name: "DOCUMENT", uid: "document" },
    { name: "CREATED AT", uid: "createdAt" },
    { name: "UPDATED AT", uid: "updatedAt" },
    { name: "ACTIONS", uid: "actions" },
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
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <FaEllipsisV className="text-default-400" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              {/* <DropdownItem startContent={<FaEye />}>View</DropdownItem> */}
              <DropdownItem
                startContent={<FaEdit />}
                onPress={() => handleEdit(item)}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                startContent={<FaTrash />}
                className="text-danger"
                onPress={() => handleDelete(item)}
              >
                Delete
              </DropdownItem>
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
          <h1 className="text-2xl font-bold">Brands List</h1>
          <Button color="primary" onPress={addModal.onOpen}>
            Add Brand
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search brands..."
            startContent={<FaSearch className="text-default-300" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    ),
    [searchTerm]
  );

  const bottomContent = useMemo(() => {
    return (
      <div className="flex justify-center">
        <Pagination
          total={pagination.totalPages}
          page={page}
          onChange={setPage}
        />
      </div>
    );
  }, [pagination.totalPages, page]);

  return (
    <MainLayout>
      <div className="mx-auto p-8">
        <Table
          aria-label="Brands table"
          topContent={topContent}
          bottomContent={bottomContent}
          classNames={{
            wrapper: "shadow-md rounded-lg mx-auto",
          }}
          loadingState={isLoading ? "loading" : "idle"}
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
            items={filteredBrands}
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

        <AddBrand isOpen={addModal.isOpen} onClose={addModal.onClose} />

        <EditBrand
          isOpen={editModal.isOpen}
          onClose={editModal.onClose}
          brand={selectedBrand}
        />

        <DeleteBrand
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
          brand={selectedBrand}
        />
      </div>
    </MainLayout>
  );
}

export default MyBrands;
