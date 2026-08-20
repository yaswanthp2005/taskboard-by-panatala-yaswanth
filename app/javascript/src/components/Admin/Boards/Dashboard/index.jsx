import routes from "constants/routes";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Container } from "components/commons";
import useFuncDebounce from "components/hooks/useFuncDebounce";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { buildURL } from "utils/buildURL";
import withTitle from "utils/withTitle";

import AddBoardPane from "./AddBoardPane";
import Header from "./Header";
import useBoardsTable from "./hooks/useBoardsTable";
import BoardsTable from "./Table";
import buildColumnData from "./Table/columns";
import { getEmptyStateTitleKey } from "./utils";

const Dashboard = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    boards,
    currentPageNumber,
    handlePageChange,
    isLoading,
    pageSize,
    rowData,
    search,
    totalCount,
  } = useBoardsTable();

  const [searchKey, setSearchKey] = useState(search);
  const [isAddBoardPaneOpen, setIsAddBoardPaneOpen] = useState(false);

  useEffect(() => {
    setSearchKey(search);
  }, [search]);

  const replaceQueryParams = useCallback(
    params => {
      history.replace(buildURL({ path: routes.boards.index, ...params }));
    },
    [history]
  );

  const debouncedSearch = useFuncDebounce(value => {
    replaceQueryParams({
      page: null,
      search: value,
    });
  });

  const columnData = useMemo(() => buildColumnData({ t }), [t]);
  const emptyStateTitle = getEmptyStateTitleKey(search);

  return (
    <Container>
      <Header
        search={searchKey}
        onAddBoard={() => setIsAddBoardPaneOpen(true)}
        onSearch={value => {
          setSearchKey(value);
          debouncedSearch(value);
        }}
      />
      <BoardsTable
        boards={boards}
        columnData={columnData}
        currentPageNumber={currentPageNumber}
        emptyStateTitle={emptyStateTitle}
        handlePageChange={handlePageChange}
        isLoading={isLoading}
        pageSize={pageSize}
        rowData={rowData}
        totalCount={totalCount}
      />
      <AddBoardPane
        isOpen={isAddBoardPaneOpen}
        onClose={() => setIsAddBoardPaneOpen(false)}
      />
    </Container>
  );
};

export default withTitle(Dashboard, "boards.pageTitle");
