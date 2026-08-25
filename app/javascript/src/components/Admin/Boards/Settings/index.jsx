import routes from "constants/routes";

import React, { useState } from "react";

import Container from "@bigbinary/neeto-molecules/Container";
import Scrollable from "@bigbinary/neeto-molecules/Scrollable";
import BoardNavHeader from "components/Admin/Boards/Show/BoardNavHeader";
import {
  useDeleteBoard,
  useFetchBoard,
  useUpdateBoard,
} from "components/hooks/reactQuery/useBoardsApi";
import Sidebar from "components/Sidebar";
import { Spinner, Typography } from "neetoui";
import { Form as NeetoUIForm, Input } from "neetoui/formik";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import withTitle from "utils/withTitle";

import {
  BOARD_SETTINGS_FORM_VALIDATION_SCHEMA,
  buildBoardSettingsFormInitialValues,
} from "./constants";
import DeleteBoardSection from "./DeleteBoardSection";
import FormActions from "./FormActions";
import ManageLinks from "./ManageLinks";

const Settings = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { slug } = useParams();
  const {
    data: board,
    isError: isBoardError,
    isLoading: isBoardLoading,
  } = useFetchBoard(slug);

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
      history.push(routes.boards.index);
    } catch (error) {
      logger.error(error);
    }
  };

  if (isBoardLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isBoardError || !board) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Typography style="body1">{t("common.somethingWentWrong")}</Typography>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Container
          isHeaderFixed
          className="!h-full min-h-0 flex-1 !overflow-hidden"
        >
          <BoardNavHeader board={board} />
          <Scrollable className="flex min-h-0 flex-1 flex-col" size="medium">
            <div className="px-5 py-6 lg:px-10">
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
                        initialValues:
                          buildBoardSettingsFormInitialValues(board),
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
                        <Input
                          className="w-full"
                          label={t("boards.form.color")}
                          name="color"
                          placeholder={t("boards.form.colorPlaceholder")}
                        />
                        <FormActions />
                      </div>
                    </NeetoUIForm>
                  </div>
                )}
                <ManageLinks
                  canManageMembers={board.isOwner}
                  slug={board.slug}
                />
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
            </div>
          </Scrollable>
        </Container>
      </main>
    </div>
  );
};

export default withTitle(Settings, "boardSettings.pageTitle");
