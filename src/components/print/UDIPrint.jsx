import React from "react";
import UnitLabelPrint from "./UDIPrint/UnitLabelPrint";
import CartonLabelPrint from "./UDIPrint/CartonLabelPrint";
import BigBoxLabelPrint from "./UDIPrint/BigBoxLabelPrint";

function UDIPrint({ selectedItems, labelType, brandName, productName }) {
  const uniqueItems = Array.from(
    new Set(selectedItems.map((item) => item.id))
  ).map((id) => selectedItems.find((item) => item.id === id));

  // Render the appropriate label component based on labelType
  switch (labelType) {
    case "unit":
      return (
        <UnitLabelPrint
          selectedItems={uniqueItems}
          brandName={brandName}
          productName={productName}
        />
      );
    case "carton":
      return (
        <CartonLabelPrint
          selectedItems={uniqueItems}
          brandName={brandName}
          productName={productName}
        />
      );
    case "bigbox":
      return (
        <BigBoxLabelPrint
          selectedItems={uniqueItems}
          brandName={brandName}
          productName={productName}
        />
      );
    default:
      return (
        <UnitLabelPrint
          selectedItems={uniqueItems}
          brandName={brandName}
          productName={productName}
        />
      );
  }
}

export default UDIPrint;
