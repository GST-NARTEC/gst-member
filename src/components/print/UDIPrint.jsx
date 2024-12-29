import React from "react";
import UnitLabelPrint from "./UDIPrint/UnitLabelPrint";
import CartonLabelPrint from "./UDIPrint/CartonLabelPrint";
import BigBoxLabelPrint from "./UDIPrint/BigBoxLabelPrint";

function UDIPrint({ selectedItems, labelType }) {
  const uniqueItems = Array.from(
    new Set(selectedItems.map((item) => item.id))
  ).map((id) => selectedItems.find((item) => item.id === id));

  // Render the appropriate label component based on labelType
  switch (labelType) {
    case "unit":
      return <UnitLabelPrint selectedItems={uniqueItems} />;
    case "carton":
      return <CartonLabelPrint selectedItems={uniqueItems} />;
    case "bigbox":
      return <BigBoxLabelPrint selectedItems={uniqueItems} />;
    default:
      return <UnitLabelPrint selectedItems={uniqueItems} />;
  }
}

export default UDIPrint;
