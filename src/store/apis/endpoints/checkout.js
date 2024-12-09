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
  }),
});

export const { useCheckoutMutation } = checkout;
