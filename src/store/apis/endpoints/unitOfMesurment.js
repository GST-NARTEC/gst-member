import { apiSlice } from "../apiSlice";

export const unitOfMesurmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUnitOfMesurment: builder.query({
      query: () => "/v1/unit-codes/all",
    }),
  }),
});

export const { useGetUnitOfMesurmentQuery } = unitOfMesurmentApi;
