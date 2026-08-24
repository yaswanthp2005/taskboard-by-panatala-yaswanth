import { t } from "i18next";
import * as Yup from "yup";

const MEMBER_ROLES = {
  OWNER: "owner",
  MEMBER: "member",
};

const ADD_MEMBER_FORM_VALIDATION_SCHEMA = Yup.object({
  email: Yup.string()
    .trim()
    .email(t("members.form.validation.emailInvalid"))
    .required(t("members.form.validation.emailRequired")),
});

const ADD_MEMBER_FORM_INITIAL_VALUES = {
  email: "",
};

export {
  ADD_MEMBER_FORM_INITIAL_VALUES,
  ADD_MEMBER_FORM_VALIDATION_SCHEMA,
  MEMBER_ROLES,
};
