import React from "react";

import { Typography } from "neetoui";

import ActionsDropdown from "./ActionsDropdown";
import ColorCell from "./cells/ColorCell";

import { COLUMN_KEYS } from "../constants";

const buildColumnData = ({ onDelete, onEdit, t }) => [
  {
    title: t("labels.table.name"),
    dataIndex: "name",
    key: COLUMN_KEYS.NAME,
    render: name => (
      <Typography className="truncate" style="body2">
        {name}
      </Typography>
    ),
  },
  {
    title: t("labels.table.color"),
    dataIndex: "color",
    key: COLUMN_KEYS.COLOR,
    width: 200,
    render: color => <ColorCell color={color} />,
  },
  {
    dataIndex: "actions",
    fixed: "right",
    key: COLUMN_KEYS.ACTIONS,
    align: "center",
    width: 80,
    render: (_, label) => (
      <ActionsDropdown label={label} onDelete={onDelete} onEdit={onEdit} />
    ),
  },
];

export default buildColumnData;
