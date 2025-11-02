import React, { useMemo, useState } from "react";
import MainLayout from "../../layout/PortalLayouts/MainLayout";
import {
  FaBoxes,
  FaBarcode,
  FaTags,
  FaBuilding,
  FaInfoCircle,
  FaSync,
} from "react-icons/fa";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Chip,
  Button,
  Tooltip,
} from "@heroui/react";
import ProductBarChart from "../../components/dashboard/ProductBarChart";
import BarcodePieChart from "../../components/dashboard/BarcodePieChart";
import { useGetDashboardStatsQuery } from "../../store/apis/endpoints/dashboardStats";
import DashboardLoader from "../../components/Loader/DashboardLoader";
import OverlayLoader from "../../components/common/OverlayLoader";

function StatCard({
  title,
  value,
  metrics = null,
  breakdown = null,
  barcodeTypes = null,
  icon: Icon,
  bgColor,
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-4 w-full">
          <div className="flex justify-between items-center">
            <span className={`${bgColor} bg-opacity-10 p-2 rounded-lg`}>
              <Icon className={`text-xl ${bgColor.replace("bg-", "text-")}`} />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">{title}</span>
              {barcodeTypes && (
                <Popover placement="bottom" showArrow={true}>
                  <PopoverTrigger>
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaInfoCircle size={16} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-3 py-2 w-64">
                      <div className="text-small font-bold mb-2">
                        Barcode Types Used
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {barcodeTypes.map((type, index) => (
                          <Chip
                            key={index}
                            size="sm"
                            variant="flat"
                            className={type.color}
                          >
                            {type.label}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
              <span className="text-sm text-gray-500">Total</span>
            </div>

            {metrics && (
              <div className="space-y-2">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${bgColor}`}
                    style={{
                      width: `${(metrics.secondary / value) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    <span className="font-medium">{metrics.primary.value}</span>{" "}
                    {metrics.primary.label}
                  </span>
                  <span className="text-gray-600">
                    <span className="font-medium">{metrics.secondary}</span>{" "}
                    {metrics.secondary_label}
                  </span>
                </div>
              </div>
            )}

            {breakdown && (
              <div className="pt-2 space-y-1">
                {Object.entries(breakdown).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-medium text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const {
    data: apiData,
    isLoading,
    refetch,
    isFetching,
  } = useGetDashboardStatsQuery();

  const [overlayLoader, setOverlayLoader] = useState(true);

  const dashboardStats = useMemo(() => {
    if (!apiData?.data) return null;

    const { orders, brands, products, barcodeTypes } = apiData.data;

    // Calculate total barcodes and availability
    const barcodeTotals = Object.values(barcodeTypes).reduce(
      (acc, type) => {
        acc.total += type.total;
        acc.available += type.sold; // sold means available for use
        acc.consumed += type.used;
        return acc;
      },
      { total: 0, available: 0, consumed: 0 }
    );

    // Create barcode type chips for products card
    const barcodeTypeChips = Object.keys(barcodeTypes).map((type) => ({
      label: type,
      color: getBarcodeTypeColor(type),
    }));

    return {
      orders: {
        total: orders.total,
        activated: orders.activated,
        pending: orders.pending,
      },
      barcodes: barcodeTotals,
      products: {
        total: products.total,
        types: products.byType,
        barcodeTypes: barcodeTypeChips,
      },
      totalBrands: brands.total,
    };
  }, [apiData]);

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading || !dashboardStats || isFetching) {
    return (
      <MainLayout>
        <DashboardLoader />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <Tooltip content="Refresh Dashboard">
            <Button
              isIconOnly
              variant="light"
              isLoading={isFetching}
              onClick={handleRefresh}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <FaSync
                className={`text-xl ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Orders Card */}
          <StatCard
            title="Orders"
            value={dashboardStats.orders.total}
            metrics={{
              primary: {
                value: dashboardStats.orders.activated,
                label: "Activated",
              },
              secondary: dashboardStats.orders.pending,
              secondary_label: "Pending",
            }}
            icon={FaBoxes}
            bgColor="bg-blue-500"
          />

          {/* Barcodes Card */}
          <StatCard
            title="Barcodes"
            value={dashboardStats.barcodes.total}
            metrics={{
              primary: {
                value: dashboardStats.barcodes.available,
                label: "Available",
              },
              secondary: dashboardStats.barcodes.consumed,
              secondary_label: "Consumed",
            }}
            icon={FaBarcode}
            bgColor="bg-green-500"
          />

          {/* Products Card */}
          <StatCard
            title="Products"
            value={dashboardStats.products.total}
            breakdown={dashboardStats.products.types}
            barcodeTypes={dashboardStats.products.barcodeTypes}
            icon={FaTags}
            bgColor="bg-purple-500"
          />

          {/* Brands Card */}
          <StatCard
            title="Brands"
            value={dashboardStats.totalBrands}
            icon={FaBuilding}
            bgColor="bg-orange-500"
          />
        </div>

        <div className="my-16 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[70%]">
            <ProductBarChart
              data={apiData?.data?.barcodeTypes}
              isLoading={isLoading}
            />
          </div>
          <div className="w-full lg:w-[30%]">
            <BarcodePieChart
              data={apiData?.data?.barcodeTypes}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Helper function to get color for barcode types
function getBarcodeTypeColor(type) {
  const colorMap = {
    OTA: "bg-blue-100 text-blue-800",
    SASO: "bg-purple-100 text-purple-800",
    SFDA: "bg-green-100 text-green-800",
    UDI: "bg-orange-100 text-orange-800",
    SEC: "bg-pink-100 text-pink-800",
    SSCC: "bg-cyan-100 text-cyan-800",
    GLN: "bg-yellow-100 text-yellow-800",
    GTIN: "bg-emerald-100 text-emerald-800",
  };
  return colorMap[type] || "bg-gray-100 text-gray-800";
}

export default Dashboard;
