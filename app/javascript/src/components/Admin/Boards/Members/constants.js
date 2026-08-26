import { DEFAULT_PAGE_SIZE as SHARED_DEFAULT_PAGE_SIZE } from "constants/pagination";

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

const DEFAULT_PAGE_SIZE = SHARED_DEFAULT_PAGE_SIZE;

const COLUMN_KEYS = {
  NAME: "name",
  EMAIL: "email",
  ROLE: "role",
};

const buildMembersRequestParams = ({ limit, page }) => ({
  limit,
  page,
});

export {
  ADD_MEMBER_FORM_INITIAL_VALUES,
  ADD_MEMBER_FORM_VALIDATION_SCHEMA,
  buildMembersRequestParams,
  COLUMN_KEYS,
  DEFAULT_PAGE_SIZE,
  MEMBER_ROLES,
};
