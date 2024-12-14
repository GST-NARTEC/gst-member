import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBarcodeData = createAsyncThunk(
  "externalData/fetchBarcodeData",
  async (barcode) => {
    try {
      // First API call
      const gs1Response = await fetch(
        `https://gs1ksa.org:3093/api/foreignGtin/getGtinProductDetails?barcode=${barcode}`
      );
      const gs1Data = await gs1Response.json();

      if (
        gs1Data.error ||
        gs1Data.Error ||
        gs1Data.message === "No company info found"
      ) {
        console.log("GS1 API failed, trying barcode report API...");
      } else if (gs1Data.ProductDataAvailable) {
        return { source: "gs1", data: gs1Data.data };
      } else if (!gs1Data.ProductDataAvailable && gs1Data.companyInfo) {
        // Handle company-only information case
        return { source: "gs1Company", data: gs1Data.companyInfo };
      }

      // Second API call
      const barcodeReportResponse = await fetch(
        `https://barcodereport.com/api/search_barcode?barcode=${barcode}&api_key=f7248cdb44cfa041eba85a5c01623980`
      );
      const barcodeReportData = await barcodeReportResponse.json();

      if (barcodeReportData.error === "Barcode not found") {
        throw new Error("Barcode not found in any of our databases");
      }

      if (barcodeReportData.barcode) {
        return { source: "barcodeReport", data: barcodeReportData };
      }

      throw new Error("Barcode not found in any of our databases");
    } catch (error) {
      if (error.message === "Failed to fetch") {
        throw new Error("Barcode not found in any of our databases");
      }
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
);

const externalDataSlice = createSlice({
  name: "externalData",
  initialState: {
    data: null,
    source: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetExternalData: (state) => {
      state.data = null;
      state.source = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBarcodeData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
        state.source = null;
      })
      .addCase(fetchBarcodeData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.source = action.payload.source;
      })
      .addCase(fetchBarcodeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetExternalData } = externalDataSlice.actions;

export default externalDataSlice.reducer;
