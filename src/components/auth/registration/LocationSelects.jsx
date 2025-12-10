import React, { useEffect, useState, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { MdLocationOn } from "react-icons/md";
import { FaGlobe } from "react-icons/fa";
import { Country, State, City } from "country-state-city";

const LocationSelects = ({ control, isDisabled=false, errors }) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const countries = useMemo(() => Country.getAllCountries(), []);
  
  const regions = useMemo(() => {
    return selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
  }, [selectedCountry]);

  const cities = useMemo(() => {
    return selectedRegion ? City.getCitiesOfState(selectedCountry, selectedRegion) : [];
  }, [selectedCountry, selectedRegion]);

  const watchedCountry = useWatch({ control, name: "country" });
  const watchedRegion = useWatch({ control, name: "region" });
  const watchedCity = useWatch({ control, name: "city" });

  // Sync state with form values (handling external updates like setValue from parent)
  useEffect(() => {
    if (watchedCountry) {
      const country = countries.find((c) => c.name === watchedCountry);
      if (country && country.isoCode !== selectedCountry) {
        setSelectedCountry(country.isoCode);
      }
    } else if (selectedCountry) {
      setSelectedCountry("");
    }
  }, [watchedCountry, countries, selectedCountry]);

  useEffect(() => {
    if (watchedRegion && selectedCountry) {
      const region = regions.find((r) => r.name === watchedRegion);
      if (region && region.isoCode !== selectedRegion) {
        setSelectedRegion(region.isoCode);
      }
    } else if (selectedRegion) {
      setSelectedRegion("");
    }
  }, [watchedRegion, selectedCountry, regions, selectedRegion]);

  useEffect(() => {
    if (watchedCity && selectedRegion) {
        if (watchedCity !== selectedCity) {
            setSelectedCity(watchedCity);
        }
    } else if (selectedCity) {
        setSelectedCity("");
    }
  }, [watchedCity, selectedRegion, selectedCity]);

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
              disabled={isDisabled}
              onChange={(e) => {
                const value = e.target.value; // ISO Code
                const selectedCountryData = countries.find(
                  (c) => c.isoCode === value
                );
                setSelectedCountry(value);
                field.onChange(selectedCountryData?.name || "");
                
                // Reset child fields
                setSelectedRegion("");
                setSelectedCity("");
                control.setValue("region", "");
                control.setValue("city", "");
              }}
              className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
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
              disabled={isDisabled || !selectedCountry}
              onChange={(e) => {
                const value = e.target.value; // ISO Code
                const selectedRegionData = regions.find((r) => r.isoCode === value);
                setSelectedRegion(value);
                field.onChange(selectedRegionData?.name || "");
                
                // Reset child field
                setSelectedCity("");
                control.setValue("city", "");
              }}
              className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a region</option>
              {regions.map((region) => (
                <option key={region.isoCode} value={region.isoCode}>
                  {region.name}
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
              value={selectedCity} // Store name for city as we don't need ISO for next step
              disabled={isDisabled || !selectedRegion}
              onChange={(e) => {
                const value = e.target.value; // Name
                setSelectedCity(value);
                field.onChange(value);
              }}
              className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
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
