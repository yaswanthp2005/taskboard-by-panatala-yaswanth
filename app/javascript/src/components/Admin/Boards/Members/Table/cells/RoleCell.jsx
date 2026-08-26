import React from "react";

import { Tag } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { MEMBER_ROLES } from "../../constants";

const RoleCell = ({ role }) => {
  const { t } = useTranslation();
  const isOwner = role === MEMBER_ROLES.OWNER;

  return (
    <Tag
      label={isOwner ? t("members.roles.owner") : t("members.roles.member")}
      style={isOwner ? "primary" : "secondary"}
    />
  );
};

RoleCell.propTypes = {
  role: PropTypes.oneOf([MEMBER_ROLES.OWNER, MEMBER_ROLES.MEMBER]).isRequired,
};

export default RoleCell;
