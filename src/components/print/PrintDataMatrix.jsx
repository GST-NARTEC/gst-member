import React, { useEffect } from "react";
import bwipjs from "bwip-js";

function PrintDataMatrix({ selectedItems }) {
  useEffect(() => {
    if (!selectedItems?.length) return;

    const uniqueItems = Array.from(
      new Set(selectedItems.map((item) => item.id))
    ).map((id) => selectedItems.find((item) => item.id === id));

    const printWindow = window.open("", "Print Window", "height=400,width=800");
    const html = `
      <html>
        <head>
          <title>Saudi Electricity Company</title>
          <style>
            @page { 
              size: 4.5in 2in; 
              margin: 0; 
            }
            body { 
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
              align-items: center;
              justify-content: center;
            }
            .datamatrix-code canvas {
              width: 90px;
              height: 90px;
            }
            .details { 
              text-align: left;
              flex: 1;
            }
            .details div { 
              margin-bottom: 5px; 
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .details strong { 
              display: inline-block; 
              width: 100px; 
              font-weight: 600;
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
        detailsDiv.innerHTML = `
          <div><strong>Material #</strong> ${item?.materialNo || ""}</div>
          <div><strong>Vendor</strong> ${item?.vendor || ""}</div>
          <div><strong>PO #</strong> ${item?.purchaseOrder || ""}</div>
          <div><strong>Expiry Date</strong> ${
            item?.date ? new Date(item.date).toLocaleDateString() : ""
          }</div>
          <div><strong>Serial #</strong> ${item?.serialNo || ""}</div>
        `;

        const dataMatrixDiv = document.createElement("div");
        dataMatrixDiv.className = "datamatrix-code";
        const canvas = document.createElement("canvas");

        try {
          const dataMatrixText = `91${item?.materialNo || ""}^1400${
            item?.purchaseOrder || ""
          }^193${item?.vendor || ""}^192${
            item?.date ? new Date(item.date).toLocaleDateString() : ""
          }^121${item?.serialNo || ""}`;

          await bwipjs.toCanvas(canvas, {
            bcid: "datamatrix",
            text: dataMatrixText,
            scale: 2.2,
            includetext: false,
            textxalign: "center",
          });

          dataMatrixDiv.appendChild(canvas);
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

      // Trigger print after all barcodes are generated
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };

    generateDataMatrix();
  }, [selectedItems]);

  return null;
}

export default PrintDataMatrix;
