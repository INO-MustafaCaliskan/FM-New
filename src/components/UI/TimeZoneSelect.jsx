import React from 'react'
import { InoSelect } from './InoSelect'
import moment from "moment-timezone";

const timeZoneList = moment.tz.names().map((tz) => ({
    value: tz,
    label: `${tz} (GMT${moment.tz(tz).format("Z")})`,
  }))

export const TimeZoneSelect = ({placeholder, defaultValue, defaultInputValue, value, onChange, label, name, onBlur, isInvalid, isSearchable = true}) => {
    
    return (
        <InoSelect 
            options={timeZoneList}
            placeholder={placeholder}
            defaultValue={defaultValue}
            defaultInputValue={defaultInputValue}
            value={timeZoneList.find(
                (timezone) => timezone.value === value
            )}
            onChange={onChange}
            label={label}
            name={name}
            onBlur={onBlur}
            isInvalid={isInvalid}
            isSearchable={isSearchable}
        />
      )
}
