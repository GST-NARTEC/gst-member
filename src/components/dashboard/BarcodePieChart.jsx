import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function BarcodePieChart() {
  const data = [
    { name: "Available Barcodes", value: 750, color: "#4CAF50" },
    { name: "Consumed Barcodes", value: 250, color: "#FF5722" },
  ];

  return (
    <div className="w-full h-[500px] bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Barcode Usage Statistics
      </h2>
      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Stats Display */}
      <div className="flex flex-col gap-2 mt-4">
        {data.map((entry, index) => (
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
