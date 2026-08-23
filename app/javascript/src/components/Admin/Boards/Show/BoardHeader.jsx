import React from "react";

import PropTypes from "prop-types";

import BoardNavHeader from "./BoardNavHeader";
import BoardSubHeader from "./BoardSubHeader";

const BoardHeader = ({ board, isAddingList, onAddList, totalCards }) => (
  <div className="shrink-0">
    <BoardNavHeader board={board} />
    <BoardSubHeader
      isAddingList={isAddingList}
      totalCards={totalCards}
      onAddList={onAddList}
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
  totalCards: PropTypes.number.isRequired,
};

BoardHeader.defaultProps = {
  isAddingList: false,
};

export default BoardHeader;
