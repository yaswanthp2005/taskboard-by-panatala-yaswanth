import { t } from "i18next";
import * as Yup from "yup";

export const LOGIN_FORM_INITIAL_VALUES = { email: "", password: "" };

export const SIGNUP_FORM_INITIAL_VALUES = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  passwordConfirmation: "",
};

export const LOGIN_FORM_VALIDATION_SCHEMA = Yup.object({
  email: Yup.string()
    .email(t("auth.validation.emailInvalid"))
    .required(t("auth.validation.emailRequired")),
  password: Yup.string().required(t("auth.validation.passwordRequired")),
});

export const SIGNUP_FORM_VALIDATION_SCHEMA = Yup.object({
  firstName: Yup.string().required(t("auth.validation.firstNameRequired")),
  lastName: Yup.string().required(t("auth.validation.lastNameRequired")),
  email: Yup.string()
    .email(t("auth.validation.emailInvalid"))
    .required(t("auth.validation.emailRequired")),
  password: Yup.string()
    .min(6, t("auth.validation.passwordMin"))
    .required(t("auth.validation.passwordRequired")),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], t("auth.validation.passwordsMustMatch"))
    .required(t("auth.validation.passwordConfirmationRequired")),
});
