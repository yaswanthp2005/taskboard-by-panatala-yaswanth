import { t } from "i18next";
import * as Yup from "yup";

const buildEditBoardFormInitialValues = board => ({
  color: board?.color || "",
  name: board?.name || "",
});

const EDIT_BOARD_FORM_VALIDATION_SCHEMA = Yup.object({
  color: Yup.string().trim(),
  name: Yup.string().trim().required(t("boards.validation.nameRequired")),
});

export { buildEditBoardFormInitialValues, EDIT_BOARD_FORM_VALIDATION_SCHEMA };
