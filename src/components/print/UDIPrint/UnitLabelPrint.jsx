import React, { useEffect } from "react";
import bwipjs from "bwip-js";

function UnitLabelPrint({ selectedItems }) {
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
          <title>Unit Label Print</title>
          <style>
            @page { 
              size: 4.5in 2in; 
              margin: 0; 
            }
            body { 
              font-family: Arial, sans-serif;
              font-size: 12px; 
              line-height: 1.4; 
              margin: 0;
              padding: 0;
              background: white;
            }
            .barcode-page { 
              page-break-after: always; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              height: 2in; 
              width: 4.5in; 
              margin: 0;
              padding: 0;
              background: white;
            }
            .barcode-page:last-child {
              page-break-after: avoid;
            }
            .barcode-container { 
              display: flex; 
              align-items: center; 
              justify-content: space-between; 
              border: 1px solid black; 
              padding: 10px; 
              width: 95%; 
              height: 95%; 
              box-sizing: border-box; 
              background: white;
            }
            .datamatrix-code { 
              margin-left: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 120px;
            }
            .datamatrix-code canvas {
              width: 90px !important;
              height: 90px !important;
              margin-bottom: 5px;
            }
            .details { 
              text-align: left;
              flex: 1;
              padding-right: 20px;
            }
            .details div { 
              margin-bottom: 8px; 
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .details strong { 
              display: inline-block; 
              width: 100px; 
              font-weight: 600;
            }
            .serial-value {
              font-family: monospace;
              letter-spacing: 0.5px;
            }
            .hri-text {
              font-family: monospace;
              font-size: 8px;
              text-align: center;
              width: 100%;
              word-break: break-all;
              margin-top: 2px;
              line-height: 1.2;
              max-width: 90px;
            }
          </style>
        </head>
        <body>
          <div id="printBarcode"></div>
        </body>
      </html>`;

    printWindow.document.write(html);
    printWindow.document.close();

    const generateDataMatrix = async () => {
      const barcodeContainer =
        printWindow.document.getElementById("printBarcode");

      for (const item of uniqueItems) {
        const pageDiv = document.createElement("div");
        pageDiv.className = "barcode-page";

        const containerDiv = document.createElement("div");
        containerDiv.className = "barcode-container";

        const detailsDiv = document.createElement("div");
        detailsDiv.className = "details";

        const expiryDate = formatDisplayDate(item?.expiryDate);
        const serialNo = item?.serialNo || "";

        detailsDiv.innerHTML = `
          <div><strong>GTIN</strong> ${item?.gtin || ""}</div>
          <div><strong>Batch No</strong> ${item?.batchNo || ""}</div>
          <div><strong>Serial No</strong> <span class="serial-value">${serialNo}</span></div>
          <div><strong>Exp. Date</strong> ${expiryDate}</div>
        `;

        const dataMatrixDiv = document.createElement("div");
        dataMatrixDiv.className = "datamatrix-code";
        const canvas = document.createElement("canvas");

        try {
          // Following GS1 DataMatrix structure
          // (01) - GTIN
          // (10) - Batch/Lot Number
          // (21) - Serial Number
          // (17) - Expiration Date
          const dataMatrixText = `(01)${item?.gtin || ""}(10)${
            item?.batchNo || ""
          }(21)${serialNo}(17)${formatDate(item?.expiryDate)}`;

          await bwipjs.toCanvas(canvas, {
            bcid: "datamatrix",
            text: dataMatrixText,
            scale: 2.2,
            includetext: false,
            textxalign: "center",
          });

          const hriText = document.createElement("div");
          hriText.className = "hri-text";
          hriText.textContent = dataMatrixText;
          dataMatrixDiv.appendChild(canvas);
          dataMatrixDiv.appendChild(hriText);
        } catch (err) {
          console.error("Error generating DataMatrix:", err);
          const errorText = document.createElement("div");
          errorText.textContent = "Error generating barcode";
          dataMatrixDiv.appendChild(errorText);
        }

        containerDiv.appendChild(detailsDiv);
        containerDiv.appendChild(dataMatrixDiv);
        pageDiv.appendChild(containerDiv);
        barcodeContainer.appendChild(pageDiv);
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

export default UnitLabelPrint;
