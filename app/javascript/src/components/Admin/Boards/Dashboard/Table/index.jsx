import React from "react";

import { NoData, Table } from "neetoui";
import { useTranslation } from "react-i18next";

const BoardsTable = ({
  boards,
  columnData,
  currentPageNumber,
  emptyStateTitle,
  handlePageChange,
  isLoading,
  pageSize,
  rowData,
  totalCount,
}) => {
  const { t } = useTranslation();

  if (!isLoading && !boards.length) {
    return <NoData title={t(emptyStateTitle)} />;
  }

  return (
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
      rowData={rowData}
      rowKey="id"
      totalCount={totalCount}
    />
  );
};

export default BoardsTable;
