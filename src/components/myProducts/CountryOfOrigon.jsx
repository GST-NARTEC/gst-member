import React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useGetCountryOfOriginSaleQuery } from "../../store/apis/endpoints/userProducts";

function CountryOfOrigon({ value, onChange }) {
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useGetCountryOfOriginSaleQuery();

  const countries =
    countriesResponse?.data?.map((country) => ({
      label: country.name,
      value: country.name,
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
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}

export default CountryOfOrigon;
