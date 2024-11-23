import { apiSlice } from "../apiSlice";

const taxApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTax: builder.query({
      query: () => "/vat/v1",
    }),
  }),
});

export const { useGetTaxQuery } = taxApi;
