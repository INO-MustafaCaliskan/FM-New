import React, { useEffect, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import client from "@/utils/client";
import InoLoading from "@/components/InoLoading/InoLoading.jsx";
import { toast } from "react-toastify";
import { UploadImage } from "./UploadImage";
import { MyCompanyFormScheme } from "@/validation/ValidationSchemes";

const MyCompanyForm = () => {
  const [myCompany, setMyCompany] = useState({
    name: "",
    website: "",
    imageUrl: "",
    introduction: "",
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await client.get("/Company/GetCompanyForLoginUser");
        const responseData = response.data.data;
        if (isMounted) {
          setMyCompany({
            ...responseData,
            introduction: responseData.introduction || "",
          });
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching user details:", error);
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const response = await client.post(
        "/Company/UpdateCompanyForLoginUser",
        values
      );

      setLoading(false);
      toast.success("Your company settings have been successfully updated.");
    } catch (error) {
      console.error("Error updating company details:", error);
      toast.error("Error changing Your company settings. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateCompanyLogo = async (imageUrl) => {
    try {
      await client.post(
        "/Company/UpdateCompanyLogoForLoginUser",
        { imageUrl }
      );
    } catch (error) {
      console.error("Error updating company logo:", error);
      toast.error("Error saving image");
    }
  };

  if (isLoading) {
    return <InoLoading />;
  }

  return (
    <>
      <div className="settings__content myCompany__settings">
        <Formik
          initialValues={{
            name: myCompany.name,
            website: myCompany.website,
            introduction: myCompany.introduction,
          }}
          // validationSchema={MyCompanyFormScheme}
          onSubmit={handleSubmit}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
            isSubmitting,
            isValid,
          }) => (
            <Form
              className="form needs-validation account-Form"
              encType="multipart/form-data"
              id="accountsettings_main"
              onSubmit={handleSubmit}
            >
              <div className="form-row">
                <div className="account-settings-image form-group">
                  <UploadImage  defaultImageUrl={myCompany.imageUrl} uploadType="companyImage" uploadCallback={updateCompanyLogo} />
                </div>
                <div className="form-group ">
                  <Form.Label className="form-label">Company Name</Form.Label>
                  <Field
                    type="text"
                    id="company-name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-control talk-form-control ${
                      touched.name && errors.name ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <Form.Label className="form-label">Website</Form.Label>
                  <Field
                    type="text"
                    id="website"
                    name="website"
                    value={values.website}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-control talk-form-control ${
                      touched.website && errors.website ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="website"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group form-group--full enter-100 mb-0 form-text-area">
                  <Form.Label className="form-label">
                    Enter Company Introduction Below
                  </Form.Label>
                  <Field
                    maxLength="1000"
                    as="textarea"
                    rows={5}
                    name="introduction"
                    id="company-introduction"
                    value={values.introduction}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-control  ${
                      touched.introduction && errors.introduction
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="introduction"
                    component="div"
                    className="invalid-feedback"
                  />
                  <div className="col-md-4 mt-3">
                    <div className="total-character-area">
                      Total Characters:{" "}
                      <span className="total-count" data-type="biography">
                        {values.introduction.length}/1000
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-row d-flex justify-content-end">
                <div>
                  <Button
                    type="submit"
                    className="talk-button mt-4"
                    disabled={loading || isSubmitting || !isValid}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        {" "}Save and Update
                      </>
                    ) : (
                      "Save and Update"
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default MyCompanyForm;
