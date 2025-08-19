import React, { useMemo, useState, useEffect } from "react";
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
import { FaSearch, FaEdit, FaTrash, FaPrint } from "react-icons/fa";
import { useGetAggregationsQuery } from "../../../../store/apis/endpoints/aggregation";
import DeleteAggregation from "./DeleteAggregation";
import AddAggregation from "./AddAggregation";
import EditAggregation from "./EditAggregation";
import { useDebounce } from "../../../../hooks/useDebounce";
import AggregationPrint from "../../../print/AggregationPrint";

function AggregationTable({ gtin }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [showPrint, setShowPrint] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data: apiResponse, isLoading } = useGetAggregationsQuery({
    page,
    limit: 10,
    search: debouncedSearch,
    gtin,
  });

  const aggregations = apiResponse?.data?.aggregations || [];
  const pagination = apiResponse?.data?.pagination;

  useEffect(() => {
    if (selectedKeys === "all") {
      console.log("All selected rows:", aggregations);
    } else {
      const selectedRows = aggregations?.filter((item) =>
        selectedKeys.has(item.id.toString())
      );
      console.log("Selected rows:", selectedRows);
    }
  }, [selectedKeys, aggregations]);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setSelectedItem(null);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsAddModalOpen(false);
  };

  const getSelectedItems = () => {
    if (!aggregations) return [];

    if (selectedKeys === "all") {
      return [...aggregations];
    }

    const selectedKeysArray = Array.from(new Set(selectedKeys));
    return selectedKeysArray
      .map((key) => aggregations.find((item) => item.id.toString() === key))
      .filter(Boolean);
  };

  const columns = [
    { name: "SERIAL NO", uid: "serialNo" },
    { name: "GTIN", uid: "gtin" },
    { name: "BATCH NO", uid: "batchNo" },
    { name: "MFG DATE", uid: "manufacturingDate" },
    { name: "EXP DATE", uid: "expiryDate" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const pages = useMemo(() => {
    return pagination?.pages || 0;
  }, [pagination]);

  const handlePrint = () => {
    if (!selectedKeys || (selectedKeys !== "all" && selectedKeys.size === 0)) {
      return;
    }

    const itemsToPrint = getSelectedItems();
    if (itemsToPrint.length > 0) {
      setShowPrint(false);
      setTimeout(() => {
        setShowPrint(true);
        setTimeout(() => setShowPrint(false), 1000);
      }, 100);
    }
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Controlled Serials
          </h1>
        </div>
        <div className="flex gap-3 items-center">
          <Input
            isClearable
            className="w-full sm:max-w-xs"
            placeholder="Search aggregations..."
            startContent={<FaSearch className="text-default-300" />}
            value={search}
            onClear={() => setSearch("")}
            onChange={(e) => setSearch(e.target.value)}
          />
          {(selectedKeys === "all" || selectedKeys.size > 0) && (
            <Button
              color="primary"
              startContent={<FaPrint className="text-white" />}
              onClick={handlePrint}
            >
              Print
            </Button>
          )}
          <Button
            color="primary"
            className="px-8"
            // disable if any row selected
            isDisabled={selectedKeys === "all" || selectedKeys.size > 0}
            startContent={<span>+</span>}
            onClick={() => setIsAddModalOpen(true)}
          >
            Generate Serial
          </Button>
        </div>
      </div>
    );
  }, [search, selectedKeys]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex w-full justify-between items-center">
        <div className="flex gap-2 items-center">
          <span className="text-default-400 text-sm">
            Total {pagination?.total || 0} records
          </span>
          <span className="text-default-400 text-sm">
            • Page {page} of {pages}
          </span>
          <span className="text-default-400 text-sm">
            • Showing {(page - 1) * (pagination?.limit || 10) + 1}-
            {Math.min(page * (pagination?.limit || 10), pagination?.total || 0)}{" "}
            records
          </span>
        </div>
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
    );
  }, [page, pages, pagination]);

  return (
    <>
      <Table
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        selectionMode="multiple"
        topContent={topContent}
        bottomContent={bottomContent}
        aria-label="Aggregation table"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={aggregations}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent={<div>No aggregation records found</div>}
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
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit className="text-primary" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={() => handleDelete(item)}
                      >
                        <FaTrash className="text-danger" />
                      </Button>
                    </div>
                  ) : columnKey === "manufacturingDate" ||
                    columnKey === "expiryDate" ? (
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

      {showPrint && <AggregationPrint selectedItems={getSelectedItems()} />}

      <AddAggregation
        isOpen={isAddModalOpen}
        onClose={handleCloseModals}
        gtin={gtin}
      />

      <EditAggregation
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        selectedItem={selectedItem}
      />

      <DeleteAggregation
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        selectedItem={selectedItem}
      />
    </>
  );
}

export default AggregationTable;
