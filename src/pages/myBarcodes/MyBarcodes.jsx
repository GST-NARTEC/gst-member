import React, { useMemo } from "react";
import MainLayout from "../../layout/PortalLayouts/MainLayout";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Tooltip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  Pagination,
  Chip,
  Spinner,
} from "@nextui-org/react";
import { FaSearch, FaEye, FaEdit, FaEllipsisV, FaQrcode, FaFileAlt } from "react-icons/fa";
import { useMemberGtinsQuery } from "../../store/apis/endpoints/member";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import QRCode from "react-qr-code";

function MyBarcodes() {
  const { user } = useSelector((state) => state.member);
  const { data, isLoading } = useMemberGtinsQuery(user.id);
  const [page, setPage] = React.useState(1);

  const columns = [
    { name: "GTIN", uid: "gtin" },
    { name: "ORDER NUMBER", uid: "orderNumber" },
    { name: "Order Date", uid: "orderDate" },
    { name: "Activated At", uid: "assignedAt" },
    { name: "QR CODE", uid: "qrCode" },
    { name: "CERTIFICATE", uid: "certificate" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
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
      case "orderDate":
      case "assignedAt":
        return format(new Date(item[columnKey]), "PPp");
      case "qrCode":
        return (
          <div className="">
            <QRCode value={item.gtin} size={30} />
          </div>
        );
      case "certificate":
        return (
          <Button
            isIconOnly
            variant="light"
            onClick={() => window.open(item.barcodeCertificate, '_blank')}
          >
            <FaFileAlt className="text-default-400 text-lg" />
          </Button>
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
              <DropdownItem startContent={<FaEye />}>View</DropdownItem>
              <DropdownItem startContent={<FaEdit />}>Edit</DropdownItem>
              <DropdownItem startContent={<FaQrcode />}>
                Digital Links
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return item[columnKey];
    }
  };

  const topContent = useMemo(
    () => (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">My Barcodes</h1>
        <div className="flex justify-between items-center">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by barcode..."
            startContent={<FaSearch className="text-default-300" />}
          />
        </div>
      </div>
    ),
    []
  );

  const bottomContent = useMemo(() => {
    if (!data?.data?.pagination) return null;

    return (
      <div className="flex justify-between items-center px-2 py-2">
        <span className="text-small text-default-400">
          Total {data.data.pagination.total} GTINs
        </span>
        <Pagination
          showControls
          color="primary"
          page={page}
          total={data.data.pagination.totalPages}
          onChange={setPage}
        />
      </div>
    );
  }, [data?.data?.pagination, page]);

  return (
    <MainLayout>
      <div className="mx-auto p-8">
        <Table
          aria-label="GTINs table"
          topContent={topContent}
          bottomContent={bottomContent}
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
            items={data?.data?.gtins || []}
            isLoading={isLoading}
            loadingContent={<Spinner />}
            emptyContent={<p>No GTINs found</p>}
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
      </div>
    </MainLayout>
  );
}

export default MyBarcodes;
