import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const embeddingsApi = createApi({
  reducerPath: "embeddingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://embeddings.gtrack.online/api" }),
  endpoints: (builder) => ({
    getGpcSearch: builder.query({
      query: (text) => ({
        url: `/findSimilarRecords?text=${text}&tableName=gpc&limit=100`,
        method: "GET",
      }),
    }),
    getHsSearch: builder.query({
      query: (text) => ({
        url: `/findSimilarRecords?text=${text}&tableName=hs_codes&limit=100`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLazyGetGpcSearchQuery,
  useLazyGetHsSearchQuery,
} = embeddingsApi;
