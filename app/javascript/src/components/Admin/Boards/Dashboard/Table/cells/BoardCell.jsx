import React from "react";

import { Tooltip, Typography } from "neetoui";

import { formatBoardUpdatedAt, getTruncatedText } from "../../utils";

const BoardCell = ({ board }) => {
  const { displayText: description, isTruncated } = getTruncatedText(
    board.description
  );

  const descriptionElement = (
    <Typography className="text-gray-600" style="body2">
      {description}
    </Typography>
  );

  return (
    <div className="flex flex-col gap-y-1 py-1">
      <Typography style="h4" weight="semibold">
        {board.name}
      </Typography>
      {isTruncated ? (
        <Tooltip content={board.description}>{descriptionElement}</Tooltip>
      ) : (
        descriptionElement
      )}
      <Typography className="text-gray-500" style="body3">
        {formatBoardUpdatedAt(board.updatedAt)}
      </Typography>
    </div>
  );
};

export default BoardCell;
