import { apiSlice } from "../apiSlice";

const order = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadBankSlip: builder.mutation({
      query: (formData) => ({
        url: "/v1/orders/bank-slip",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["userDetails"],
    }),
    deleteBankSlip: builder.mutation({
      query: (orderNumber) => ({
        url: `/v1/orders/bank-slip/${orderNumber}`,
        method: "DELETE",
      }),
      invalidatesTags: ["userDetails"],
    }),
    activateOrder: builder.mutation({
      query: (orderNumber) => ({
        url: `/v1/orders/activate/${orderNumber}`,
        method: "PATCH",
      }),
      invalidatesTags: ["userDetails"],
    }),
  }),
});

export const {
  useUploadBankSlipMutation,
  useDeleteBankSlipMutation,
  useActivateOrderMutation,
} = order;
