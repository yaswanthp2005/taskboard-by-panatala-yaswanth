import React from "react";

import { Checkbox, Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { CardDetailSidebarView } from "./CardDetailSidebar";
import CardTitle from "./CardTitle";
import ChecklistField from "./ChecklistField";

import ActivityFeed from "../ActivityFeed";

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
          <Checkbox
            checked={false}
            className="card-detail-pane__title-checkbox shrink-0 !grow-0"
            label=""
          />
          <CardTitle boardSlug={boardSlug} cardId={cardId} title={card.title} />
        </div>
        <Typography
          style="body2"
          className={`w-full whitespace-pre-wrap break-words ${
            card.description ? "text-gray-800" : "text-gray-500"
          }`}
        >
          {card.description || t("cardDetail.noDescription")}
        </Typography>
        <ActivityFeed cardId={cardId} />
        {showChecklist && (
          <ChecklistField
            boardSlug={boardSlug}
            cardId={cardId}
            items={card.checklistItems ?? []}
            onCloseWhenEmpty={onHideChecklist}
          />
        )}
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

CardDetailView.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  card: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    dueDate: PropTypes.string,
    assignees: PropTypes.array,
    labels: PropTypes.array,
    checklistItems: PropTypes.array,
  }).isRequired,
  cardId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onHideChecklist: PropTypes.func.isRequired,
  onShowChecklist: PropTypes.func.isRequired,
  showChecklist: PropTypes.bool.isRequired,
};

export default CardDetailView;
