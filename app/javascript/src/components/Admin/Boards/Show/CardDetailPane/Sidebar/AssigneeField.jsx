import React from "react";

import { useFormikContext } from "formik";
import { Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { AssigneeDropdown } from "../../Assignee";

const AssigneeField = ({ boardSlug, variant = "default" }) => {
  const { t } = useTranslation();
  const { setFieldValue, values } = useFormikContext();
  const isSidebar = variant === "sidebar";

  const selectedIds = values.assigneeIds || [];

  const handleToggle = memberId => {
    const currentAssigneeIds = values.assigneeIds || [];
    const nextAssigneeIds = currentAssigneeIds.includes(memberId)
      ? currentAssigneeIds.filter(id => id !== memberId)
      : [...currentAssigneeIds, memberId];

    setFieldValue("assigneeIds", nextAssigneeIds);
  };

  return (
    <div
      className={`flex w-full flex-col ${
        isSidebar ? "card-detail-pane__sidebar-field" : "gap-y-2"
      }`}
    >
      <Typography style="body2" weight="semibold">
        {t(isSidebar ? "cardDetail.assignedTo" : "cardDetail.assignee")}
      </Typography>
      <AssigneeDropdown
        boardSlug={boardSlug}
        label={t("cardDetail.assigneePlaceholder")}
        selectedIds={selectedIds}
        triggerClassName="w-full"
        onToggle={handleToggle}
      />
    </div>
  );
};

AssigneeField.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["default", "sidebar"]),
};

export default AssigneeField;
