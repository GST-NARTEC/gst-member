import { apiSlice } from "../apiSlice";

export const amazonPayApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    amazonPay: builder.mutation({
      query: (payload) => ({
        url: "/v1/payment/initialize",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useAmazonPayMutation } = amazonPayApi;
