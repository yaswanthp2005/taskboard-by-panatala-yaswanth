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

export { buildLabelFormInitialValues, LABEL_FORM_VALIDATION_SCHEMA };
