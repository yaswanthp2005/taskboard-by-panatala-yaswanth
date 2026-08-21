import React from "react";

import { NoData, Pagination, Spinner } from "neetoui";
import { useTranslation } from "react-i18next";

import BoardTile from "./BoardTile";

const BoardsGrid = ({
  boards,
  currentPageNumber,
  emptyStateTitle,
  handlePageChange,
  isLoading,
  pageSize,
  totalCount,
  onDelete,
  onOpen,
  onRename,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!boards.length) {
    return <NoData title={t(emptyStateTitle)} />;
  }

  return (
    <div className="flex flex-col gap-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {boards.map(board => (
          <BoardTile
            board={board}
            key={board.id}
            onDelete={onDelete}
            onOpen={onOpen}
            onRename={onRename}
          />
        ))}
      </div>
      {totalCount > pageSize && (
        <Pagination
          count={totalCount}
          navigate={handlePageChange}
          pageNo={currentPageNumber}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default BoardsGrid;
