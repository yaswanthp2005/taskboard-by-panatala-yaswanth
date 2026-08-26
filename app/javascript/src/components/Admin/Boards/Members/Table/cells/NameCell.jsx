import React from "react";

import { Typography } from "neetoui";
import { useTranslation } from "react-i18next";
import { formatMemberName, getInitials } from "utils/members";

const NameCell = ({ member }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-x-3">
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-700"
      >
        {getInitials(member)}
      </span>
      <Typography className="truncate" style="body2" weight="medium">
        {formatMemberName(member) || t("common.user")}
      </Typography>
    </div>
  );
};

export default NameCell;
