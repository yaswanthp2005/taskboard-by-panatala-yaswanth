import React, { useMemo } from "react";

import {
  useFetchBoardActivities,
  useFetchCardActivities,
} from "components/hooks/reactQuery/useActivitiesApi";
import { Spinner, Typography } from "neetoui";
import { useTranslation } from "react-i18next";

import ActivityItemContent from "./ItemContent";
import { ActivityTimeline, ActivityTimelineItem } from "./Timeline";
import { formatActivityTimestamp, mapActivitiesToTimelineItems } from "./utils";

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

  const timelineItems = useMemo(
    () => mapActivitiesToTimelineItems(activities),
    [activities]
  );

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="activity-feed w-full">
      {showTitle && (
        <Typography
          className="mb-4 text-gray-800"
          style="body2"
          weight="semibold"
        >
          {t(titleKey)}
        </Typography>
      )}
      {!activities.length ? (
        <Typography className="text-gray-500" style="body3">
          {t("activity.empty")}
        </Typography>
      ) : (
        <ActivityTimeline>
          {timelineItems.map(item => (
            <ActivityTimelineItem key={item.id} user={item.user}>
              <div className="flex w-full flex-col gap-y-0.5">
                <ActivityItemContent
                  activity={item.activity}
                  cardContext={isCardFeed}
                />
                <Typography className="text-gray-500" style="body3">
                  {formatActivityTimestamp(item.activity.createdAt)}
                </Typography>
              </div>
            </ActivityTimelineItem>
          ))}
        </ActivityTimeline>
      )}
    </div>
  );
};

export default ActivityFeed;
