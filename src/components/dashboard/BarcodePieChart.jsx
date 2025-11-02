import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Skeleton } from "@heroui/react";

function BarcodePieChartSkeleton() {
  return (
    <div className="w-full h-[500px] bg-white rounded-lg shadow-sm p-4">
      <Skeleton className="w-48 h-6 mb-8" />
      <div className="relative w-full h-[60%] flex items-center justify-center">
        {/* Circular skeleton */}
        <div className="absolute w-56 h-56 rounded-full">
          <Skeleton className="w-full h-full rounded-full" />
        </div>
        {/* Inner circle to create donut effect */}
        <div className="absolute w-32 h-32 bg-white rounded-full" />
      </div>
      {/* Stats skeleton */}
      <div className="flex flex-col gap-4 mt-8">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="w-32 h-4" />
            </div>
            <Skeleton className="w-16 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BarcodePieChart({ data, isLoading }) {
  const chartData = useMemo(() => {
    if (!data) return [];

    const totalAvailable = Object.values(data).reduce(
      (sum, type) => sum + type.sold,
      0
    );
    const totalConsumed = Object.values(data).reduce(
      (sum, type) => sum + type.used,
      0
    );

    return [
      { name: "Available Barcodes", value: totalAvailable, color: "#4CAF50" },
      { name: "Consumed Barcodes", value: totalConsumed, color: "#FF5722" },
    ];
  }, [data]);

  if (isLoading) {
    return <BarcodePieChartSkeleton />;
  }

  if (!data || chartData.length === 0) {
    return (
      <div className="w-full h-[500px] bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Barcode Usage Statistics
        </h2>
        <div className="h-full flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Barcode Usage Statistics
      </h2>
      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={0}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Stats Display */}
      <div className="flex flex-col gap-2 mt-4">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}</span>
            </div>
            <span className="font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BarcodePieChart;
