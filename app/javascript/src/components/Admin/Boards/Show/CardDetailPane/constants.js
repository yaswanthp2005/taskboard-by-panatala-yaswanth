import { t } from "i18next";
import * as Yup from "yup";

const buildCardDetailFormInitialValues = card => ({
  title: card?.title || "",
  description: card?.description || "",
  dueDate: card?.dueDate || null,
  labelIds: card?.labels?.map(label => label.id) || [],
});

const CARD_DETAIL_FORM_VALIDATION_SCHEMA = Yup.object({
  title: Yup.string().trim().required(t("cardDetail.validation.titleRequired")),
  description: Yup.string(),
  dueDate: Yup.mixed().nullable(),
  labelIds: Yup.array().of(Yup.string()),
});

export { buildCardDetailFormInitialValues, CARD_DETAIL_FORM_VALIDATION_SCHEMA };
