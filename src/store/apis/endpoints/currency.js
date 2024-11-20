import { apiSlice } from "../apiSlice";

const currencyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrency: builder.query({
      query: () => "/currency/v1",
      providesTags: ["Currency"],
    }),

    createCurrency: builder.mutation({
      query: (data) => ({
        url: "/currency/v1",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Currency"],
    }),
  }),
});

export const {
  useGetCurrencyQuery,
  useCreateCurrencyMutation,
} = currencyApi;

