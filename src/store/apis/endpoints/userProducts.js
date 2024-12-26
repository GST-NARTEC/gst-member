import { apiSlice } from "../apiSlice";

const userProducts = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProducts: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/v1/user-products",
        method: "GET",
        params: {
          page,
          limit,
          search,
        },
      }),
      providesTags: ["UserProducts"],
      transformResponse: (response) => ({
        products: response.data.products,
        pagination: response.data.pagination,
      }),
    }),

    getUserProductById: builder.query({
      query: ({ id }) => ({
        url: `/v1/user-products/${id}`,
        method: "GET",
      }),
      providesTags: ["UserProductsById"],
    }),

    createUserProduct: builder.mutation({
      query: (data) => ({
        url: "/v1/user-products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        "UserProducts",
        "UserProductsById",
        "userTotalSECQuantity",
        "GtinsCount",
      ],
    }),

    updateUserProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/v1/user-products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UserProducts", "UserProductsById"],
    }),

    deleteUserProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/user-products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserProducts", "GtinsCount"],
    }),

    deleteUserProductImage: builder.mutation({
      query: ({ productId, imageId }) => ({
        url: `/v1/user-products/products/${productId}/images/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserProducts", "UserProductsById"],
    }),

    getGtinsCount: builder.query({
      query: () => ({
        url: `/v1/barcode-types/counts`,
        method: "GET",
      }),
      providesTags: ["GtinsCount"],
    }),

    getCountryOfOriginSale: builder.query({
      query: () => ({
        url: "/v1/country-of-origin-sale/all",
        method: "GET",
      }),
      providesTags: ["CountryOfOriginSale"],
    }),

    getPackagingTypes: builder.query({
      query: () => ({
        url: "/v1/packaging-type/all",
        method: "GET",
      }),
      providesTags: ["PackagingTypes"],
    }),

    getProductTypes: builder.query({
      query: () => ({
        url: "/v1/product-type/all",
        method: "GET",
      }),
      providesTags: ["ProductTypes"],
    }),

    getExportExcel: builder.query({
      query: () => ({
        url: "/v1/user-products/export-excel",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return { data: blob };
        },
      }),
      providesTags: ["ExportExcel"],
    }),
  }),
});

export const {
  useGetUserProductsQuery,
  useCreateUserProductMutation,
  useUpdateUserProductMutation,
  useDeleteUserProductMutation,
  useGetUserProductByIdQuery,
  useDeleteUserProductImageMutation,
  useGetGtinsCountQuery,
  useGetCountryOfOriginSaleQuery,
  useGetPackagingTypesQuery,
  useGetProductTypesQuery,
  useGetExportExcelQuery,
  useLazyGetExportExcelQuery,
} = userProducts;
