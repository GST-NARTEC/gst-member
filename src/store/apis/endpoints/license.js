import { apiSlice } from "../apiSlice";

const licenseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerLicense: builder.mutation({
      query: (data) => ({
        url: "/license/v1/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useRegisterLicenseMutation } = licenseApi;
