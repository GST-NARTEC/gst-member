import { apiSlice } from "../apiSlice";

const products = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products/v1",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    getProducts: builder.query({
      query: (params) => ({
        url: "/products/v1",
        method: "GET",
        params, // For pagination
      }),
      providesTags: ["Products"],
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: `/products/v1/${id}`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: (args) => ({
        url: `/products/v1/${args.id}`,
        method: "PUT",
        body: args.data,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/v1/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = products;
