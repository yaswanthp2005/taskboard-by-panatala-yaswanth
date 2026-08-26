import React from "react";

import { Typography } from "neetoui";
import { useTranslation } from "react-i18next";

import CardCompleteCheckbox from "./CardCompleteCheckbox";
import CardTitle from "./CardTitle";

import { ActivityFeed } from "../../Activity";
import { ChecklistField } from "../Checklist";
import { CardDetailSidebarView } from "../Sidebar";

const CardDetailView = ({
  boardSlug,
  card,
  cardId,
  onEdit,
  onHideChecklist,
  onShowChecklist,
  showChecklist,
}) => {
  const { t } = useTranslation();

  return (
    <div className="card-detail-pane__layout">
      <div className="card-detail-pane__main">
        <div className="card-detail-pane__title-row">
          <CardCompleteCheckbox
            boardSlug={boardSlug}
            cardId={cardId}
            className="card-detail-pane__title-checkbox shrink-0 !grow-0"
            isComplete={card.isComplete}
          />
          <CardTitle
            boardSlug={boardSlug}
            cardId={cardId}
            isComplete={card.isComplete}
            title={card.title}
          />
        </div>
        <Typography
          style="body2"
          className={`w-full whitespace-pre-wrap break-words ${
            card.description ? "text-gray-800" : "text-gray-500"
          }`}
        >
          {card.description || t("cardDetail.noDescription")}
        </Typography>
        {showChecklist && (
          <ChecklistField
            boardSlug={boardSlug}
            cardId={cardId}
            items={card.checklistItems ?? []}
            onCloseWhenEmpty={onHideChecklist}
          />
        )}
        <ActivityFeed cardId={cardId} />
      </div>
      <CardDetailSidebarView
        card={card}
        showChecklist={showChecklist}
        onConfigure={onEdit}
        onShowChecklist={onShowChecklist}
      />
    </div>
  );
};

export default CardDetailView;
