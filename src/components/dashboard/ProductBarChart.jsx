import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Skeleton } from "@nextui-org/react";

function ProductBarChartSkeleton() {
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-32 h-4" />
      </div>
      <div className="h-[400px] space-y-4">
        <div className="flex justify-between items-end h-full">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="w-[8%] h-full flex flex-col justify-end gap-2"
            >
              <Skeleton className={`w-full h-[${Math.random() * 60 + 20}%]`} />
              <Skeleton className="w-full h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductBarChart({ data, isLoading }) {
  const chartData = useMemo(() => {
    if (!data) return [];

    return Object.entries(data).map(([name, stats]) => ({
      name,
      products: stats.used, // used barcodes represent products
      color: getBarcodeTypeColor(name),
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-sm text-gray-600">
            Products: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <ProductBarChartSkeleton />;
  }

  if (!data || chartData.length === 0) {
    return (
      <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Products by Barcode Type
          </h3>
        </div>
        <div className="h-[400px] flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Products by Barcode Type
        </h3>
        <div className="text-sm font-medium text-gray-500">
          Total Products:{" "}
          {chartData.reduce((sum, item) => sum + item.products, 0)}
        </div>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6B7280" }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              tick={{ fill: "#6B7280" }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "14px",
              }}
            />
            <Bar
              dataKey="products"
              name="Number of Products"
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Helper function to get color for barcode types
function getBarcodeTypeColor(type) {
  const colorMap = {
    OTA: "#3B82F6", // blue
    SASO: "#8B5CF6", // purple
    SFDA: "#22C55E", // green
    UDI: "#F97316", // orange
    SEC: "#EC4899", // pink
    SSCC: "#06B6D4", // cyan
    GLN: "#EAB308", // yellow
    GTIN: "#10B981", // emerald
  };
  return colorMap[type] || "#6B7280"; // gray as fallback
}

export default ProductBarChart;
