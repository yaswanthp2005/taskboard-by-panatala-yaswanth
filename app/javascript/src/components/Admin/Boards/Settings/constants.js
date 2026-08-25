import { t } from "i18next";
import * as Yup from "yup";

const buildBoardSettingsFormInitialValues = board => ({
  name: board?.name || "",
  color: board?.color || "",
});

const BOARD_SETTINGS_FORM_VALIDATION_SCHEMA = Yup.object({
  name: Yup.string().trim().required(t("boards.validation.nameRequired")),
  color: Yup.string().trim(),
});

export {
  BOARD_SETTINGS_FORM_VALIDATION_SCHEMA,
  buildBoardSettingsFormInitialValues,
};
