import { apiSlice } from "../apiSlice";

export const dashboardStatsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/v1/dashboard/stats",
      providesTags: ["DashboardStats"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardStatsApi;
