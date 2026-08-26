import { DEFAULT_PAGE_SIZE as SHARED_DEFAULT_PAGE_SIZE } from "constants/pagination";

import { t } from "i18next";
import * as Yup from "yup";

const LABEL_FORM_VALIDATION_SCHEMA = Yup.object({
  name: Yup.string().trim().required(t("labels.form.validation.nameRequired")),
  color: Yup.string()
    .trim()
    .required(t("labels.form.validation.colorRequired")),
});

const buildLabelFormInitialValues = label => ({
  name: label?.name || "",
  color: label?.color || "#4F46E5",
});

const DEFAULT_PAGE_SIZE = SHARED_DEFAULT_PAGE_SIZE;

const COLUMN_KEYS = {
  NAME: "name",
  COLOR: "color",
  ACTIONS: "actions",
};

const buildLabelsRequestParams = ({ limit, page }) => ({
  limit,
  page,
});

export {
  buildLabelFormInitialValues,
  buildLabelsRequestParams,
  COLUMN_KEYS,
  DEFAULT_PAGE_SIZE,
  LABEL_FORM_VALIDATION_SCHEMA,
};
