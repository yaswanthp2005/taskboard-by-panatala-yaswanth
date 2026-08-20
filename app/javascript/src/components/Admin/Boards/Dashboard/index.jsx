import React, { useMemo } from "react";

import { Container } from "components/commons";
import { Typography } from "neetoui";
import { useTranslation } from "react-i18next";
import withTitle from "utils/withTitle";

import useBoardsTable from "./hooks/useBoardsTable";
import BoardsTable from "./Table";
import buildColumnData from "./Table/columns";

const Dashboard = () => {
  const { t } = useTranslation();
  const {
    boards,
    currentPageNumber,
    handlePageChange,
    isLoading,
    pageSize,
    rowData,
    totalCount,
  } = useBoardsTable();

  const columnData = useMemo(() => buildColumnData({ t }), [t]);

  return (
    <Container>
      <div className="mb-6 flex flex-col gap-y-2">
        <Typography style="h2" weight="semibold">
          {t("boards.title")}
        </Typography>
        <Typography style="body2">{t("boards.subtitle")}</Typography>
      </div>
      <BoardsTable
        boards={boards}
        columnData={columnData}
        currentPageNumber={currentPageNumber}
        handlePageChange={handlePageChange}
        isLoading={isLoading}
        pageSize={pageSize}
        rowData={rowData}
        totalCount={totalCount}
      />
    </Container>
  );
};

export default withTitle(Dashboard, "boards.pageTitle");
