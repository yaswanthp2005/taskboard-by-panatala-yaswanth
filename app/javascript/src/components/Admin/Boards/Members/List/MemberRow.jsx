import React from "react";

import {
  formatMemberName,
  getInitials,
} from "components/Admin/Boards/Show/CardDetailPane/utils";
import { Tag, Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { MEMBER_ROLES } from "../constants";

const MEMBER_ROW_CLASS_NAME =
  "neeto-ui-rounded-lg flex items-center gap-x-3 border border-gray-200 bg-white px-4 py-3";

const MemberRow = ({ member }) => {
  const { t } = useTranslation();
  const isOwner = member.role === MEMBER_ROLES.OWNER;

  return (
    <div className={MEMBER_ROW_CLASS_NAME}>
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-700"
      >
        {getInitials(member)}
      </span>
      <div className="min-w-0 flex-1">
        <Typography className="truncate" style="body2" weight="medium">
          {formatMemberName(member) || t("common.user")}
        </Typography>
        <Typography className="truncate text-gray-500" style="body3">
          {member.email}
        </Typography>
      </div>
      <Tag
        label={isOwner ? t("members.roles.owner") : t("members.roles.member")}
        style={isOwner ? "primary" : "secondary"}
      />
    </div>
  );
};

MemberRow.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    role: PropTypes.oneOf([MEMBER_ROLES.OWNER, MEMBER_ROLES.MEMBER]).isRequired,
  }).isRequired,
};

export default MemberRow;
