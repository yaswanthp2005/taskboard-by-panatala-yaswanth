import React from "react";

import PropTypes from "prop-types";

const ActivityTimeline = ({ children }) => (
  <div className="activity-timeline">{children}</div>
);

ActivityTimeline.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ActivityTimeline;
