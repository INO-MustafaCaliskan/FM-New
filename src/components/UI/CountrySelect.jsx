import React, { useEffect, useState } from 'react'
import { InoSelect } from './InoSelect'
import { getCountries } from '@/utils/apiActions';

export const CountrySelect = ({placeholder, defaultValue, defaultInputValue, value, onChange, label, name, onBlur, isInvalid, isSearchable = true,isDisabled}) => {
    const [ countries, setCountries ] = useState([]);

useEffect(() => {
  getCountries().then(countries => {
    setCountries(
      countries.map(country => ({
        value: country.id,
        label: country.name, // ✅ string
        countryCode: country.countryCode, // görsel için ayrı alan
      }))
    );
  });
}, []);


  return (
    <InoSelect 
        options={countries}
        placeholder={placeholder}
        defaultValue={defaultValue}
        defaultInputValue={defaultInputValue}
        value={countries.find(
            (country) => country.value === value
        )}
        onChange={onChange}
        label={label}
        isDisabled={isDisabled}
        name={name}
        onBlur={onBlur}
        isInvalid={isInvalid}
        isSearchable={isSearchable}
    />
  )
}
