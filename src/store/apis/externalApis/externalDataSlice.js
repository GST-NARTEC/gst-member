import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBarcodeData = createAsyncThunk(
  "externalData/fetchBarcodeData",
  async (barcode) => {
    // Step 1: Try GS1 API
    try {
      const gs1Response = await fetch(
        `https://gs1ksa.org:3093/api/foreignGtin/getGtinProductDetails?barcode=${barcode}`
      );
      const gs1Data = await gs1Response.json();

      if (
        !gs1Data.error &&
        !gs1Data.Error &&
        gs1Data.message !== "No company info found"
      ) {
        if (gs1Data.ProductDataAvailable) {
          return { source: "gs1", data: gs1Data.data };
        } else if (gs1Data.companyInfo) {
          return { source: "gs1Company", data: gs1Data.companyInfo };
        }
      }
    } catch (error) {
      console.log("GS1 API Error:", error);
      // Continue to next API instead of throwing
    }

    // Step 2: Try Barcodelookup API
    try {
      const barcodeLookupApiKey = import.meta.env.VITE_BARCODE_LOOKUP_API_KEY;
      const barcodeLookupResponse = await fetch(
        `https://api.gstsa1.org/api/v1/barcode-lookup/${barcode}`
      );
      const barcodeLookupData = await barcodeLookupResponse.json();

      if (barcodeLookupData.products && barcodeLookupData.products.length > 0) {
        return { source: "barcodeLookup", data: barcodeLookupData.products[0] };
      }
    } catch (error) {
      console.log("Barcode Lookup API Error:", error);
      // Continue to next API instead of throwing
    }

    // Step 3: Try Barcode Report API
    try {
      const barcodeReportApiKey = import.meta.env.VITE_BARCODE_REPORT_API_KEY;
      const barcodeReportResponse = await fetch(
        `https://barcodereport.com/api/search_barcode?barcode=${barcode}&api_key=${barcodeReportApiKey}`
      );
      const barcodeReportData = await barcodeReportResponse.json();

      if (barcodeReportData.barcode) {
        return { source: "barcodeReport", data: barcodeReportData };
      }
    } catch (error) {
      console.log("Barcode Report API Error:", error);
    }

    // If all APIs fail, throw final error
    throw new Error("Barcode not found in any of our databases");
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
