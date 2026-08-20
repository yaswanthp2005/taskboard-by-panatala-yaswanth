import React from "react";

import { Typography } from "neetoui";

import { COLUMN_KEYS } from "../constants";
import { formatBoardUpdatedAt } from "../utils";

const ColorCell = ({ color }) => (
  <div className="flex items-center gap-x-2">
    <span
      className="inline-block h-4 w-4 rounded-full border border-gray-200"
      style={{ backgroundColor: color || "#E5E7EB" }}
    />
    <Typography style="body2">{color || "-"}</Typography>
  </div>
);

const buildColumnData = ({ t }) => [
  {
    title: t("boards.table.name"),
    dataIndex: "name",
    key: COLUMN_KEYS.NAME,
    ellipsis: true,
  },
  {
    title: t("boards.table.description"),
    dataIndex: "description",
    key: COLUMN_KEYS.DESCRIPTION,
    ellipsis: true,
    render: description => description || "-",
  },
  {
    title: t("boards.table.color"),
    dataIndex: "color",
    key: COLUMN_KEYS.COLOR,
    width: 180,
    render: color => <ColorCell color={color} />,
  },
  {
    title: t("boards.table.updatedAt"),
    dataIndex: "updatedAt",
    key: COLUMN_KEYS.UPDATED_AT,
    width: 220,
    render: updatedAt => formatBoardUpdatedAt(updatedAt),
  },
];

export default buildColumnData;
