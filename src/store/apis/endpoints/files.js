import { apiSlice } from "../apiSlice";

export const filesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all files
    getFiles: builder.query({
      query: (params) => ({
        url: "/v1/files",
        params: params || {},
      }),
    }),
  }),
});

export const { useGetFilesQuery } = filesApiSlice;
