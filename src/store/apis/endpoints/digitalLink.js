import { apiSlice } from "../apiSlice";

export const digitalLinkApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createDigitalLink: builder.mutation({
      query: (data) => ({
        url: "/v1/digital-links",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["digitalLinks"],
    }),
    getDigitalLinks: builder.query({
      query: ({
        gtin,
        digitalLinkType,
        page = 1,
        limit = 10,
        search = "",
      }) => ({
        url: `/v1/digital-links/${gtin}/${digitalLinkType}`,
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: (result, error, arg) => {
        return ["digitalLinks"];
      },
    }),

    updateDigitalLink: builder.mutation({
      query: (data) => ({
        url: `/v1/digital-links/${data.id}`,
        method: "PUT",
        body: data.data,
      }),
      invalidatesTags: ["digitalLinks"],
    }),

    deleteDigitalLink: builder.mutation({
      query: (id) => ({
        url: `/v1/digital-links/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["digitalLinks"],
    }),

    createDigitalLinkSEC: builder.mutation({
      query: (data) => ({
        url: "/v1/sec",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SEC"],
    }),
    getDigitalLinksSEC: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: `/v1/sec`,
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["SEC"],
    }),
    updateDigitalLinkSEC: builder.mutation({
      query: (data) => ({
        url: `/v1/sec/${data.id}`,
        method: "PUT",
        body: data.data,
      }),
      invalidatesTags: ["SEC"],
    }),
    deleteDigitalLinkSEC: builder.mutation({
      query: (id) => ({
        url: `/v1/sec/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SEC"],
    }),

    checkSecGtin: builder.query({
      query: (gtin) => ({
        url: `/v1/orders/sec/${gtin}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateDigitalLinkMutation,
  useGetDigitalLinksQuery,
  useUpdateDigitalLinkMutation,
  useDeleteDigitalLinkMutation,
  useCreateDigitalLinkSECMutation,
  useGetDigitalLinksSECQuery,
  useUpdateDigitalLinkSECMutation,
  useDeleteDigitalLinkSECMutation,
  useCheckSecGtinQuery,
} = digitalLinkApiSlice;
