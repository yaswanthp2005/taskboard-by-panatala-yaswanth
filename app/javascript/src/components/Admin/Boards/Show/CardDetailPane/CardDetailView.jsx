import React from "react";

import dayjs from "dayjs";
import { Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import ChecklistField from "./ChecklistField";

const CardDetailView = ({ boardSlug, card, cardId }) => {
  const { t } = useTranslation();
  const formattedDueDate = card.dueDate
    ? dayjs(card.dueDate).format("MMM D, YYYY")
    : null;

  return (
    <div className="flex w-full flex-col gap-y-6">
      <div className="flex w-full flex-col gap-y-1">
        <Typography className="text-gray-500" style="body3" weight="semibold">
          {t("cardDetail.titleLabel")}
        </Typography>
        <Typography
          className="w-full whitespace-pre-wrap break-words"
          style="h4"
          weight="semibold"
        >
          {card.title}
        </Typography>
      </div>
      <div className="flex w-full flex-col gap-y-1">
        <Typography className="text-gray-500" style="body3" weight="semibold">
          {t("cardDetail.description")}
        </Typography>
        <Typography
          className="w-full whitespace-pre-wrap break-words text-gray-800"
          style="body2"
        >
          {card.description || t("cardDetail.noDescription")}
        </Typography>
      </div>
      <div className="flex w-full flex-col gap-y-1">
        <Typography className="text-gray-500" style="body3" weight="semibold">
          {t("cardDetail.dueDate")}
        </Typography>
        <Typography className="text-gray-800" style="body2">
          {formattedDueDate || t("cardDetail.noDueDate")}
        </Typography>
      </div>
      <div className="flex w-full flex-col gap-y-2">
        <Typography className="text-gray-500" style="body3" weight="semibold">
          {t("cardDetail.labels")}
        </Typography>
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
      </div>
      {(card.checklistItems ?? []).length > 0 && (
        <ChecklistField
          boardSlug={boardSlug}
          cardId={cardId}
          items={card.checklistItems ?? []}
          showInput={false}
          showItemActions={false}
        />
      )}
    </div>
  );
};

CardDetailView.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  card: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    dueDate: PropTypes.string,
    labels: PropTypes.array,
    checklistItems: PropTypes.array,
  }).isRequired,
  cardId: PropTypes.string.isRequired,
};

export default CardDetailView;
