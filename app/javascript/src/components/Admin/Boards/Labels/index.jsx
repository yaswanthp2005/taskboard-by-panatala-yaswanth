import routes from "constants/routes";

import React, { useState } from "react";

import Container from "@bigbinary/neeto-molecules/Container";
import Header from "@bigbinary/neeto-molecules/Header";
import Scrollable from "@bigbinary/neeto-molecules/Scrollable";
import { useFetchBoard } from "components/hooks/reactQuery/useBoardsApi";
import { useFetchLabels } from "components/hooks/reactQuery/useLabelsApi";
import { Plus } from "neetoicons";
import { Button, NoData, Spinner, Typography } from "neetoui";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { buildURL } from "utils/buildURL";
import withTitle from "utils/withTitle";

import LabelsHeader from "./Header";
import LabelFormModal from "./LabelFormModal";
import LabelsList from "./List";

const Labels = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const {
    data: board,
    isError: isBoardError,
    isLoading: isBoardLoading,
  } = useFetchBoard(slug);

  const { data: labels = [], isLoading: isLabelsLoading } =
    useFetchLabels(slug);
  const [labelModal, setLabelModal] = useState(null);
  const [labelToDelete, setLabelToDelete] = useState(null);
  const isModalOpen = Boolean(labelModal);

  const handleOpenCreateModal = () => {
    setLabelModal({ mode: "create" });
  };

  const handleOpenEditModal = label => {
    setLabelModal({ mode: "edit", label });
  };

  const handleCloseModal = () => {
    setLabelModal(null);
  };

  const handleCloseDeleteAlert = () => {
    setLabelToDelete(null);
  };

  if (isBoardLoading || isLabelsLoading) {
    return (
      <Container className="flex min-h-screen items-center justify-center">
        <Spinner />
      </Container>
    );
  }

  if (isBoardError || !board) {
    return (
      <Container className="flex min-h-screen items-center justify-center">
        <Typography style="body1">{t("common.somethingWentWrong")}</Typography>
      </Container>
    );
  }

  const editingLabel = labelModal?.mode === "edit" ? labelModal.label : null;

  return (
    <Container isHeaderFixed>
      <Header
        title={t("labels.pageTitle")}
        breadcrumbs={[
          {
            text: t("boards.title"),
            link: routes.boards.index,
          },
          {
            text: board.name,
            link: buildURL({ path: routes.boards.show, slug: board.slug }),
          },
          {
            text: t("labels.title"),
          },
        ]}
      />
      <Scrollable className="flex w-full flex-col px-6 py-6" size="small">
        <div className="max-w-3xl">
          <LabelsHeader />
          {labels.length === 0 ? (
            <div className="flex flex-col items-center gap-y-4">
              <NoData title={t("labels.emptyState.title")} />
              <Button
                disabled={isModalOpen}
                icon={Plus}
                label={t("labels.addNewLabel")}
                style="link"
                onClick={handleOpenCreateModal}
              />
            </div>
          ) : (
            <LabelsList
              boardSlug={board.slug}
              isAddDisabled={isModalOpen}
              labelToDelete={labelToDelete}
              labels={labels}
              onAddLabel={handleOpenCreateModal}
              onCloseDeleteAlert={handleCloseDeleteAlert}
              onDelete={setLabelToDelete}
              onEdit={handleOpenEditModal}
            />
          )}
        </div>
      </Scrollable>
      <LabelFormModal
        boardSlug={board.slug}
        isOpen={isModalOpen}
        label={editingLabel}
        onClose={handleCloseModal}
      />
    </Container>
  );
};

export default withTitle(Labels, "labels.pageTitle");
