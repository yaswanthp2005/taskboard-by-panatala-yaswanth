import React from "react";

import { Typography } from "neetoui";

import ActionsDropdown from "./ActionsDropdown";
import BoardCell from "./cells/BoardCell";

import { COLUMN_KEYS } from "../constants";

const ColorCell = ({ color }) => (
  <div className="flex items-center gap-x-2">
    <span
      className="inline-block h-4 w-4 rounded-full border border-gray-200"
      style={{ backgroundColor: color || "#E5E7EB" }}
    />
    <Typography style="body2">{color || "-"}</Typography>
  </div>
);

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
