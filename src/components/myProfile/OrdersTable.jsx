import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  Spinner,
  Chip,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import {
  FaSearch,
  FaEye,
  FaFileInvoice,
  FaEllipsisV,
  FaCheckCircle,
} from "react-icons/fa";
import { BsReceiptCutoff } from "react-icons/bs";
import { useGetUserByIdQuery } from "../../store/apis/endpoints/user";
import OrderDetailsModal from "./OrderDetailsModal";
import { useSelector } from "react-redux";
import { selectCurrencySymbol } from "../../store/slices/currencySymbolSlice";
import BankSlipModal from "./BankSlipModal";
import { FaSync } from "react-icons/fa";

function OrdersTable() {
  const { user: memberUser } = useSelector((state) => state.member);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBankSlipModalOpen, setIsBankSlipModalOpen] = useState(false);
  const currencySymbol = useSelector(selectCurrencySymbol);

  const {
    data: ordersData,
    isLoading,
    refetch,
    isFetching,
  } = useGetUserByIdQuery(
    {
      id: memberUser?.id,
      params: { fields: "invoices" },
    },
    {
      skip: !memberUser?.id,
    }
  );

  const orders =
    ordersData?.data?.user?.invoices?.map((invoice) => ({
      ...invoice.order,
      invoiceNumber: invoice.invoiceNumber,
      invoicePdf: invoice.pdf,
      orderItems: invoice.order.orderItems || [],
    })) || [];

  const columns = [
    { name: "ORDER ID", uid: "id" },
    { name: "ITEMS", uid: "totalItems" },
    { name: "AMOUNT", uid: "totalAmount" },
    { name: "VAT", uid: "vat" },
    { name: "TOTAL", uid: "overallAmount" },
    { name: "PAYMENT", uid: "paymentType" },
    { name: "STATUS", uid: "status" },
    { name: "DATE", uid: "createdAt" },
    { name: "INVOICE", uid: "invoice" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (order, columnKey) => {
    switch (columnKey) {
      case "id":
        return (
          <Tooltip content={order.orderNumber}>
            <p className="text-sm cursor-pointer">{order.orderNumber}</p>
          </Tooltip>
        );
      case "totalAmount":
      case "vat":
      case "overallAmount":
        return (
          <p className="text-sm">
            {currencySymbol} {order[columnKey].toFixed(2)}
          </p>
        );
      case "status":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={order.status === "Activated" ? "success" : "warning"}
          >
            {order.status}
          </Chip>
        );
      case "createdAt":
        return (
          <p className="text-sm">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        );
      case "invoice":
        return (
          <div className="relative flex items-center justify-center">
            <Tooltip content="View Invoice">
              <a
                href={order.invoicePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-navy-700 cursor-pointer active:opacity-50"
              >
                <FaFileInvoice />
              </a>
            </Tooltip>
          </div>
        );
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                className="text-lg cursor-pointer text-default-400 hover:text-default-500"
              >
                <FaEllipsisV />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Order Actions"
              className="text-default-500"
              disabledKeys={order.status === "Activated" ? ["activate"] : []}
            >
              <DropdownItem
                key="details"
                startContent={<FaEye className="text-primary" />}
                onClick={() => {
                  setSelectedOrder(order);
                  setIsModalOpen(true);
                }}
              >
                View Order Details
              </DropdownItem>
              <DropdownItem
                key="bankSlip"
                startContent={<BsReceiptCutoff className="text-warning" />}
                onClick={() => {
                  setSelectedOrder(order);
                  setIsBankSlipModalOpen(true);
                }}
              >
                View Payment Slip
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      case "totalItems":
        return <p className="text-sm">{order.orderItems?.length || 0}</p>;
      default:
        return <p className="text-sm">{order[columnKey]}</p>;
    }
  };

  const topContent = useMemo(
    () => (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Orders</h1>
          <Button
            startContent={<FaSync className={`text-default-300`} />}
            onClick={refetch}
            color="primary"
          >
            Refresh
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <Input
            isClearable
            value={search}
            onValueChange={setSearch}
            className="w-full sm:max-w-[44%]"
            placeholder="Search by order ID..."
            startContent={<FaSearch className="text-default-300" />}
          />
        </div>
      </div>
    ),
    [search]
  );

  //   const bottomContent = useMemo(
  //     () => (
  //       <div className="py-2 px-2 flex justify-between items-center">
  //         <span className="w-[30%] text-sm text-gray-500">
  //           {orders.length} orders in total
  //         </span>
  //         <Pagination
  //           isCompact
  //           showControls
  //           showShadow
  //           color="primary"
  //           page={page}
  //           total={10}
  //           onChange={setPage}
  //         />
  //       </div>
  //     ),
  //     [page]
  //   );

  return (
    <>
      <Table
        aria-label="Orders table"
        // bottomContent={bottomContent}
        topContent={topContent}
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
          items={orders}
          isLoading={isLoading || isFetching}
          emptyContent="No orders found"
          loadingContent={<Spinner />}
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

      <OrderDetailsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        order={selectedOrder}
      />

      <BankSlipModal
        isOpen={isBankSlipModalOpen}
        onOpenChange={setIsBankSlipModalOpen}
        order={selectedOrder}
      />
    </>
  );
}

export default OrdersTable;
