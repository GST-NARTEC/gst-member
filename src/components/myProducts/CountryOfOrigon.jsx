import React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useGetCountriesQuery } from "../../store/apis/endpoints/location";

function CountryOfOrigon({ value, onChange }) {
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useGetCountriesQuery();

  const countries = countriesResponse?.data?.countries?.map(country => ({
    label: country.nameEn,
    value: country.nameEn,
    description: country.nameAr
  })) || [];

  return (
    <Autocomplete
      label="Country of Origin"
      placeholder="Select country of origin"
      defaultItems={countries}
      selectedKey={value}
      onSelectionChange={(value) => onChange(value)}
      isLoading={isLoadingCountries}
    >
      {(item) => (
        <AutocompleteItem key={item.value} textValue={item.label}>
          <div className="flex flex-col">
            <span>{item.label}</span>
            <span className="text-small text-default-400">
              {item.description}
            </span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}

export default CountryOfOrigon;
