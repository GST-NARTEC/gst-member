import { apiSlice } from "../apiSlice";

// Define enums as constants
export const Status = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
};

export const Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
};

export const TicketCategory = {
  ACCOUNT: "ACCOUNT",
  ORDER: "ORDER",
  PRODUCT: "PRODUCT",
  PAYMENT: "PAYMENT",
  OTHER: "OTHER",
};

export const helpDiskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHelpTickets: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, search, status, priority, category } = params;
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(status && { status }),
          ...(priority && { priority }),
          ...(category && { category }),
        }).toString();
        
        return `/v1/help-tickets?${queryParams}`;
      },
      providesTags: ["HelpTickets"],
      transformResponse: (response) => ({
        tickets: response.data.tickets,
        pagination: response.data.pagination,
      }),
    }),
    createHelpTicket: builder.mutation({
      query: (ticketData) => ({
        url: "/v1/help-tickets",
        method: "POST",
        body: ticketData,
        formData: true,
      }),
      invalidatesTags: ["HelpTickets"],
    }),
  }),
});

export const { useGetHelpTicketsQuery, useCreateHelpTicketMutation } = helpDiskApi;
