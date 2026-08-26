import dayjs from "dayjs";

import { formatMemberName } from "./CardDetailPane/utils";

const formatActivityTimestamp = createdAt =>
  dayjs(createdAt).format("MMM D, YYYY [at] h:mm A");

const mapActivitiesToTimelineItems = activities =>
  activities.map(activity => ({
    id: activity.id,
    user: { name: formatMemberName(activity.actor) },
    activity,
  }));

export { formatActivityTimestamp, mapActivitiesToTimelineItems };
