import React from "react";

import { Typography } from "neetoui";

import ActionsDropdown from "./ActionsDropdown";

const LABEL_ROW_CLASS_NAME =
  "neeto-ui-rounded-lg flex items-center gap-x-3 border border-gray-200 bg-white px-4 py-3";

const LabelRow = ({ label, onDelete, onEdit }) => (
  <div className={LABEL_ROW_CLASS_NAME}>
    <span
      aria-hidden
      className="h-4 w-4 shrink-0 rounded-full"
      style={{ backgroundColor: label.color }}
    />
    <Typography className="min-w-0 flex-1 truncate" style="body2">
      {label.name}
    </Typography>
    <div className="flex shrink-0 items-center">
      <ActionsDropdown label={label} onDelete={onDelete} onEdit={onEdit} />
    </div>
  </div>
);

export default LabelRow;
