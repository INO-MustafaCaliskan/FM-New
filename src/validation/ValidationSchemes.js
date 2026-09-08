import * as Yup from 'yup';

export const MyDetailFormScheme =  Yup.object().shape({
    firstName: Yup.string()
    .trim()
    .max(20,"First name must be 20 characters or less")
    .required("First Name is required"),
    lastName: Yup.string()
    .trim()
    .max(20,"Last name must be 20 characters or less")
    .required("Last Name is required"),
    email: Yup.string()
    .trim()
    .email("Please enter a valid email")
    .required("Email is required"),
    // mobileNumber: Yup.string().required("Mobile Number is required"),
    // mobileNumberCountryCode: Yup.string().required(
    //   "Mobile Number Country Code is required"
    // ),
    birthday: Yup.date(),
    // .typeError('Birthday must be a valid date')
    // .required("Birthday is required"),
    // timeZone: Yup.string().required("Time Zone is required"),
    biography: Yup.string()
     .trim()
     .max(1000, "Biography must be 1000 characters or less"),
    // .required("Biography is required"),
    // categoryId: Yup.string().required("Category is required"),
    // cityId: Yup.string().required("City is required"),
    // countryId: Yup.string().required("Country is required"),
    // jobTitleId: Yup.string().required("Job Title is required"),
  });

export const MyCompanyFormScheme = Yup.object().shape({
    companyName: Yup.string()
    .trim()
    .max(80,"Company name must be less than 80 characters"),
    website: Yup.string()
    .trim()
    .transform((value) => {
      if (!value) return value;
      const trimmed = value.trim();
      if (/^https?:\/\//i.test(trimmed)) return trimmed;
      return `https://${trimmed}`;
    })
    .url("Please enter a valid website URL"),
  });

export const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters")
      .notOneOf([Yup.ref('currentPassword'), null], "New password cannot be the same as the current password")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&#.,-]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .test("match", "Passwords must match", function (value) {
        return this.parent.newPassword === value;
      }),
  });


export const SignupFormScheme = Yup.object({
    firstName: Yup.string().required("Please enter your first name."),
    lastName: Yup.string().required("Please enter your last name."),
    email: Yup.string()
      .email("Invalid email format")
      .required("Please enter your email."),
    password: Yup.string()
      .required("Please enter your pasword.")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>_-]/,
        "Password must contain at least one special character"
      ),
    passwordRetry: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password."),
    termsAccepted: Yup.bool().oneOf(
      [true],
      "You must agree before submitting."
    ),
    gdprAccepted: Yup.bool().oneOf([true], "You must agree before submitting."),
  });


export const ContactUsFormScheme = Yup.object().shape({
    firstName: Yup.string().required("Please enter your first name."),
    lastName: Yup.string().required("Please enter your last name."),
    companyName: Yup.string().required("Please enter your company name."),
    businessEmail: Yup.string()
      .email("Please enter a valid email.")
      .required("Please enter your email."),
    mobileNumber: Yup.string().required("Please enter your mobile number."),
    countryId: Yup.string().required("Please select your country."),
    subject: Yup.string().required("Please enter your subject."),
    message: Yup.string().required("Please enter your message."),
    termsAccepted: Yup.bool().oneOf(
      [true],
      "You must agree before submitting."
    ),
  });