import React from "react";

import { ActivityLog } from "neetoicons";
import { Avatar } from "neetoui";

const ActivityTimelineItem = ({ children, user }) => (
  <div className="activity-timeline__item">
    <span className="activity-timeline__icon">
      <ActivityLog size={16} />
    </span>
    <Avatar
      size="small"
      user={{ name: user.name, imageUrl: user.profileImageUrl }}
    />
    <div className="activity-timeline__content min-w-0 flex-1">{children}</div>
  </div>
);

export default ActivityTimelineItem;
