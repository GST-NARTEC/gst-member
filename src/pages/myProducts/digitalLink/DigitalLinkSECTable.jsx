import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Pagination,
  Input,
  Spinner,
} from "@nextui-org/react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";

function DigitalLinkSECTable({
  data,
  isLoading,
  page,
  setPage,
  search,
  setSearch,
  onEdit,
  onDelete,
  onAdd,
}) {
  const columns = [
    { name: "MATERIAL NO", uid: "materialNo" },
    { name: "PURCHASE ORDER", uid: "purchaseOrder" },
    { name: "VENDOR", uid: "vendor" },
    { name: "SERIAL NO", uid: "serialNo" },
    { name: "DATE", uid: "date" },
    { name: "TEXT", uid: "text" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const pages = useMemo(() => {
    return data?.pagination?.totalPages || 0;
  }, [data]);

  const topContent = useMemo(() => {
    return (
        <div className="flex justify-between items-center ">
          <div>
            <h1 className="text-2xl font-bold text-primary ">
              Saudi Electricity Company
            </h1>
          </div>
          <Input
            isClearable
            className="w-full sm:max-w-xs"
            placeholder="Search SEC records..."
            startContent={<FaSearch className="text-default-300" />}
            value={search}
            onClear={() => setSearch("")}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="">
            <Button
              color="primary"
              className="px-8"
              startContent={<span>+</span>}
              onClick={onAdd}
            >
              Add Digital Link
            </Button>
          </div>
        </div>
    );
  }, [search, setSearch, onAdd]);

  return (
    <Table
      topContent={topContent}
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
      aria-label="SEC digital links table"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid}>{column.name}</TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={data?.secs || []}
        isLoading={isLoading}
        loadingContent={<Spinner />}
        emptyContent={<div>No SEC records found</div>}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {columnKey === "actions" ? (
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onClick={() => onEdit(item)}
                    >
                      <FaEdit className="text-primary" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onClick={() => onDelete(item)}
                    >
                      <FaTrash className="text-danger" />
                    </Button>
                  </div>
                ) : columnKey === "date" ? (
                  new Date(item[columnKey]).toLocaleDateString()
                ) : (
                  item[columnKey]
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default DigitalLinkSECTable;