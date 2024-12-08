import { apiSlice } from "../apiSlice";

export const brandsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => ({
        url: "/v1/brands",
        method: "GET",
      }),
      providesTags: ["Brands"],
    }),

    getActiveBrands: builder.query({
      query: () => ({
        url: "/v1/brands/active",
        method: "GET",
      }),
      providesTags: ["ActiveBrands"],
    }),

    getBrandById: builder.query({
      query: (id) => ({
        url: `/v1/brands/${id}`,
        method: "GET",
      }),
      providesTags: ["BrandById"],
    }),

    createBrand: builder.mutation({
      query: (data) => ({
        url: "/v1/brands",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brands"],
    }),

    updateBrand: builder.mutation({
      query: (payload) => ({
        url: `/v1/brands/${payload.id}`,
        method: "PUT",
        body: payload.data,
      }),
      invalidatesTags: ["Brands"],
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/v1/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brands"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetActiveBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi;
