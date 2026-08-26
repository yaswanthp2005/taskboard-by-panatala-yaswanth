import React from "react";

import { Tag } from "neetoui";
import PropTypes from "prop-types";

const ActivityBadge = ({ label }) => (
  <Tag
    className="mx-0.5 inline-flex max-w-full"
    label={label}
    size="small"
    style="primary"
    type="solid"
  />
);

ActivityBadge.propTypes = {
  label: PropTypes.string.isRequired,
};

export default ActivityBadge;
