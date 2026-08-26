import React from "react";

import { Typography } from "neetoui";
import PropTypes from "prop-types";

const ActivityText = ({ bold = false, children, muted = false }) => (
  <Typography
    className={muted ? "text-gray-500" : "text-gray-800"}
    component="span"
    style="body2"
    weight={bold ? "semibold" : "regular"}
  >
    {children}
  </Typography>
);

ActivityText.propTypes = {
  bold: PropTypes.bool,
  children: PropTypes.node.isRequired,
  muted: PropTypes.bool,
};

ActivityText.defaultProps = {
  bold: false,
  muted: false,
};

export default ActivityText;
