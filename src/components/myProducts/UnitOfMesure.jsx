import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

const measurementUnits = [
  { label: "Kilogram (kg)", value: "kg", description: "Standard unit of mass" },
  { label: "Gram (g)", value: "g", description: "Metric unit of mass" },
  { label: "Liter (L)", value: "l", description: "Metric unit of volume" },
  { label: "Milliliter (mL)", value: "ml", description: "Metric unit of volume" },
  { label: "Piece (pc)", value: "pc", description: "Count by individual items" },
  { label: "Box", value: "box", description: "Standard packaging unit" },
  { label: "Carton", value: "carton", description: "Larger packaging unit" },
  { label: "Meter (m)", value: "m", description: "Unit of length" },
  { label: "Centimeter (cm)", value: "cm", description: "Unit of length" },
  { label: "Square Meter (m²)", value: "m2", description: "Unit of area" },
  { label: "Pack", value: "pack", description: "Group packaging unit" },
  { label: "Dozen", value: "dozen", description: "Group of twelve items" },
];

function UnitOfMeasure({ value, onChange }) {
  return (
    <Autocomplete
      label="Unit of Measure"
      placeholder="Select unit of measure"
      defaultItems={measurementUnits}
      selectedKey={value}
      onSelectionChange={(value) => onChange(value)}
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

export default UnitOfMeasure;
