import { apiSlice } from "../apiSlice";

export const glnApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGLNLocationTypes: builder.query({
      query: () => "/v1/glns",
      providesTags: ["GLNLocationTypes"],
    }),

    // Get single GLN location
    getGLNLocation: builder.query({
      query: (id) => `/v1/glns/${id}`,
    }),

    // Create new GLN location
    createGLNLocation: builder.mutation({
      query: (data) => ({
        url: "/v1/glns",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["GLNLocationTypes", "GtinsCount"],
    }),

    // Update GLN location
    updateGLNLocation: builder.mutation({
      query: (args) => ({
        url: `/v1/glns/${args.id}`,
        method: "PUT",
        body: args.data,
      }),
      invalidatesTags: ["GLNLocationTypes"],
    }),

    // Delete GLN location
    deleteGLNLocation: builder.mutation({
      query: (id) => ({
        url: `/v1/glns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GLNLocationTypes", "GtinsCount"],
    }),

    // Export GLNs to Excel
    exportGLNsToExcel: builder.query({
      query: () => ({
        url: "/v1/glns/export/excel",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return { data: blob };
        },
      }),
      providesTags: ["ExportExcel"],
    }),

    // Export GLNs to PDF
    exportGLNsToPDF: builder.query({
      query: () => ({
        url: "/v1/glns/export/pdf",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return { data: blob };
        },
      }),
      providesTags: ["ExportPdf"],
    }),
  }),
});

export const {
  useGetGLNLocationTypesQuery,
  useGetGLNLocationQuery,
  useCreateGLNLocationMutation,
  useUpdateGLNLocationMutation,
  useDeleteGLNLocationMutation,
  useExportGLNsToExcelQuery,
  useLazyExportGLNsToExcelQuery,
  useExportGLNsToPDFQuery,
  useLazyExportGLNsToPDFQuery,
} = glnApiSlice;
