import React, { useEffect } from "react";
import bwipjs from "bwip-js";
import { Images } from "../../../assets/Index";

function BigBoxLabelPrint({ selectedItems, brandName, productName }) {
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
              gap: 0.2in;
            }
            .header {
              text-align: center;
              margin-bottom: 0.2in;
            }
            .brand-name {
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 0.05in;
            }
            .product-name {
              font-size: 12px;
            }
            .main-content {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 0.2in;
            }
            .datamatrix-container {
              flex: 0 0 auto;
            }
            .datamatrix-container canvas {
              width: 1.5in !important;
              height: 1.5in !important;
            }
            .hri-text {
              font-family: monospace;
              font-size: 10px;
              text-align: left;
              line-height: 1.4;
              flex: 1;
            }
            .details {
              margin-top: 0.2in;
            }
            .details-row {
              display: flex;
              align-items: center;
              gap: 0.1in;
              margin-bottom: 0.1in;
            }
            .icon {
              width: 0.3in;
              height: 0.3in;
              object-fit: contain;
            }
            .label {
              font-weight: bold;
              font-size: 12px;
              width: 0.8in;
            }
            .value {
              font-family: monospace;
              font-size: 12px;
              flex: 1;
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

      // Convert images to base64 strings before using them
      const getBase64Image = (imgSrc) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous"; // Handle CORS issues
          img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
          };
          img.onerror = function () {
            console.error("Failed to load image:", imgSrc);
            resolve(""); // Return empty string if image fails to load
          };
          img.src = imgSrc;
        });
      };

      // Convert all icons to base64 before creating the print content
      const iconBase64Map = {
        ref: await getBase64Image(Images.REF),
        batch: await getBase64Image(Images.BatchNumber),
        serial: await getBase64Image(Images.SN),
        expiry: await getBase64Image(Images.ExpiryDate),
      };

      for (const item of uniqueItems) {
        const pageDiv = document.createElement("div");
        pageDiv.className = "print-page";

        const containerDiv = document.createElement("div");
        containerDiv.className = "content-container";

        // Header section with brand and product name
        const headerDiv = document.createElement("div");
        headerDiv.className = "header";
        headerDiv.innerHTML = `
          <div class="brand-name">${brandName || ""}</div>
          <div class="product-name">${productName || ""}</div>
        `;
        containerDiv.appendChild(headerDiv);

        // Main content section
        const mainContentDiv = document.createElement("div");
        mainContentDiv.className = "main-content";

        // DataMatrix section
        const dataMatrixContainer = document.createElement("div");
        dataMatrixContainer.className = "datamatrix-container";
        const canvas = document.createElement("canvas");

        try {
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
        } catch (err) {
          console.error("Error generating DataMatrix:", err);
          const errorText = document.createElement("div");
          errorText.textContent = "Error generating barcode";
          dataMatrixContainer.appendChild(errorText);
        }

        // HRI text section
        const hriText = document.createElement("div");
        hriText.className = "hri-text";
        hriText.innerHTML = `(01) ${item?.gtin || ""}<br>
                            (17) ${formatDate(item?.expiryDate)}<br>
                            (10) ${item?.batchNo || ""}<br>
                            (21) ${item?.serialNo || ""}`;

        mainContentDiv.appendChild(dataMatrixContainer);
        mainContentDiv.appendChild(hriText);
        containerDiv.appendChild(mainContentDiv);

        // Details section with icons
        const detailsDiv = document.createElement("div");
        detailsDiv.className = "details";

        const expiryDate = item?.expiryDate
          ? new Date(item.expiryDate).toLocaleDateString()
          : "";

        detailsDiv.innerHTML = `
          <div class="details-row">
            <img src="${iconBase64Map.ref}" class="icon" alt="GTIN" />
            <span class="label">GTIN:</span>
            <span class="value">${item?.gtin || ""}</span>
          </div>
          <div class="details-row">
            <img src="${iconBase64Map.batch}" class="icon" alt="Batch" />
            <span class="label">Batch No:</span>
            <span class="value">${item?.batchNo || ""}</span>
          </div>
          <div class="details-row">
            <img src="${iconBase64Map.serial}" class="icon" alt="Serial" />
            <span class="label">Serial No:</span>
            <span class="value">${item?.serialNo || ""}</span>
          </div>
          <div class="details-row">
            <img src="${iconBase64Map.expiry}" class="icon" alt="Expiry" />
            <span class="label">Exp Date:</span>
            <span class="value">${expiryDate}</span>
          </div>
        `;

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
  }, [selectedItems, brandName, productName]);

  return null;
}

export default BigBoxLabelPrint;
