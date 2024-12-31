import React, { useEffect } from "react";
import bwipjs from "bwip-js";

function CartonLabelPrint({ selectedItems, brandName, productName }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0].replace(/-/g, "");
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  useEffect(() => {
    if (!selectedItems?.length) return;

    const uniqueItems = Array.from(
      new Set(selectedItems.map((item) => item.id))
    ).map((id) => selectedItems.find((item) => item.id === id));

    const printWindow = window.open("", "Print Window", "height=400,width=800");
    const html = `
      <html>
        <head>
          <title>Carton Label Print</title>
          <style>
            @page { 
              size: 3in 2in; 
              margin: 0; 
            }
            body { 
              font-family: Arial, sans-serif;
              font-size: 12px; 
              line-height: 1.3; 
              margin: 0;
              padding: 0;
              background: white;
            }
            .label-page { 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              height: 2in; 
              width: 3in; 
              margin: 0;
              padding: 0;
              background: white;
            }
            .label-container { 
              display: grid;
              grid-template-columns: 1.7in 1.1in;
              border: 1px solid black; 
              padding: 0.1in;
              width: 3in;
              height: 2in; 
              box-sizing: border-box; 
              background: white;
            }
            .details { 
              display: flex;
              flex-direction: column;
              gap: 0.12in;
              padding-top: 0.05in;
            }
            .header {
              margin-bottom: 0.1in;
              text-align: left;
              line-height: 1.2;
            }
            .brand-name {
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 0.02in;
            }
            .product-name {
              font-size: 12px;
            }
            .details-row {
              display: grid;
              grid-template-columns: 0.8in 1fr;
              align-items: baseline;
            }
            .label {
              font-weight: bold;
              font-size: 12px;
            }
            .value {
              font-family: monospace;
              font-size: 12px;
            }
            .serial-value {
              font-family: monospace;
              letter-spacing: 0.5px;
            }
            .datamatrix-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding-top: 0.05in;
            }
            .datamatrix-code {
              width: 1in;
              height: 1in;
              margin-bottom: 0.05in;
            }
            .datamatrix-code canvas {
              width: 100% !important;
              height: 100% !important;
            }
            .hri-text {
              font-family: monospace;
              font-size: 6px;
              text-align: left;
              width: 100%;
              word-break: break-all;
              line-height: 1.1;
              max-width: 0.85in;
            }
          </style>
        </head>
        <body>
          <div id="printContent"></div>
        </body>
      </html>`;

    printWindow.document.write(html);
    printWindow.document.close();

    const generateDataMatrix = async () => {
      const contentContainer =
        printWindow.document.getElementById("printContent");

      for (const item of uniqueItems) {
        const pageDiv = document.createElement("div");
        pageDiv.className = "label-page";

        const containerDiv = document.createElement("div");
        containerDiv.className = "label-container";

        const detailsDiv = document.createElement("div");
        detailsDiv.className = "details";

        const expiryDate = formatDisplayDate(item?.expiryDate);
        const serialNo = item?.serialNo || "";

        detailsDiv.innerHTML = `
          <div class="header">
            <div class="brand-name">${item?.brandName || brandName || ""}</div>
            <div class="product-name">${
              item?.productName || productName || ""
            }</div>
          </div>
          <div class="details-row">
            <span class="label">GTIN</span>
            <span class="value">${item?.gtin || ""}</span>
          </div>
          <div class="details-row">
            <span class="label">Batch No</span>
            <span class="value">${item?.batchNo || ""}</span>
          </div>
          <div class="details-row">
            <span class="label">Exp. Date</span>
            <span class="value">${expiryDate}</span>
          </div>
          <div class="details-row">
            <span class="label">Serial No</span>
            <span class="value serial-value">${serialNo}</span>
          </div>
        `;

        const dataMatrixContainer = document.createElement("div");
        dataMatrixContainer.className = "datamatrix-container";

        const dataMatrixDiv = document.createElement("div");
        dataMatrixDiv.className = "datamatrix-code";
        const canvas = document.createElement("canvas");

        try {
          // Following GS1 DataMatrix structure
          // (01) - GTIN
          // (7) - Date
          // (21) - Serial Number
          const dataMatrixText = `(01)${item?.gtin || ""}(7)${formatDate(
            item?.expiryDate
          ).substring(2)}(21)${item?.serialNo || ""}`;

          await bwipjs.toCanvas(canvas, {
            bcid: "datamatrix",
            text: dataMatrixText,
            scale: 3,
            includetext: false,
            textxalign: "center",
          });

          dataMatrixDiv.appendChild(canvas);

          const hriText = document.createElement("div");
          hriText.className = "hri-text";
          hriText.textContent = dataMatrixText;
          dataMatrixContainer.appendChild(dataMatrixDiv);
          dataMatrixContainer.appendChild(hriText);
        } catch (err) {
          console.error("Error generating DataMatrix:", err);
          const errorText = document.createElement("div");
          errorText.textContent = "Error generating barcode";
          dataMatrixContainer.appendChild(errorText);
        }

        containerDiv.appendChild(detailsDiv);
        containerDiv.appendChild(dataMatrixContainer);
        pageDiv.appendChild(containerDiv);
        contentContainer.appendChild(pageDiv);
      }

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };

    generateDataMatrix();
  }, [selectedItems]);

  return null;
}

export default CartonLabelPrint;
