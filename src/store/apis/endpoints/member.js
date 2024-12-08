import { apiSlice } from "../apiSlice";
import { setCredentials } from "../../slices/memberSlice";

export const memberApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/user/v1/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: response.data.user,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            })
          );
        } catch (error) {
          // Handle error if needed
        }
      },
    }),

    memberGtins: builder.query({
      query: (userId) => ({
        url: `/user/v1/${userId}/gtins`,
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useMemberGtinsQuery } = memberApi;
