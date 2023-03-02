import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, geoApiOptions } from "../../api";

const Search = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null);

  //loading the cities
  const loadOptions = (inputValue) => {
    return fetch(
      `${GEO_API_URL}/cities?countryIds=LK&namePrefix=${inputValue}`,
      geoApiOptions
    )
      .then((response) => response.json())
      .then((response) => {
        return {
          options: response.data.map((city) => {
            return {
              value: `${city.latitude} ${city.longitude}`,
              label: `${city.name}, ${city.countryCode}`,
            };
          }),
        };
      })
      .catch((err) => console.error(err));
  };

  //handle the search
  const handleOnChange = (searchData) => {
    setSearch(searchData); //update the new value in the search
    onSearchChange(searchData);
  };

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600} //the next request send after 600ms
      value={search}
      onChange={handleOnChange} //calling the handleOnChange
      loadOptions={loadOptions} //loading option relevant to searching key
    />
  );
};

export default Search;
