import { t } from "i18next";
import * as Yup from "yup";

const ADD_BOARD_FORM_INITIAL_VALUES = {
  color: "",
  name: "",
  description: "",
};

const ADD_BOARD_FORM_VALIDATION_SCHEMA = Yup.object({
  color: Yup.string().trim(),
  name: Yup.string().trim().required(t("boards.validation.nameRequired")),
  description: Yup.string().trim(),
});

export { ADD_BOARD_FORM_INITIAL_VALUES, ADD_BOARD_FORM_VALIDATION_SCHEMA };
