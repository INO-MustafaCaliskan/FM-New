import Select from "react-select";

const extractText = (node) => {
  if (node === null || node === undefined) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && node?.props?.children !== undefined) {
    return extractText(node.props.children);
  }
  return "";
};

export const InoSelect = ({
  placeholder,
  defaultValue,
  value,
  defaultInputValue,
  onChange,
  isDisabled,
  options,
  label,
  name,
  onBlur,
  isInvalid,
  isSearchable = true,
}) => {
  return (
    <>
      {label && <label className="form-label">{label}</label>}
      <Select
        instanceId={name}
        isDisabled={isDisabled}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        isSearchable={isSearchable}
        options={options}
        getOptionLabel={(option) => option?.label ?? ""}
        getOptionValue={(option) => String(option?.value ?? "")}
        onChange={onChange}
        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
        menuPosition="fixed"
        onBlur={onBlur}
        defaultInputValue={defaultInputValue}
        defaultValue={defaultValue}
        formatOptionLabel={(option) => {
          if (option.countryCode) {
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img
                  src={
                    option.countryCode === "TRNC"
                      ? "/images/north-cyprus.png"
                      : `https://flagcdn.com/w20/${option.countryCode
                          .toLowerCase()
                          .slice(0, 2)}.png`
                  }
                  width={20}
                  height={15}
                />
                <span>{option.label}</span>
              </div>
            );
          }
          return <span>{option.label}</span>;
        }}
        filterOption={(option, inputValue) => {
          const query = (inputValue ?? "").toLowerCase();
          if (!query) return true;

          const rawLabel = option?.data?.label ?? option?.label;
          const labelText = extractText(rawLabel).toLowerCase();
          return labelText.includes(query);
        }}
        styles={{
          control: (baseStyles, state) => {
            if (state.isFocused) {
              baseStyles.boxShadow = null;
            }
            return baseStyles;
          },
          menu: (provider) => ({
            ...provider,
            zIndex: 99999,
          }),
          menuPortal: (provided) => ({
            ...provided,
            zIndex: 999999,
          }),
        }}
        className={`${isInvalid ? "is-invalid" : ""}`}
        classNames={{
          control: (state) =>
            `talk-select form-control ${isInvalid ? "is-invalid" : ""}`,
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
    </>
  );
};
