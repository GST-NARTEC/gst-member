import { apiSlice } from "../apiSlice";

export const udiApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all UDIs
    getUdis: builder.query({
      query: ({ page = 1, limit = 10, search = "", gtin }) => ({
        url: "/v1/udis",
        params: {
          page,
          limit,
          search,
          gtin,
        },
      }),
      providesTags: ["UDI"],
    }),

    // Get single UDI by ID
    getUdiById: builder.query({
      query: (id) => ({
        url: `/v1/udis/${id}`,
      }),
      providesTags: ["UDI"],
    }),

    // Create new UDI
    createUdi: builder.mutation({
      query: (data) => ({
        url: "/v1/udis",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UDI"],
    }),

    // Delete UDI
    deleteUdi: builder.mutation({
      query: (id) => ({
        url: `/v1/udis/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UDI"],
    }),
  }),
});

export const {
  useGetUdisQuery,
  useGetUdiByIdQuery,
  useCreateUdiMutation,
  useDeleteUdiMutation,
} = udiApi;
