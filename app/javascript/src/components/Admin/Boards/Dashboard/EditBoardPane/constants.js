import { t } from "i18next";
import * as Yup from "yup";

const buildEditBoardFormInitialValues = board => ({
  name: board?.name || "",
});

const EDIT_BOARD_FORM_VALIDATION_SCHEMA = Yup.object({
  name: Yup.string().trim().required(t("boards.validation.nameRequired")),
});

export { buildEditBoardFormInitialValues, EDIT_BOARD_FORM_VALIDATION_SCHEMA };
