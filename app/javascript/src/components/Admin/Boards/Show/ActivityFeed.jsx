import React from "react";

import {
  useFetchBoardActivities,
  useFetchCardActivities,
} from "components/hooks/reactQuery/useActivitiesApi";
import { Spinner, Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import {
  formatActivityMessage,
  formatActivityTimestamp,
} from "./activityUtils";

const ActivityFeed = ({
  boardSlug,
  cardId,
  showTitle = true,
  titleKey = "activity.title",
}) => {
  const { t } = useTranslation();
  const isCardFeed = Boolean(cardId);

  const { data: cardActivities = [], isLoading: isCardLoading } =
    useFetchCardActivities(cardId, { enabled: isCardFeed });

  const { data: boardActivities = [], isLoading: isBoardLoading } =
    useFetchBoardActivities(boardSlug, {
      enabled: !isCardFeed && Boolean(boardSlug),
    });

  const activities = isCardFeed ? cardActivities : boardActivities;
  const isLoading = isCardFeed ? isCardLoading : isBoardLoading;

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-y-3">
      {showTitle && (
        <Typography className="text-gray-500" style="body3" weight="semibold">
          {t(titleKey)}
        </Typography>
      )}
      {!activities.length ? (
        <Typography className="text-gray-500" style="body3">
          {t("activity.empty")}
        </Typography>
      ) : (
        <ul className="flex w-full flex-col gap-y-3">
          {activities.map(activity => (
            <li className="flex w-full flex-col gap-y-0.5" key={activity.id}>
              <Typography className="text-gray-800" style="body2">
                {formatActivityMessage(activity, t, {
                  cardContext: isCardFeed,
                })}
              </Typography>
              <Typography className="text-gray-500" style="body3">
                {formatActivityTimestamp(activity.createdAt)}
              </Typography>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

ActivityFeed.propTypes = {
  boardSlug: PropTypes.string,
  cardId: PropTypes.string,
  showTitle: PropTypes.bool,
  titleKey: PropTypes.string,
};

ActivityFeed.defaultProps = {
  boardSlug: null,
  cardId: null,
  showTitle: true,
  titleKey: "activity.title",
};

export default ActivityFeed;
