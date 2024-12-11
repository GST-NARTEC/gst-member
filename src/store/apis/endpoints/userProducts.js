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
      invalidatesTags: ["UserProducts", "UserProductsById"],
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
      invalidatesTags: ["UserProducts"],
    }),
  }),
});

export const {
  useGetUserProductsQuery,
  useCreateUserProductMutation,
  useUpdateUserProductMutation,
  useDeleteUserProductMutation,
  useGetUserProductByIdQuery,
} = userProducts;
