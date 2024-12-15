import { apiSlice } from "../apiSlice";

export const userDocsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all documents for a user
    getUserDocs: builder.query({
      query: (userId) => `/v1/user-docs/${userId}`,
    }),

    getDocsTypes: builder.query({
      query: () => "/v1/doc-types",
    }),

    // Create a new user document
    createUserDoc: builder.mutation({
      query: (docData) => ({
        url: "/v1/user-docs",
        method: "POST",
        body: docData,
      }),
      invalidatesTags: ["userDetails"],
    }),

    // Update an existing user document
    updateUserDoc: builder.mutation({
      query: (args) => ({
        url: `/v1/user-docs/${args.id}`,
        method: "PUT",
        body: args.docData,
      }),
      invalidatesTags: ["userDetails"],
    }),

    // Delete a user document
    deleteUserDoc: builder.mutation({
      query: (id) => ({
        url: `/v1/user-docs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["userDetails"],
    }),
  }),
});

export const {
  useGetUserDocsQuery,
  useCreateUserDocMutation,
  useUpdateUserDocMutation,
  useDeleteUserDocMutation,
  useGetDocsTypesQuery,
} = userDocsApiSlice;
