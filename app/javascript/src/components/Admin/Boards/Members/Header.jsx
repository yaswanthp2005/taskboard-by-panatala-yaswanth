import React from "react";

import { Plus } from "neetoicons";
import { Button, Typography } from "neetoui";
import { useTranslation } from "react-i18next";

const MembersHeader = ({ canAddMember, isAddDisabled, onAddMember }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8 flex items-start justify-between gap-x-4">
      <div>
        <Typography style="h2" weight="semibold">
          {t("members.title")}
        </Typography>
        <Typography className="mt-2 text-gray-600" style="body2">
          {t("members.subtitle")}
        </Typography>
      </div>
      {canAddMember && (
        <Button
          disabled={isAddDisabled}
          icon={Plus}
          label={t("members.addMember")}
          style="primary"
          onClick={onAddMember}
        />
      )}
    </div>
  );
};

export default MembersHeader;
