import { apiSlice } from "../apiSlice";

const checkout = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation({
      query: (checkoutData) => ({
        url: "/checkout/v1/process",
        method: "POST",
        body: checkoutData,
      }),
    }),
  }),
});

export const { useCheckoutMutation } = checkout;
