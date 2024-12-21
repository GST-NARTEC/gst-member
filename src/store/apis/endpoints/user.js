import { apiSlice } from "../apiSlice";

const user = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (params) => ({
        url: "/user/v1/search",
        method: "GET",
        params,
      }),
    }),

    sendOtp: builder.mutation({
      query: (data) => ({
        url: "/user/v1/send-otp",
        method: "POST",
        body: data,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/user/v1/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    createUser: builder.mutation({
      query: (data) => ({
        url: "/user/v2/create",
        method: "POST",
        body: data,
      }),
    }),

    verifyLicense: builder.mutation({
      query: (data) => ({
        url: "/license/v1/verify",
        method: "POST",
        body: data,
      }),
    }),

    getUserById: builder.query({
      query: (args) => ({
        url: `/user/v1/${args.id}`,
        method: "GET",
        params: args.params,
      }),
      providesTags: ["userDetails"],
    }),

    getUserTotalSECQuantity: builder.query({
      query: () => ({
        url: `/user/v1/total-sec-quantity`,
        method: "GET",
      }),
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `/user/v1/${data.id}`,
        method: "PUT",
        body: data.data,
      }),
      invalidatesTags: ["userDetails", "users"],
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useCreateUserMutation,
  useVerifyLicenseMutation,
  useGetUserQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useGetUserTotalSECQuantityQuery,
} = user;
