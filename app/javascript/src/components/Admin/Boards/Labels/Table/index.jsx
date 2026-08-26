import React, { useMemo } from "react";

import { useDeleteLabel } from "components/hooks/reactQuery/useLabelsApi";
import { NoData, Table } from "neetoui";
import { useTranslation } from "react-i18next";

import buildColumnData from "./columns";
import DeleteAlert from "./DeleteAlert";

const LabelsTable = ({
  boardSlug,
  currentPageNumber,
  handlePageChange,
  isLoading,
  labelToDelete,
  labels,
  onCloseDeleteAlert,
  onDelete,
  onEdit,
  pageSize,
  totalCount,
}) => {
  const { t } = useTranslation();
  const { mutateAsync: deleteLabel, isLoading: isDeleting } =
    useDeleteLabel(boardSlug);

  const columnData = useMemo(
    () => buildColumnData({ onDelete, onEdit, t }),
    [onDelete, onEdit, t]
  );

  const handleDeleteSubmit = async () => {
    if (!labelToDelete) {
      return;
    }

    await deleteLabel({ id: labelToDelete.id });
    onCloseDeleteAlert();
  };

  if (!isLoading && !labels.length) {
    return <NoData title={t("labels.emptyState.title")} />;
  }

  return (
    <>
      <Table
        allowRowClick={false}
        columnData={columnData}
        currentPageNumber={currentPageNumber}
        defaultPageSize={pageSize}
        enableColumnFreeze={false}
        enableColumnReorder={false}
        enableColumnResize={false}
        handlePageChange={handlePageChange}
        loading={isLoading}
        rowData={labels}
        rowKey="id"
        totalCount={totalCount}
      />
      <DeleteAlert
        isDeleting={isDeleting}
        labelToDelete={labelToDelete}
        onClose={onCloseDeleteAlert}
        onSubmit={handleDeleteSubmit}
      />
    </>
  );
};

export default LabelsTable;
