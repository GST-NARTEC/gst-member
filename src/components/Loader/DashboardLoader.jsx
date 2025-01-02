import React from "react";
import { Button, Skeleton } from "@nextui-org/react";
import { FaSync } from "react-icons/fa";

// StatCard loading skeleton
function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-4 w-full">
          <div className="flex justify-between items-center">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-24 h-4" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-12 h-4" />
            </div>

            <div className="space-y-2">
              <Skeleton className="w-full h-1.5 rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-24 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Chart loading skeleton
function ChartSkeleton({ height = "400px" }) {
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-24 h-4" />
      </div>
      <div className={`h-[${height}] flex flex-col gap-4`}>
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
    </div>
  );
}

function DashboardLoader() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <Button
          isIconOnly
          variant="light"
          isLoading={true}
          className="text-gray-500"
        >
          <FaSync className="text-xl" />
        </Button>
      </div>

      {/* Stat Cards Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      {/* Charts Loading */}
      <div className="my-16 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[70%]">
          <ChartSkeleton height="400px" />
        </div>
        <div className="w-full lg:w-[30%]">
          <ChartSkeleton height="500px" />
        </div>
      </div>
    </div>
  );
}

export default DashboardLoader;
