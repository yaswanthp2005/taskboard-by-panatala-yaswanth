import React from "react";

import { FormikColorPicker } from "components/commons";
import { useCreateBoard } from "components/hooks/reactQuery/useBoardsApi";
import { Pane, Typography } from "neetoui";
import { Form as NeetoUIForm, Input } from "neetoui/formik";
import { useTranslation } from "react-i18next";
import camelToSnake from "utils/camelToSnake";

import {
  ADD_BOARD_FORM_INITIAL_VALUES,
  ADD_BOARD_FORM_VALIDATION_SCHEMA,
} from "./constants";
import Footer from "./Footer";

const AddBoardPane = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { mutateAsync: createBoard } = useCreateBoard();

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      await createBoard(camelToSnake(values));
      resetForm();
      onClose();
    } catch (error) {
      logger.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Pane closeButton closeOnEsc isOpen={isOpen} size="large" onClose={onClose}>
      <Pane.Header>
        <Typography style="h3" weight="semibold">
          {t("boards.createBoard")}
        </Typography>
      </Pane.Header>
      <NeetoUIForm
        className="w-full"
        key={isOpen ? "add-board-pane-open" : "add-board-pane-closed"}
        formikProps={{
          initialValues: ADD_BOARD_FORM_INITIAL_VALUES,
          validateOnMount: true,
          validationSchema: ADD_BOARD_FORM_VALIDATION_SCHEMA,
          onSubmit: handleSubmit,
        }}
      >
        <Pane.Body>
          <div className="flex w-full flex-col gap-y-4">
            <Input
              required
              className="w-full"
              label={t("boards.form.name")}
              name="name"
              placeholder={t("boards.form.namePlaceholder")}
            />
            <Input
              className="w-full"
              label={t("boards.form.description")}
              name="description"
              placeholder={t("boards.form.descriptionPlaceholder")}
            />
            <FormikColorPicker
              className="w-full"
              label={t("boards.form.color")}
              name="color"
            />
          </div>
        </Pane.Body>
        <Pane.Footer>
          <Footer onClose={onClose} />
        </Pane.Footer>
      </NeetoUIForm>
    </Pane>
  );
};

export default AddBoardPane;
