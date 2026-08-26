import React from "react";

import BoardNavHeader from "./BoardNavHeader";
import BoardSubHeader from "./BoardSubHeader";

const BoardHeader = ({
  arePaneFiltersApplied,
  board,
  isAddingList,
  onAddList,
  onOpenFilters,
  onSearch,
  search,
  totalCards,
}) => (
  <div className="shrink-0">
    <BoardNavHeader board={board} />
    <BoardSubHeader
      arePaneFiltersApplied={arePaneFiltersApplied}
      isAddingList={isAddingList}
      search={search}
      totalCards={totalCards}
      onAddList={onAddList}
      onOpenFilters={onOpenFilters}
      onSearch={onSearch}
    />
  </div>
);

export default BoardHeader;
