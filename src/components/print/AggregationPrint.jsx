import React, { useEffect } from "react";
import bwipjs from "bwip-js";

function AggregationPrint({ selectedItems }) {
  useEffect(() => {
    if (!selectedItems?.length) return;

    const uniqueItems = Array.from(
      new Set(selectedItems.map((item) => item.id))
    ).map((id) => selectedItems.find((item) => item.id === id));

    const printWindow = window.open("", "Print Window", "height=400,width=800");
    const html = `
      <html>
        <head>
          <title>Aggregation Print</title>
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
            .qr-code { 
              margin-left: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .qr-code canvas {
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
          <div id="printContent"></div>
        </body>
      </html>`;

    printWindow.document.write(html);
    printWindow.document.close();

    const generatePrintContent = async () => {
      const contentContainer =
        printWindow.document.getElementById("printContent");

      for (const item of uniqueItems) {
        const pageDiv = document.createElement("div");
        pageDiv.className = "barcode-page";

        const containerDiv = document.createElement("div");
        containerDiv.className = "barcode-container";

        // Details section
        const detailsDiv = document.createElement("div");
        detailsDiv.className = "details";
        detailsDiv.innerHTML = `
          <div><strong>GTIN</strong> ${item.gtin}</div>
          <div><strong>EXPIRY</strong> ${new Date(
            item.expiryDate
          ).toLocaleDateString()}</div>
          <div><strong>BATCH#</strong> ${item.batchNo}</div>
          <div><strong>MFG DATE</strong> ${new Date(
            item.manufacturingDate
          ).toLocaleDateString()}</div>
          <div><strong>SERIAL#</strong> ${item.serialNo}</div>
        `;

        // QR Code container
        const qrContainer = document.createElement("div");
        qrContainer.className = "qr-code";
        const qrCanvas = document.createElement("canvas");

        try {
          // Generate QR code with the aggregation data
          const qrText = `GTIN:${item.gtin}|BATCH:${item.batchNo}|SERIAL:${item.serialNo}`;
          await bwipjs.toCanvas(qrCanvas, {
            bcid: "qrcode",
            text: qrText,
            scale: 2.2,
            includetext: false,
          });
          qrContainer.appendChild(qrCanvas);
        } catch (err) {
          console.error("Error generating QR code:", err);
          const errorText = document.createElement("div");
          errorText.textContent = "Error generating QR code";
          qrContainer.appendChild(errorText);
        }

        containerDiv.appendChild(detailsDiv);
        containerDiv.appendChild(qrContainer);
        pageDiv.appendChild(containerDiv);
        contentContainer.appendChild(pageDiv);
      }

      // Trigger print after all content is generated
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };

    generatePrintContent();
  }, [selectedItems]);

  return null;
}

export default AggregationPrint;
