import dayjs from "dayjs";
import { formatMemberName } from "utils/members";

const formatActivityTimestamp = createdAt =>
  dayjs(createdAt).format("MMM D, YYYY [at] h:mm A");

const mapActivitiesToTimelineItems = activities =>
  activities.map(activity => ({
    id: activity.id,
    user: { name: formatMemberName(activity.actor) },
    activity,
  }));

export { formatActivityTimestamp, mapActivitiesToTimelineItems };
