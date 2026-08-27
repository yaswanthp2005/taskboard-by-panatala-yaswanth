import React, { useState } from "react";

import BoardLayout from "components/Admin/Boards/Layout";
import withTitle from "utils/withTitle";

import LabelsHeader from "./Header";
import useLabelsTable from "./hooks/useLabelsTable";
import LabelFormModal from "./LabelFormModal";
import LabelsTable from "./Table";

const LabelsContent = ({ board }) => {
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

  const editingLabel = labelModal?.mode === "edit" ? labelModal.label : null;

  return (
    <>
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
      <LabelFormModal
        boardSlug={board.slug}
        isOpen={isModalOpen}
        label={editingLabel}
        onClose={handleCloseModal}
      />
    </>
  );
};

const Labels = () => (
  <BoardLayout>{board => <LabelsContent board={board} />}</BoardLayout>
);

export default withTitle(Labels, "labels.pageTitle");
