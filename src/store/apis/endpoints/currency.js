import { apiSlice } from "../apiSlice";
import { setCurrencySymbol } from "../../slices/currencySymbolSlice";

const currencyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrency: builder.query({
      query: () => "/currency/v1",
      providesTags: ["Currency"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.currencies?.[0]?.symbol) {
            dispatch(setCurrencySymbol(data?.data?.currencies[0]?.symbol));
          }
        } catch (error) {
          console.error("Failed to set currency symbol:", error);
        }
      },
    }),
  }),
});

export const { useGetCurrencyQuery } = currencyApi;
