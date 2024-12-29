import { apiSlice } from "../apiSlice";

export const aggregationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAggregations: builder.query({
      query: ({ page = 1, limit = 10, search = "", gtin = "" }) => ({
        url: `/v1/aggregations`,
        params: { page, limit, search, gtin },
      }),
      providesTags: ["Aggregations"],
    }),
    createAggregation: builder.mutation({
      query: (data) => ({
        url: "/v1/aggregations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Aggregations"],
    }),
    updateAggregation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/v1/aggregations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Aggregations"],
    }),
    deleteAggregation: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/aggregations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Aggregations"],
    }),
  }),
});

export const {
  useGetAggregationsQuery,
  useCreateAggregationMutation,
  useUpdateAggregationMutation,
  useDeleteAggregationMutation,
} = aggregationApi;
