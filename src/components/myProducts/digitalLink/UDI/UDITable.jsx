import React, { useMemo, useState } from "react";
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
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FaSearch, FaEdit, FaTrash, FaPrint } from "react-icons/fa";
import { useGetUdisQuery } from "../../../../store/apis/endpoints/udi";
import DeleteUDI from "./DeleteUDI";
import AddUDI from "./AddUDI";
import { useDebounce } from "../../../../hooks/useDebounce";
import UDIPrint from "../../../print/UDIPrint";

function UDITable({ gtin, brandName, productName }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [showPrint, setShowPrint] = useState(false);
  const [currentLabelType, setCurrentLabelType] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedLabelType, setSelectedLabelType] = useState(new Set([]));

  const debouncedSearch = useDebounce(search, 500);

  const { data: apiResponse, isLoading } = useGetUdisQuery({
    page,
    limit: 10,
    search: debouncedSearch,
    gtin,
  });

  const udis = apiResponse?.data?.udis || [];
  const pagination = apiResponse?.data?.pagination;

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setSelectedItem(null);
    setIsDeleteModalOpen(false);
    setIsAddModalOpen(false);
    setIsPrintModalOpen(false);
    setSelectedLabelType(new Set([]));
  };

  const getSelectedItems = () => {
    if (!udis) return [];

    if (selectedKeys === "all") {
      return [...udis];
    }

    const selectedKeysArray = Array.from(new Set(selectedKeys));
    return selectedKeysArray
      .map((key) => udis.find((item) => item.id.toString() === key))
      .filter(Boolean);
  };

  const handlePrint = () => {
    const labelType = Array.from(selectedLabelType)[0];
    if (!labelType) return;

    setCurrentLabelType(labelType);
    setShowPrint(false);
    setTimeout(() => {
      setShowPrint(true);
      setTimeout(() => {
        setShowPrint(false);
        handleCloseModals();
      }, 1000);
    }, 100);
  };

  const columns = [
    { name: "SERIAL NO", uid: "serialNo" },
    { name: "GTIN", uid: "gtin" },
    { name: "BATCH NO", uid: "batchNo" },
    { name: "EXP DATE", uid: "expiryDate" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const pages = useMemo(() => {
    return pagination?.pages || 0;
  }, [pagination]);

  const hasSelectedItems = selectedKeys === "all" || selectedKeys.size > 0;

  const topContent = useMemo(() => {
    return (
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">UDI Records</h1>
        </div>
        <div className="flex gap-3 items-center">
          <Input
            isClearable
            className="w-full sm:max-w-xs"
            placeholder="Search UDIs..."
            startContent={<FaSearch className="text-default-300" />}
            value={search}
            onClear={() => setSearch("")}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Tooltip
            content={
              hasSelectedItems
                ? "Print Labels"
                : "Select UDIs to enable printing"
            }
          >
            <Button
              color="primary"
              startContent={<FaPrint className="text-white text-2xl" />}
              isDisabled={!hasSelectedItems}
              onClick={() => setIsPrintModalOpen(true)}
            >
              Print
            </Button>
          </Tooltip>
          <Button
            color="primary"
            className="px-8"
            startContent={<span>+</span>}
            onClick={() => setIsAddModalOpen(true)}
          >
            Generate UDI
          </Button>
        </div>
      </div>
    );
  }, [search, selectedKeys, hasSelectedItems]);

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
        aria-label="UDI table"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={udis}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent={<div>No UDI records found</div>}
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
                        onClick={() => handleDelete(item)}
                      >
                        <FaTrash className="text-danger" />
                      </Button>
                    </div>
                  ) : columnKey === "expiryDate" ? (
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

      {showPrint && (
        <UDIPrint
          selectedItems={getSelectedItems()}
          labelType={currentLabelType}
          brandName={brandName}
          productName={productName}
        />
      )}

      <Modal
        isOpen={isPrintModalOpen}
        onClose={handleCloseModals}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Print Labels
              </ModalHeader>
              <ModalBody>
                <Select
                  label="Select Label Type"
                  placeholder="Choose a label type"
                  selectedKeys={selectedLabelType}
                  onSelectionChange={setSelectedLabelType}
                >
                  <SelectItem key="unit" value="unit">
                    Unit Label
                  </SelectItem>
                  <SelectItem key="carton" value="carton">
                    Carton Label
                  </SelectItem>
                  <SelectItem key="bigbox" value="bigbox">
                    Big Box Label
                  </SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handlePrint}
                  isDisabled={selectedLabelType.size === 0}
                >
                  Print
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <AddUDI isOpen={isAddModalOpen} onClose={handleCloseModals} gtin={gtin} />

      <DeleteUDI
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        selectedItem={selectedItem}
      />
    </>
  );
}

export default UDITable;
