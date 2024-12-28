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
              size: 4in 6in; 
              margin: 0; 
            }
            body { 
              font-family: Arial, sans-serif;
              font-size: 14px; 
              line-height: 1.4; 
              margin: 0;
              padding: 0;
              background: white;
            }
            .print-page { 
              page-break-after: always; 
              height: 6in; 
              width: 4in; 
              margin: 0;
              padding: 0.25in;
              box-sizing: border-box;
              background: white;
            }
            .print-page:last-child {
              page-break-after: avoid;
            }
            .content-container { 
              border: 1px solid black; 
              height: 100%;
              width: 100%;
              padding: 0.25in;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              gap: 0.25in;
            }
            .qr-container {
              display: flex;
              justify-content: center;
              margin-bottom: 0.25in;
            }
            .qr-code {
              width: 1.5in;
              height: 1.5in;
            }
            .details {
              font-size: 16px;
              line-height: 1.6;
            }
            .details-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 0.15in;
            }
            .label {
              font-weight: bold;
            }
            .value {
              text-align: right;
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
      const contentContainer = printWindow.document.getElementById("printContent");

      for (const item of uniqueItems) {
        const pageDiv = document.createElement("div");
        pageDiv.className = "print-page";

        const containerDiv = document.createElement("div");
        containerDiv.className = "content-container";

        // QR Code container
        const qrContainer = document.createElement("div");
        qrContainer.className = "qr-container";
        const qrCanvas = document.createElement("canvas");
        qrCanvas.className = "qr-code";

        try {
          // Generate QR code with the aggregation data
          const qrText = `GTIN:${item.gtin}|BATCH:${item.batchNo}|SERIAL:${item.serialNo}`;
          await bwipjs.toCanvas(qrCanvas, {
            bcid: "qrcode",
            text: qrText,
            scale: 4,
            includetext: false,
          });
          qrContainer.appendChild(qrCanvas);
        } catch (err) {
          console.error("Error generating QR code:", err);
        }

        // Details section
        const detailsDiv = document.createElement("div");
        detailsDiv.className = "details";
        detailsDiv.innerHTML = `
          <div class="details-row">
            <span class="label">GTIN:</span>
            <span class="value">${item.gtin}</span>
          </div>
          <div class="details-row">
            <span class="label">EXPIRY:</span>
            <span class="value">${new Date(item.expiryDate).toLocaleDateString()}</span>
          </div>
          <div class="details-row">
            <span class="label">BATCH#:</span>
            <span class="value">${item.batchNo}</span>
          </div>
          <div class="details-row">
            <span class="label">MFG DATE:</span>
            <span class="value">${new Date(item.manufacturingDate).toLocaleDateString()}</span>
          </div>
          <div class="details-row">
            <span class="label">SERIAL#:</span>
            <span class="value">${item.serialNo}</span>
          </div>
        `;

        containerDiv.appendChild(qrContainer);
        containerDiv.appendChild(detailsDiv);
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
