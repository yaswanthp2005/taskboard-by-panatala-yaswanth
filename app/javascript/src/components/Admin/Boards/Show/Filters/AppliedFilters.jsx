import React from "react";

import { Button, Tag, Typography } from "neetoui";
import { useTranslation } from "react-i18next";

import { DUE_STATUS_FILTER_OPTIONS } from "./constants";

const AppliedFilters = ({
  appliedFilters,
  onClearFilters,
  onRemoveAssignee,
  onRemoveDueStatus,
  onRemoveLabel,
  totalCards,
}) => {
  const { t } = useTranslation();
  const { assignees = [], dueStatus = "", labels = [] } = appliedFilters;

  const dueStatusOption = DUE_STATUS_FILTER_OPTIONS.find(
    option => option.value === dueStatus
  );

  return (
    <div className="flex flex-wrap items-center gap-2 px-5 pb-4 lg:px-10">
      <Typography className="text-gray-700" style="body2">
        {t("boardView.filters.resultsCount", { count: totalCards })}
      </Typography>
      {assignees.map(assigneeName => (
        <Tag
          key={assigneeName}
          label={assigneeName}
          style="secondary"
          type="solid"
          onClose={() => onRemoveAssignee(assigneeName)}
        />
      ))}
      {labels.map(labelName => (
        <Tag
          key={labelName}
          label={labelName}
          style="secondary"
          type="solid"
          onClose={() => onRemoveLabel(labelName)}
        />
      ))}
      {dueStatusOption && (
        <Tag
          label={t(dueStatusOption.labelKey)}
          style="danger"
          type="outline"
          onClose={onRemoveDueStatus}
        />
      )}
      <Button
        label={t("boardView.filters.clearFilters")}
        style="link"
        onClick={onClearFilters}
      />
    </div>
  );
};

export default AppliedFilters;
