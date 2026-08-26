import React, { useState } from "react";

import Container from "@bigbinary/neeto-molecules/Container";
import Scrollable from "@bigbinary/neeto-molecules/Scrollable";
import BoardNavHeader from "components/Admin/Boards/Show/BoardNavHeader";
import { useFetchBoard } from "components/hooks/reactQuery/useBoardsApi";
import Sidebar from "components/Sidebar";
import { Spinner, Typography } from "neetoui";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import withTitle from "utils/withTitle";

import LabelsHeader from "./Header";
import useLabelsTable from "./hooks/useLabelsTable";
import LabelFormModal from "./LabelFormModal";
import LabelsTable from "./Table";

const Labels = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const {
    data: board,
    isError: isBoardError,
    isLoading: isBoardLoading,
  } = useFetchBoard(slug);

  const {
    currentPageNumber,
    handlePageChange,
    isLoading: isLabelsLoading,
    labels,
    pageSize,
    totalCount,
  } = useLabelsTable();

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

  const editingLabel = labelModal?.mode === "edit" ? labelModal.label : null;

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
              <LabelsHeader
                isAddDisabled={isModalOpen}
                onAddLabel={handleOpenCreateModal}
              />
              <LabelsTable
                boardSlug={board.slug}
                currentPageNumber={currentPageNumber}
                handlePageChange={handlePageChange}
                isLoading={isLabelsLoading}
                labelToDelete={labelToDelete}
                labels={labels}
                pageSize={pageSize}
                totalCount={totalCount}
                onCloseDeleteAlert={handleCloseDeleteAlert}
                onDelete={setLabelToDelete}
                onEdit={handleOpenEditModal}
              />
            </div>
          </Scrollable>
        </Container>
      </main>
      <LabelFormModal
        boardSlug={board.slug}
        isOpen={isModalOpen}
        label={editingLabel}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default withTitle(Labels, "labels.pageTitle");
