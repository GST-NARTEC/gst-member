import { apiSlice } from "../apiSlice";

export const locationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query({
      query: () => ({
        url: "/locations/v1/countries",
        method: "GET",
      }),
    }),

    getRegions: builder.query({
      query: (countryId) => ({
        url: "/locations/v1/regions",
        method: "GET",
        params: { countryId },
      }),
    }),

    getCities: builder.query({
      query: (regionId) => ({
        url: "/locations/v1/cities",
        method: "GET",
        params: { regionId },
      }),
    }),
  }),
});

export const { useGetCountriesQuery, useGetRegionsQuery, useGetCitiesQuery } =
  locationApi;
