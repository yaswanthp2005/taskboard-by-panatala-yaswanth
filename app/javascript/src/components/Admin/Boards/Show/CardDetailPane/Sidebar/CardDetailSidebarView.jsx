import React from "react";

import dayjs from "dayjs";
import { Button, Typography } from "neetoui";
import { useTranslation } from "react-i18next";
import { formatMemberName, getInitials } from "utils/members";

import SidebarField from "./SidebarField";

const CardDetailSidebarView = ({
  card,
  onConfigure,
  onShowChecklist,
  showChecklist,
}) => {
  const { t } = useTranslation();
  const formattedDueDate = card.dueDate
    ? dayjs(card.dueDate).format("MMM D, YYYY")
    : null;

  const hasChecklist = (card.checklistItems ?? []).length > 0;
  const showAddChecklistButton = !hasChecklist && !showChecklist;

  return (
    <aside className="card-detail-pane__sidebar">
      <SidebarField
        label={t("cardDetail.assignedTo")}
        onConfigure={onConfigure}
      >
        {card.assignees?.length ? (
          <div className="flex flex-wrap gap-2">
            {card.assignees.map(assignee => (
              <span
                className="flex items-center gap-x-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                key={assignee.id}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px]">
                  {getInitials(assignee)}
                </span>
                {formatMemberName(assignee)}
              </span>
            ))}
          </div>
        ) : (
          <Typography className="text-gray-500" style="body3">
            {t("cardDetail.noAssignee")}
          </Typography>
        )}
      </SidebarField>
      <SidebarField label={t("cardDetail.dueDate")} onConfigure={onConfigure}>
        <Typography className="text-gray-800" style="body2">
          {formattedDueDate || t("cardDetail.noDueDate")}
        </Typography>
      </SidebarField>
      <SidebarField label={t("cardDetail.tags")} onConfigure={onConfigure}>
        {card.labels?.length ? (
          <div className="flex flex-wrap gap-2">
            {card.labels.map(label => (
              <span
                className="rounded-full px-3 py-1 text-xs font-medium text-white"
                key={label.id}
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            ))}
          </div>
        ) : (
          <Typography className="text-gray-500" style="body3">
            {t("cardDetail.noLabels")}
          </Typography>
        )}
      </SidebarField>
      {showAddChecklistButton && (
        <Button
          className="w-full"
          label={t("cardDetail.addChecklist")}
          style="secondary"
          type="button"
          onClick={onShowChecklist}
        />
      )}
    </aside>
  );
};

export default CardDetailSidebarView;
