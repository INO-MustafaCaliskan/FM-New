import Select from "react-select";
import { getMask } from "@/utils/getMask";
import InputMask from "react-input-mask";
import { useEffect, useState } from "react";
import "./phone-number-select.css";
import { getCountries } from "@/utils/apiActions";

export const PhoneNumberSelect = ({
  phoneCodeName,
  phoneCodeValue,
  phoneIsoValue,
  phoneNumberName,
  phoneNumberValue,
  selectClassName = "",
  inputClassName = "",
  onPhoneNumberChange,
  onPhoneCodeChange,
  onBlur,
  isInvalid,
}) => {
  const [phoneMask, setPhoneMask] = useState("");
  const [phoneCodes, setPhoneCodes] = useState([]);

  const selectedIso = phoneIsoValue ? phoneIsoValue.toLowerCase() : null;

  useEffect(() => {
    getCountries().then((countries) => {
      const mapped = countries.map((country) => {
        const rawIso = country?.countryCode?.trim();
        const iso = rawIso ? rawIso.toLowerCase().slice(0, 4) : null;
        const flagSrc =
          rawIso === "TRNC"
            ? "/images/north-cyprus.png"
            : iso
              ? `https://flagcdn.com/w20/${iso}.png`
              : "/images/no-flag.png";
        return {
          value: `${country.phoneCode}-${iso || "xx"}`,
          phoneCode: country.phoneCode,
          iso,
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={flagSrc}
                alt={iso || "default"}
                style={{
                  marginRight: 8,
                  width: 20,
                  height: 15,
                  objectFit: "cover",
                }}
              />
              <span>{country.phoneCode}</span>
            </div>
          ),
        };
      });

      setPhoneCodes(mapped);
    });
  }, []);

  useEffect(() => {

    if (!phoneCodeValue) return;
    setPhoneMask(getMask(phoneCodeValue));
  }, [phoneCodeValue]);

  const handlePhoneCodeChange = (option) => {
    if (!option) return;

    setPhoneMask(getMask(option.phoneCode));
    onPhoneCodeChange(option.phoneCode, option.iso);
  };

  const handlePhoneNumberChange = (e) => {
    onPhoneNumberChange(e.target.value);
  };

  const beforeMaskedValueChange = (newState, oldState, userInput) => {
    if (userInput) {
      let { value } = newState;
      value = value.replace(/_/g, "").trimEnd();
      return { ...newState, value };
    }
    return newState;
  };

  const selectedOption = phoneCodes.find(
    (o) =>
      o.phoneCode === phoneCodeValue &&
      (selectedIso ? o.iso === selectedIso : true),
  );

  return (
    <div
      className={`phone-number-select-wrapper ${isInvalid ? "is-invalid" : ""}`}
    >
      <Select
        instanceId={phoneCodeName}
        components={{ IndicatorSeparator: () => null }}
        name={phoneCodeName}
        className={`${selectClassName} phone-code-select-wrapper`}
        options={phoneCodes}
        onChange={handlePhoneCodeChange}
        value={selectedOption || null}
        classNames={{
          control: () => "phone-code-select talk-select form-control",
          singleValue: () => "phone-single-value",
        }}
        styles={{
          valueContainer: (provided) => ({
            ...provided,
            paddingRight: "0",
          }),
          option: (provided) => ({
            ...provided,
            fontSize: "11px",
          }),
          control: (provided) => ({
            ...provided,
            boxShadow: "none",
          }),
          menu: (provided) => ({
            ...provided,
            zIndex: 9999,
            minWidth: "100px",
            width: "max-content",
          }),
        }}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary25: "#ff954fc4",
            primary: "#f97a29",
          },
        })}
      />

      <InputMask
        mask={phoneMask}
        className={`form-control phone-number-input ${isInvalid ? "is-invalid" : ""
          } ${inputClassName}`}
        name={phoneNumberName}
        onChange={handlePhoneNumberChange}
        onBlur={onBlur}
        value={phoneNumberValue}
        beforeMaskedValueChange={beforeMaskedValueChange}
        alwaysShowMask={false}
      />
    </div>
  );
};
