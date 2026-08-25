import React from "react";

import PropTypes from "prop-types";

import BoardNavHeader from "./BoardNavHeader";
import BoardSubHeader from "./BoardSubHeader";

const BoardHeader = ({
  board,
  isAddingList,
  onAddList,
  onSearch,
  search,
  totalCards,
}) => (
  <div className="shrink-0">
    <BoardNavHeader board={board} />
    <BoardSubHeader
      isAddingList={isAddingList}
      search={search}
      totalCards={totalCards}
      onAddList={onAddList}
      onSearch={onSearch}
    />
  </div>
);

BoardHeader.propTypes = {
  board: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  isAddingList: PropTypes.bool,
  onAddList: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  search: PropTypes.string,
  totalCards: PropTypes.number.isRequired,
};

BoardHeader.defaultProps = {
  isAddingList: false,
  search: "",
};

export default BoardHeader;
