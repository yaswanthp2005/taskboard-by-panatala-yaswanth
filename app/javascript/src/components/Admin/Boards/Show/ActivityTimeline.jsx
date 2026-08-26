import React from "react";

import { ActivityLog } from "neetoicons";
import { Avatar } from "neetoui";
import PropTypes from "prop-types";

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

ActivityTimelineItem.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    profileImageUrl: PropTypes.string,
  }).isRequired,
};

const ActivityTimeline = ({ children }) => (
  <div className="activity-timeline">{children}</div>
);

ActivityTimeline.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ActivityTimeline, ActivityTimelineItem };
