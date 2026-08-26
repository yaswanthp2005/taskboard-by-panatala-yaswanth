import React from "react";

import ActionsDropdown from "./ActionsDropdown";
import BoardCell from "./cells/BoardCell";
import ColorCell from "./cells/ColorCell";

import { COLUMN_KEYS } from "../constants";

const buildColumnData = ({ onDelete, onRename, t }) => [
  {
    title: t("boards.table.board"),
    dataIndex: "name",
    key: COLUMN_KEYS.BOARD,
    ellipsis: false,
    render: (_, board) => <BoardCell board={board} />,
  },
  {
    title: t("boards.table.color"),
    dataIndex: "color",
    key: COLUMN_KEYS.COLOR,
    width: 180,
    render: color => <ColorCell color={color} />,
  },
  {
    dataIndex: "actions",
    fixed: "right",
    key: COLUMN_KEYS.ACTIONS,
    align: "center",
    width: 80,
    render: (_, board) => (
      <ActionsDropdown board={board} onDelete={onDelete} onRename={onRename} />
    ),
  },
];

export default buildColumnData;
