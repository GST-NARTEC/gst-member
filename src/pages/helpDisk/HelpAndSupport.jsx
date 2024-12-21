import React, { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Pagination,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FaEye, FaPlus, FaSearch } from "react-icons/fa";
import { format } from "date-fns";
import MainLayout from "../../layout/PortalLayouts/MainLayout";
import CreateTicket from "./CreateTicket";
import { useGetHelpTicketsQuery } from "../../store/apis/endpoints/helpDisk";
import { Status, Priority, TicketCategory } from "../../store/apis/endpoints/helpDisk";

const statusColorMap = {
  [Status.OPEN]: "warning",
  [Status.IN_PROGRESS]: "primary",
  [Status.RESOLVED]: "success",
  [Status.CLOSED]: "danger",
};

const priorityColorMap = {
  [Priority.LOW]: "success",
  [Priority.MEDIUM]: "warning",
  [Priority.HIGH]: "danger",
};

function HelpAndSupport() {
  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    priority: "",
    category: "",
  });

  const { data, isLoading, isFetching } = useGetHelpTicketsQuery(filters);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1, // Reset page when other filters change
    }));
  };

  const columns = [
    { name: "TICKET ID", uid: "id" },
    { name: "SUBJECT", uid: "subject" },
    { name: "STATUS", uid: "status" },
    { name: "PRIORITY", uid: "priority" },
    { name: "CATEGORY", uid: "category" },
    { name: "DATE", uid: "date" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 flex-1">
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search by subject..."
              startContent={<FaSearch />}
              value={filters.search}
              onClear={() => handleFilterChange("search", "")}
              onValueChange={(value) => handleFilterChange("search", value)}
            />
            <div className="flex gap-3">
              <Select
                className="w-[150px]"
                placeholder="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <SelectItem key="" value="">All Status</SelectItem>
                {Object.entries(Status).map(([key, value]) => (
                  <SelectItem key={value} value={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </Select>
              <Select
                className="w-[150px]"
                placeholder="Priority"
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
              >
                <SelectItem key="" value="">All Priority</SelectItem>
                {Object.entries(Priority).map(([key, value]) => (
                  <SelectItem key={value} value={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </Select>
              <Select
                className="w-[150px]"
                placeholder="Category"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <SelectItem key="" value="">All Categories</SelectItem>
                {Object.entries(TicketCategory).map(([key, value]) => (
                  <SelectItem key={value} value={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <Button
            color="primary"
            className="w-fit mx-2"
            startContent={<FaPlus />}
            onClick={() => setIsCreateTicketOpen(true)}
          >
            Add Ticket
          </Button>
        </div>
      </div>
    );
  }, [filters]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex justify-between items-center">
        <span className="text-small text-default-400">
          Total {data?.pagination.total || 0} tickets
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={filters.page}
          total={data?.pagination.totalPages || 1}
          onChange={(page) => handleFilterChange("page", page)}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Select
            className="w-[30%]"
            value={filters.limit.toString()}
            onChange={(e) => handleFilterChange("limit", Number(e.target.value))}
          >
            <SelectItem key={5} value="5">5</SelectItem>
            <SelectItem key={10} value="10">10</SelectItem>
            <SelectItem key={15} value="15">15</SelectItem>
          </Select>
        </div>
      </div>
    );
  }, [data?.pagination, filters.page, filters.limit]);

  const renderCell = (ticket, columnKey) => {
    switch (columnKey) {
      case "id":
        return ticket.id.slice(0, 8);
      case "subject":
        return ticket.subject.slice(0, 30);
      case "status":
        return (
          <Chip color={statusColorMap[ticket.status]} size="sm" variant="flat">
            {ticket.status}
          </Chip>
        );
      case "priority":
        return (
          <Chip color={priorityColorMap[ticket.priority]} size="sm" variant="flat">
            {ticket.priority}
          </Chip>
        );
      case "category":
        return ticket.category;
      case "date":
        return format(new Date(ticket.createdAt), "MMM dd, yyyy");
      case "actions":
        return (
          <Tooltip content="View Details">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => handleViewDetails(ticket)}
            >
              <FaEye />
            </Button>
          </Tooltip>
        );
      default:
        return null;
    }
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-bold text-default-900 mx-2">
          Help & Support
        </h1>
        <Table
          topContent={topContent}
          bottomContent={bottomContent}
          aria-label="Help Support table"
          isHeaderSticky
     
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={isLoading || isFetching}
            loadingContent={<Spinner label="Loading..." />}
            emptyContent={!isLoading && "No tickets found"}
            items={data?.tickets || []}
          >
            {(ticket) => (
              <TableRow key={ticket.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(ticket, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Modal
          size="3xl"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold">Ticket Details</h2>
                  <p className="text-small text-default-500">
                    #{selectedTicket?.id.slice(0, 8)}
                  </p>
                </ModalHeader>
                <ModalBody>
                  {selectedTicket && (
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-2 space-y-6">
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">Subject</h3>
                          <p className="text-default-700">
                            {selectedTicket.subject}
                          </p>
                        </div>
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">Message</h3>
                          <p className="rounded-md bg-gray-100 p-4 text-default-700">
                            {selectedTicket.message}
                          </p>
                        </div>
                        {selectedTicket.response && (
                          <div>
                            <h3 className="mb-2 text-lg font-semibold">
                              Response
                            </h3>
                            <p className="rounded-md bg-green-100 p-4 text-default-700">
                              {selectedTicket.response}
                            </p>
                          </div>
                        )}
                        {selectedTicket.doc && (
                          <div>
                            <h3 className="mb-2 text-lg font-semibold">
                              Attachment
                            </h3>
                            <img
                              src={selectedTicket.doc}
                              alt="Attachment"
                              className="max-h-40 rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">Details</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-default-500">Status</span>
                              <Chip
                                color={statusColorMap[selectedTicket.status]}
                                size="sm"
                                variant="flat"
                              >
                                {selectedTicket.status}
                              </Chip>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-default-500">Priority</span>
                              <Chip
                                color={priorityColorMap[selectedTicket.priority]}
                                size="sm"
                                variant="flat"
                              >
                                {selectedTicket.priority}
                              </Chip>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-default-500">Category</span>
                              <span className="capitalize">
                                {selectedTicket.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">
                            Timestamps
                          </h3>
                          <div className="space-y-2 text-small">
                            <div className="flex justify-between">
                              <span className="text-default-500">Created</span>
                              <span>
                                {format(
                                  new Date(selectedTicket.createdAt),
                                  "PPpp",
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-default-500">Updated</span>
                              <span>
                                {format(
                                  new Date(selectedTicket.updatedAt),
                                  "PPpp",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <CreateTicket
          isOpen={isCreateTicketOpen}
          onClose={() => setIsCreateTicketOpen(false)}
        />
      </div>
    </MainLayout>
  );
}

export default HelpAndSupport;