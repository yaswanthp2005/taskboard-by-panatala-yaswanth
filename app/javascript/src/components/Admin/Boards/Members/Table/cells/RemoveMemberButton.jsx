import React from "react";

import { Delete } from "neetoicons";
import { Button } from "neetoui";
import { useTranslation } from "react-i18next";

import { MEMBER_ROLES } from "../../constants";

const RemoveMemberButton = ({ canRemoveMembers, member, onRemove }) => {
  const { t } = useTranslation();

  if (!canRemoveMembers || member.role === MEMBER_ROLES.OWNER) {
    return null;
  }

  return (
    <Button
      aria-label={t("members.delete.action")}
      icon={Delete}
      style="text"
      onClick={() => onRemove(member)}
    />
  );
};

export default RemoveMemberButton;
