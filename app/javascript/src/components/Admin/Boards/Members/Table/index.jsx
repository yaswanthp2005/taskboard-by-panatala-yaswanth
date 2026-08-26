import React, { useMemo } from "react";

import { NoData, Table } from "neetoui";
import { useTranslation } from "react-i18next";

import buildColumnData from "./columns";

const MembersTable = ({
  currentPageNumber,
  handlePageChange,
  isLoading,
  members,
  pageSize,
  totalCount,
}) => {
  const { t } = useTranslation();
  const columnData = useMemo(() => buildColumnData({ t }), [t]);

  if (!isLoading && !members.length) {
    return <NoData title={t("members.emptyState.title")} />;
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
      rowData={members}
      rowKey="id"
      totalCount={totalCount}
    />
  );
};

export default MembersTable;
