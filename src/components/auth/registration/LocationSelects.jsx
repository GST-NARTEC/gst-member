import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { MdLocationOn } from "react-icons/md";
import { FaGlobe } from "react-icons/fa";
import {
  useGetCountriesQuery,
  useGetRegionsQuery,
  useGetCitiesQuery,
} from "../../../store/apis/endpoints/location";

const LocationSelects = ({ control, isDisabled, errors }) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useGetCountriesQuery();

  const { data: regionsResponse, isLoading: isLoadingRegions } =
    useGetRegionsQuery(selectedCountry, {
      skip: !selectedCountry,
    });
  const { data: citiesResponse, isLoading: isLoadingCities } =
    useGetCitiesQuery(selectedRegion, {
      skip: !selectedRegion,
    });

  const countries = countriesResponse?.data?.countries || [];
  const regions = regionsResponse?.data?.regions || [];
  const cities = citiesResponse?.data?.cities || [];

  return (
    <>
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <FaGlobe className="w-4 h-4 mr-2 text-navy-700" />
          Country
          <span className="text-red-500 ml-1">*</span>
        </label>
        <Controller
          name="country"
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <select
              {...field}
              value={selectedCountry}
              disabled={isDisabled || isLoadingCountries}
              onChange={(e) => {
                const value = e.target.value;
                const selectedCountryData = countries.find(
                  (c) => c.id === value
                );
                setSelectedCountry(value);
                field.onChange(selectedCountryData?.nameEn || "");
                setSelectedRegion("");
                setSelectedCity("");
                control.setValue("region", "");
                control.setValue("city", "");
              }}
              className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.nameEn} - {country.nameAr}
                </option>
              ))}
            </select>
          )}
        />
        {errors?.country && (
          <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
        )}
      </div>

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <MdLocationOn className="w-4 h-4 mr-2 text-navy-700" />
          Region
          <span className="text-red-500 ml-1">*</span>
        </label>
        <Controller
          name="region"
          control={control}
          rules={{ required: "Region is required" }}
          render={({ field }) => (
            <select
              {...field}
              value={selectedRegion}
              disabled={isDisabled || isLoadingRegions || !selectedCountry}
              onChange={(e) => {
                const value = e.target.value;
                const selectedRegionData = regions.find((r) => r.id === value);
                setSelectedRegion(value);
                field.onChange(selectedRegionData?.nameEn || "");
                setSelectedCity("");
                control.setValue("city", "");
              }}
              className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.nameEn} - {region.nameAr}
                </option>
              ))}
            </select>
          )}
        />
        {errors?.region && (
          <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>
        )}
      </div>

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <MdLocationOn className="w-4 h-4 mr-2 text-navy-700" />
          City
          <span className="text-red-500 ml-1">*</span>
        </label>
        <Controller
          name="city"
          control={control}
          rules={{ required: "City is required" }}
          render={({ field }) => (
            <select
              {...field}
              value={selectedCity}
              disabled={isDisabled || isLoadingCities || !selectedRegion}
              onChange={(e) => {
                const value = e.target.value;
                const selectedCityData = cities.find((c) => c.id === value);
                setSelectedCity(value);
                field.onChange(selectedCityData?.nameEn || "");
              }}
              className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.nameEn} - {city.nameAr} ({city.telCode})
                </option>
              ))}
            </select>
          )}
        />
        {errors?.city && (
          <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
        )}
      </div>
    </>
  );
};

export default LocationSelects;
