import React from "react";

import { FormikColorPicker } from "components/commons";
import { useUpdateBoard } from "components/hooks/reactQuery/useBoardsApi";
import { Pane, Typography } from "neetoui";
import { Form as NeetoUIForm, Input } from "neetoui/formik";
import { useTranslation } from "react-i18next";

import {
  buildEditBoardFormInitialValues,
  EDIT_BOARD_FORM_VALIDATION_SCHEMA,
} from "./constants";
import Footer from "./Footer";

const EditBoardPane = ({ board, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { mutateAsync: updateBoard } = useUpdateBoard();

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      await updateBoard({
        slug: board.slug,
        name: values.name.trim(),
        color: values.color.trim(),
      });
      resetForm();
      onClose();
    } catch (error) {
      logger.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!board) {
    return null;
  }

  return (
    <Pane closeButton closeOnEsc isOpen={isOpen} size="large" onClose={onClose}>
      <Pane.Header>
        <Typography style="h3" weight="semibold">
          {t("boards.renameBoard")}
        </Typography>
      </Pane.Header>
      <NeetoUIForm
        className="w-full"
        key={isOpen ? `edit-board-${board.slug}` : "edit-board-closed"}
        formikProps={{
          initialValues: buildEditBoardFormInitialValues(board),
          validateOnMount: true,
          validationSchema: EDIT_BOARD_FORM_VALIDATION_SCHEMA,
          onSubmit: handleSubmit,
        }}
      >
        <Pane.Body>
          <div className="flex w-full flex-col gap-y-4">
            <Input
              autoFocus
              required
              className="w-full"
              label={t("boards.form.name")}
              name="name"
              placeholder={t("boards.form.namePlaceholder")}
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

export default EditBoardPane;
