import routes from "constants/routes";

import React, { useCallback, useEffect, useState } from "react";

import { Container } from "components/commons";
import { useDeleteBoard } from "components/hooks/reactQuery/useBoardsApi";
import useFuncDebounce from "components/hooks/useFuncDebounce";
import { useHistory } from "react-router-dom";
import { buildURL } from "utils/buildURL";
import withTitle from "utils/withTitle";

import AddBoardPane from "./AddBoardPane";
import DeleteAlert from "./Alerts/DeleteAlert";
import EditBoardPane from "./EditBoardPane";
import BoardsGrid from "./Grid";
import DashboardHeader from "./Header";
import useBoardsTable from "./hooks/useBoardsTable";
import { getEmptyStateTitleKey } from "./utils";

const Dashboard = () => {
  const history = useHistory();
  const {
    boards,
    currentPageNumber,
    handlePageChange,
    isLoading,
    pageSize,
    search,
    totalCount,
  } = useBoardsTable();

  const { mutateAsync: deleteBoard, isLoading: isDeleting } = useDeleteBoard();

  const [searchKey, setSearchKey] = useState(search);
  const [isAddBoardPaneOpen, setIsAddBoardPaneOpen] = useState(false);
  const [boardToEdit, setBoardToEdit] = useState(null);
  const [boardToDelete, setBoardToDelete] = useState(null);

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

  const emptyStateTitle = getEmptyStateTitleKey(search);

  const handleDeleteBoard = async () => {
    if (!boardToDelete) {
      return;
    }

    try {
      await deleteBoard({ slug: boardToDelete.slug });
      setBoardToDelete(null);
    } catch (error) {
      logger.error(error);
    }
  };

  const handleOpenBoard = board => {
    history.push(routes.boards.show.replace(":slug", board.slug));
  };

  return (
    <Container>
      <DashboardHeader
        search={searchKey}
        onAddBoard={() => setIsAddBoardPaneOpen(true)}
        onSearch={value => {
          setSearchKey(value);
          debouncedSearch(value);
        }}
      />
      <BoardsGrid
        boards={boards}
        currentPageNumber={currentPageNumber}
        emptyStateTitle={emptyStateTitle}
        handlePageChange={handlePageChange}
        isLoading={isLoading}
        pageSize={pageSize}
        totalCount={totalCount}
        onDelete={setBoardToDelete}
        onOpen={handleOpenBoard}
        onRename={setBoardToEdit}
      />
      <AddBoardPane
        isOpen={isAddBoardPaneOpen}
        onClose={() => setIsAddBoardPaneOpen(false)}
      />
      <EditBoardPane
        board={boardToEdit}
        isOpen={Boolean(boardToEdit)}
        onClose={() => setBoardToEdit(null)}
      />
      <DeleteAlert
        boardToDelete={boardToDelete}
        isDeleting={isDeleting}
        onClose={() => setBoardToDelete(null)}
        onSubmit={handleDeleteBoard}
      />
    </Container>
  );
};

export default withTitle(Dashboard, "boards.pageTitle");
