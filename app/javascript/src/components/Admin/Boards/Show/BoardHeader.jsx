import React from "react";

import PropTypes from "prop-types";

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

BoardHeader.propTypes = {
  arePaneFiltersApplied: PropTypes.bool,
  board: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  isAddingList: PropTypes.bool,
  onAddList: PropTypes.func.isRequired,
  onOpenFilters: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  search: PropTypes.string,
  totalCards: PropTypes.number.isRequired,
};

BoardHeader.defaultProps = {
  arePaneFiltersApplied: false,
  isAddingList: false,
  search: "",
};

export default BoardHeader;
