import { t } from "i18next";
import * as Yup from "yup";

const buildCardDetailFormInitialValues = card => ({
  assigneeIds: card?.assignees?.map(assignee => assignee.id) || [],
  description: card?.description || "",
  dueDate: card?.dueDate || null,
  isComplete: card?.isComplete ?? false,
  labelIds: card?.labels?.map(label => label.id) || [],
  title: card?.title || "",
});

const CARD_DETAIL_FORM_VALIDATION_SCHEMA = Yup.object({
  assigneeIds: Yup.array().of(Yup.string()),
  description: Yup.string(),
  dueDate: Yup.mixed().nullable(),
  isComplete: Yup.boolean(),
  labelIds: Yup.array().of(Yup.string()),
  title: Yup.string().trim().required(t("cardDetail.validation.titleRequired")),
});

export { buildCardDetailFormInitialValues, CARD_DETAIL_FORM_VALIDATION_SCHEMA };
