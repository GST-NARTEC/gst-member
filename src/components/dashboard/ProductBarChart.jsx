import React from "react";
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

function ProductBarChart() {
  const chartData = [
    {
      name: "5GLN",
      products: 25,
      color: "#3B82F6", // blue-500
    },
    {
      name: "3GTIN",
      products: 40,
      color: "#8B5CF6", // purple-500
    },
    {
      name: "SEC-5",
      products: 15,
      color: "#22C55E", // green-500
    },
    {
      name: "DUNS",
      products: 20,
      color: "#F97316", // orange-500
    },
    {
      name: "SSCC",
      products: 18,
      color: "#EC4899", // pink-500
    },
    {
      name: "GIAI",
      products: 30,
      color: "#06B6D4", // cyan-500
    },
  ];

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

export default ProductBarChart;
