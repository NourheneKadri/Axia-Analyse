import React, { useState } from "react";
import Dropdown from "react-dropdown";

const options = [
  { value: "op1", label: "All Location" },
  { value: "op2", label: "Japan" },
  { value: "op3", label: "Canada" },
  { value: "op4", label: "England" },
  { value: "op5", label: "United States" },
  { value: "op6", label: "Germany" },
  { value: "op7", label: "France" },
  { value: "op8", label: "Australia" },
  { value: "op9", label: "India" },
  { value: "op10", label: "Brazil" },
  { value: "op11", label: "China" },
  { value: "op12", label: "South Korea" },
  { value: "op13", label: "Mexico" },
  { value: "op14", label: "Italy" },
  { value: "op15", label: "Spain" },
  { value: "op16", label: "Sweden" },
  { value: "op17", label: "Netherlands" },
  { value: "op18", label: "Russia" },
  { value: "op19", label: "South Africa" },
  { value: "op20", label: "New Zealand" },
  { value: "op21", label: "New York, USA" },
  { value: "op22", label: "Los Angeles, USA" },
  { value: "op23", label: "Toronto, Canada" },
  { value: "op24", label: "Vancouver, Canada" },
  { value: "op25", label: "London, England" },
  { value: "op26", label: "Manchester, England" },
  { value: "op27", label: "Berlin, Germany" },
  { value: "op28", label: "Munich, Germany" },
  { value: "op29", label: "Paris, France" },
  { value: "op30", label: "Marseille, France" },
  { value: "op31", label: "Sydney, Australia" },
  { value: "op32", label: "Melbourne, Australia" },
  { value: "op33", label: "Mumbai, India" },
  { value: "op34", label: "Bangalore, India" },
  { value: "op35", label: "Beijing, China" },
  { value: "op36", label: "Shanghai, China" },
  { value: "op37", label: "Seoul, South Korea" },
  { value: "op38", label: "Tokyo, Japan" },
  { value: "op39", label: "Cape Town, South Africa" },
  { value: "op40", label: "Johannesburg, South Africa" },
  { value: "op41", label: "Rome, Italy" },
  { value: "op42", label: "Milan, Italy" },
  { value: "op43", label: "Madrid, Spain" },
  { value: "op44", label: "Barcelona, Spain" },
];

function SelectLocation({ value, onChange }) {
  const [selectedLocation, setSelectedLocation] = useState(options[0]); // Set default to the first option

  const handleChange = (selectedOption) => {
    setSelectedLocation(selectedOption);  // Update the local state with the selected option
    onChange(selectedOption);  // Pass the selected option to the parent component
  };

  return (
    <Dropdown
      options={options}
      className="react-dropdown select-location"
      value={selectedLocation}
      onChange={handleChange}
    />
  );
}

export default SelectLocation;
