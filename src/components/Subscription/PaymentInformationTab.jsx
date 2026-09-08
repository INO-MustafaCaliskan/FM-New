import React, { useEffect, useState } from "react";
import client from "@/utils/client";
import { useFormik } from "formik";
import { Form, FormControl, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { InoSelect } from "../UI/InoSelect";
import { CountrySelect } from "../UI/CountrySelect";
import { getCities } from "@/utils/apiActions";
import InoButton from "../Buttons/InoButton";

export const PaymentInformationTab = () => {
  const [cities, setCities] = useState([]);   
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchCities = (countryId) => {
    getCities(countryId).then((cities) => {
      setCities(
        cities.map((city) => ({
          value: city.id,
          label: city.name,
        }))
      );
    });
  };

  const fetchData = () => {
    setLoading(true);
    client
      .get("User/GetLoginUserBillingAddress")
      .then((response) => {
        setPageData(response.data.data);
        fetchCities(response.data.data.billingCountryId);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      billingCountryId: pageData?.billingCountryId || "",
      billingCityId: pageData?.billingCityId || "",
      taxOffice: pageData?.taxOffice || "",
      taxNumber: pageData?.taxNumber || "",
      billTo: pageData?.billTo || "",
      billingAddress: pageData?.billingAddress || "",
    },
    onSubmit: async (values) => {
    setUpdating(true);
      try {
        const response = await client.post(
          "/User/UpdateLoginUserBillingAddress",
          values
        );
        toast.success("Billing information updated successfully!");
      } catch (error) {
        console.log(error.response.data.message)
      } finally{
        setUpdating(false);
      }
    },
    enableReinitialize: true,
  });

  if(loading || !pageData) {
    return <div className='d-flex justify-content-center align-items-center p-5'><CircularProgress /></div>
}

  return (
    <div style={{minHeight : 500}}>
      <p className="mt-4">
        * On your credit card transaction slip, you may see recipient as either
        "Freight Talk" or "INO Ulus Nak. Org. Ltd. Şti."
      </p>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-12 col-md-3">
            <div className="form-group">
              <CountrySelect 
                label="Country"
                name="billingCountryId"
                onChange={async (option) => {
                  formik.setFieldValue("billingCountryId", option.value);
                  formik.setFieldValue("billingCityId", undefined);
                  await fetchCities(option.value);
                }}
                value={formik.values.billingCountryId}
                onBlur={formik.handleBlur}
                defaultInputValue={formik.initialValues.billingCountryId}
              />
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="form-group">
                <InoSelect
                  label="City"
                  name="billingCityId"
                  onChange={async (option) => {
                    formik.setFieldValue("billingCityId", option.value);
                  }}
                  options={cities}
                  onBlur={formik.handleBlur}
                  value={cities.find((ct) => ct.value === formik.values.billingCityId) || ""}
                />
                </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="form-group">
              <Form.Label>Tax Office</Form.Label>
              <FormControl
                type="text"
                name="taxOffice"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.taxOffice}
              />
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="form-group">
              <Form.Label>Tax Number</Form.Label>
              <FormControl
                type="text"
                name="taxNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.taxNumber}
              />
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="form-group">
              <Form.Label>Bill To</Form.Label>
              <FormControl
                type="text"
                name="billTo"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.billTo}
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <Form.Label>Billing Adress</Form.Label>
              <FormControl
                type="text"
                name="billingAddress"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.billingAddress}
              />
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="form-group">
                <InoButton
                    type="submit"
                    className="mt-2 mt-md-3 "
                    width="100%"
                    height="3rem"
                    disabled={updating}
                    isLoading={updating}
                >
                Save and Update
                </InoButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
