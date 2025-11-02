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
} from "@heroui/react";
import { FaSearch, FaEdit, FaTrash, FaPrint } from "react-icons/fa";
import EditSECDigitalLink from "./EditSECDigitalLink";
import DeleteSECDigitalLink from "./DeleteSECDigitalLink";
import PrintDataMatrix from "../../../components/print/PrintDataMatrix";

function DigitalLinkSECTable({
  data,
  isLoading,
  page,
  setPage,
  search,
  setSearch,
  onAdd,
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [showPrint, setShowPrint] = useState(false);

  useEffect(() => {
    if (selectedKeys === "all") {
      console.log("All selected rows:", data?.secs);
    } else {
      const selectedRows = data?.secs?.filter((item) =>
        selectedKeys.has(item.id.toString())
      );
      console.log("Selected rows:", selectedRows);
    }
  }, [selectedKeys]);

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
  };

  const handlePrint = () => {
    if (!selectedKeys || (selectedKeys !== "all" && selectedKeys.size === 0)) {
      return; // Don't proceed if nothing is selected
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

  const getSelectedItems = () => {
    if (!data?.secs) return [];
    
    if (selectedKeys === "all") {
      return [...data.secs];
    }
    
    // Convert selectedKeys Set to Array and ensure unique selections
    const selectedKeysArray = Array.from(new Set(selectedKeys));
    return selectedKeysArray
      .map(key => data.secs.find(item => item.id.toString() === key))
      .filter(Boolean); // Remove any undefined items
  };

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
        <div className="flex gap-3 items-center">
          <Input
            isClearable
            className="w-full sm:max-w-xs"
            placeholder="Search SEC records..."
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
            startContent={<span>+</span>}
            onClick={onAdd}
          >
            Add Digital Link
          </Button>
        </div>
      </div>
    );
  }, [search, setSearch, onAdd, selectedKeys]);

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
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
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

      {showPrint && <PrintDataMatrix selectedItems={getSelectedItems()} />}

      <EditSECDigitalLink
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        selectedItem={selectedItem}
      />

      <DeleteSECDigitalLink
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        selectedItem={selectedItem}
      />
    </>
  );
}

export default DigitalLinkSECTable;
