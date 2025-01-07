import { apiSlice } from "../apiSlice";

export const imageGenerateAi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateImage: builder.mutation({
      query: (data) => ({
        url: "/v1/ai/image/generate",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGenerateImageMutation } = imageGenerateAi;
