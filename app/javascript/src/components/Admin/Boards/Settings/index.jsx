import routes from "constants/routes";

import React, { useState } from "react";

import BoardLayout from "components/Admin/Boards/Layout";
import { FormikColorPicker } from "components/commons";
import {
  useDeleteBoard,
  useUpdateBoard,
} from "components/hooks/reactQuery/useBoardsApi";
import { Typography } from "neetoui";
import { Form as NeetoUIForm, Input } from "neetoui/formik";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import withTitle from "utils/withTitle";

import {
  BOARD_SETTINGS_FORM_VALIDATION_SCHEMA,
  buildBoardSettingsFormInitialValues,
} from "./constants";
import DeleteBoardSection from "./DeleteBoardSection";
import FormActions from "./FormActions";
import ManageLinks from "./ManageLinks";

const SettingsContent = ({ board }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { mutateAsync: updateBoard } = useUpdateBoard();
  const { mutateAsync: deleteBoard, isLoading: isDeleting } = useDeleteBoard();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const savedValues = {
        name: values.name.trim(),
        color: values.color.trim(),
      };

      await updateBoard({
        slug: board.slug,
        ...savedValues,
      });
      resetForm({ values: savedValues, initialValues: savedValues });
    } catch (error) {
      logger.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBoard = async () => {
    try {
      await deleteBoard({ slug: board.slug });
      setIsDeleteAlertOpen(false);
      history.push(routes.boards.index);
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <div className="mb-8">
        <Typography style="h2" weight="semibold">
          {t("boardSettings.title")}
        </Typography>
        <Typography className="mt-2 text-gray-600" style="body2">
          {t("boardSettings.subtitle")}
        </Typography>
      </div>
      <div className="max-w-3xl">
        {board.isOwner && (
          <div className="mb-10">
            <Typography style="h3" weight="semibold">
              {t("boardSettings.general.title")}
            </Typography>
            <Typography className="mt-2 text-gray-600" style="body2">
              {t("boardSettings.general.subtitle")}
            </Typography>
            <NeetoUIForm
              className="mt-6"
              formikProps={{
                enableReinitialize: true,
                initialValues: buildBoardSettingsFormInitialValues(board),
                validationSchema: BOARD_SETTINGS_FORM_VALIDATION_SCHEMA,
                onSubmit: handleSubmit,
              }}
            >
              <div className="flex flex-col gap-y-6">
                <Input
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
                <FormActions />
              </div>
            </NeetoUIForm>
          </div>
        )}
        <ManageLinks canManageMembers={board.isOwner} slug={board.slug} />
        {board.isOwner && (
          <DeleteBoardSection
            board={board}
            isDeleteAlertOpen={isDeleteAlertOpen}
            isDeleting={isDeleting}
            onCloseDeleteAlert={() => setIsDeleteAlertOpen(false)}
            onDelete={handleDeleteBoard}
            onOpenDeleteAlert={() => setIsDeleteAlertOpen(true)}
          />
        )}
      </div>
    </>
  );
};

const Settings = () => (
  <BoardLayout>{board => <SettingsContent board={board} />}</BoardLayout>
);

export default withTitle(Settings, "boardSettings.pageTitle");
