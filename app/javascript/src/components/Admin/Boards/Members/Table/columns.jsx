import React from "react";

import { Typography } from "neetoui";

import NameCell from "./cells/NameCell";
import RoleCell from "./cells/RoleCell";

import { COLUMN_KEYS } from "../constants";

const buildColumnData = ({ t }) => [
  {
    title: t("members.table.name"),
    dataIndex: "name",
    key: COLUMN_KEYS.NAME,
    ellipsis: false,
    render: (_, member) => <NameCell member={member} />,
  },
  {
    title: t("members.table.email"),
    dataIndex: "email",
    key: COLUMN_KEYS.EMAIL,
    width: 280,
    render: email => (
      <Typography className="truncate text-gray-600" style="body2">
        {email}
      </Typography>
    ),
  },
  {
    title: t("members.table.role"),
    dataIndex: "role",
    key: COLUMN_KEYS.ROLE,
    width: 140,
    render: role => <RoleCell role={role} />,
  },
];

export default buildColumnData;
