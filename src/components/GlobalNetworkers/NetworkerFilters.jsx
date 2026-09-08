import React, { useEffect, useState } from "react";
import { getCountries, getCategories } from "@/utils/apiActions";
import InoButton from "../Buttons/InoButton";
import { InoSelect } from "../UI/InoSelect";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NetworkerFilters = ({ setFilters, clearFilters, filters }) => {
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [generalSearch, setGeneralSearch] = useState(filters.generalSearch);
  const [selectedCountry, setSelectedCountry] = useState(filters.country);
  const [selectedCategory, setSelectedCategory] = useState(filters.category);

  const onSetFilters = () => {
    setFilters({
      country: selectedCountry?.value,
      category: selectedCategory?.value,
      generalSearch: generalSearch || null,
    });
  };

  const onClearFilters = () => {
    setSelectedCountry(null);
    setSelectedCategory(null);
    setGeneralSearch(null);
    clearFilters();
  };
  const fetchCountries = () => {
    getCountries().then((countries) => {
      setCountries(
        countries.map((country) => ({
          value: country.id,
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`https://flagcdn.com/w20/${country.countryCode.toLowerCase()}.png`}
                alt={country.name}
                style={{
                  marginRight: 8,
                  width: 20,
                  height: 15,
                  objectFit: "cover",
                }}
              />
              <span>{country.name}</span>
            </div>
          ),
        }))
      );
    });
  };

  const fetchCategories = () => {
    getCategories().then((categories) => {
      setCategories(
        categories.map((country) => {
          return { value: country.id, label: country.name };
        })
      );
    });
  };

  useEffect(() => {
    fetchCountries();
    fetchCategories();
  }, []);

  return (
    <section className="filter-section mb-3 mt-3">
   
      <div className="row  align-items-end">
        <div className="col-lg-9 col-md-12">
          <div className="row">
            <div className="col-12 col-md-4 ">
              <InoSelect
                label="Search by Country"
                placeholder="Select Country"
                value={selectedCountry}
                onChange={(data) => setSelectedCountry(data)}
                options={countries}
              />
            </div>
            <div className="col-12 col-md-4">
              <InoSelect
                label="Search by Category"
                placeholder="Select Category"
                value={selectedCategory}
                onChange={(data) => setSelectedCategory(data)}
                options={categories}
              />
            </div>
            <div className="col-12 col-md-4">
              <div>
                <label className="form-label">Search Term</label>
                <input
                  onChange={(e) => setGeneralSearch(e.target.value)}
                  type="text"
                  value={generalSearch || ""}
                  placeholder="Enter FTalk ID, Company Name or User Name"
                  className="talk-form-control form-control"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-12">
          <div className="d-flex flex-row gap-2 network-filter-btn mt-3 mt-lg-0">
            <InoButton title="Search" onClick={onSetFilters} />
            <InoButton isOutline title="Clear" onClick={onClearFilters} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkerFilters;
