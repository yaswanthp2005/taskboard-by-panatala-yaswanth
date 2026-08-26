import React from "react";

import PropTypes from "prop-types";

const LabelColorIcon = ({ color }) => (
  <span
    aria-hidden
    className="inline-block h-2 w-2 shrink-0 rounded-full"
    style={{ backgroundColor: color }}
  />
);

LabelColorIcon.propTypes = {
  color: PropTypes.string.isRequired,
};

export default LabelColorIcon;
