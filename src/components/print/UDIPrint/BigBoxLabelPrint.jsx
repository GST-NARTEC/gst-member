import React, { useEffect } from "react";
import bwipjs from "bwip-js";

function BigBoxLabelPrint({ selectedItems }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0].replace(/-/g, "");
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
          <title>Big Box Label Print</title>
          <style>
            @page { 
              size: 4in 6in; 
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
            .print-page { 
              height: 6in; 
              width: 4in; 
              margin: 0;
              padding: 0.15in;
              box-sizing: border-box;
              background: white;
            }
            .content-container { 
              height: 100%;
              width: 100%;
              padding: 0.2in;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.2in;
            }
            .datamatrix-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin-bottom: 0.1in;
            }
            .datamatrix-container canvas {
              width: 2in !important;
              height: 2in !important;
            }
            .details {
              display: grid;
              grid-gap: 0.1in;
              width: 100%;
              max-width: 3in;
            }
            .details-row {
              display: grid;
              grid-template-columns: 0.8in 1fr;
              align-items: center;
            }
            .label {
              font-weight: bold;
              font-size: 12px;
            }
            .value {
              font-family: monospace;
              font-size: 12px;
            }
            .hri-text {
              font-family: monospace;
              font-size: 10px;
              text-align: left;
              margin-top: 0.1in;
              line-height: 1.2;
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
        pageDiv.className = "print-page";

        const containerDiv = document.createElement("div");
        containerDiv.className = "content-container";

        // DataMatrix section
        const dataMatrixContainer = document.createElement("div");
        dataMatrixContainer.className = "datamatrix-container";
        const canvas = document.createElement("canvas");

        try {
          // Following GS1 DataMatrix structure
          // (01) - GTIN
          // (10) - Batch/Lot Number
          // (21) - Serial Number
          // (17) - Expiration Date
          const dataMatrixText = `(01)${item?.gtin || ""}(10)${
            item?.batchNo || ""
          }(21)${item?.serialNo || ""}(17)${formatDate(item?.expiryDate)}`;

          await bwipjs.toCanvas(canvas, {
            bcid: "datamatrix",
            text: dataMatrixText,
            scale: 4,
            includetext: false,
          });

          dataMatrixContainer.appendChild(canvas);

          // HRI text section
          const hriText = document.createElement("div");
          hriText.className = "hri-text";
          hriText.innerHTML = `(01) ${item?.gtin || ""}<br>
                              (17) ${formatDate(item?.expiryDate)}<br>
                              (10) ${item?.batchNo || ""}<br>
                              (21) ${item?.serialNo || ""}`;
          dataMatrixContainer.appendChild(hriText);
        } catch (err) {
          console.error("Error generating DataMatrix:", err);
          const errorText = document.createElement("div");
          errorText.textContent = "Error generating barcode";
          dataMatrixContainer.appendChild(errorText);
        }

        // Details section
        const detailsDiv = document.createElement("div");
        detailsDiv.className = "details";

        const expiryDate = item?.expiryDate
          ? new Date(item.expiryDate).toLocaleDateString()
          : "";

        detailsDiv.innerHTML = `
          <div class="details-row">
            <span class="label">GTIN:</span>
            <span class="value">${item?.gtin || ""}</span>
          </div>
          <div class="details-row">
            <span class="label">Batch No:</span>
            <span class="value">${item?.batchNo || ""}</span>
          </div>
          <div class="details-row">
            <span class="label">Serial No:</span>
            <span class="value">${item?.serialNo || ""}</span>
          </div>
          <div class="details-row">
            <span class="label">Exp Date:</span>
            <span class="value">${expiryDate}</span>
          </div>
        `;

        containerDiv.appendChild(dataMatrixContainer);
        containerDiv.appendChild(detailsDiv);
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

export default BigBoxLabelPrint;
