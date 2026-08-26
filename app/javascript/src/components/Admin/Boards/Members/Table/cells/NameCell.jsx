import React from "react";

import {
  formatMemberName,
  getInitials,
} from "components/Admin/Boards/Show/CardDetailPane/utils";
import { Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

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

NameCell.propTypes = {
  member: PropTypes.shape({
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
};

export default NameCell;
