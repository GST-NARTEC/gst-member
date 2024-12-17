import { apiSlice } from "../apiSlice";

const checkout = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation({
      query: (checkoutData) => ({
        url: "/user/v2/create-with-checkout",
        method: "POST",
        body: checkoutData,
      }),
    }),

    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/user/v1/create-order",
        method: "POST",
        body: orderData,
      }),
    }),
    
  }),
});

export const { useCheckoutMutation, useCreateOrderMutation } = checkout;
