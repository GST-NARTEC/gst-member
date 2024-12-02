import { apiSlice } from "../apiSlice";

const cart = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (cartData) => ({
        url: "/cart/v2/add",
        method: "POST",
        body: cartData,
      }),
      // Invalidate cart queries when mutation succeeds
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const { useAddToCartMutation } = cart;
