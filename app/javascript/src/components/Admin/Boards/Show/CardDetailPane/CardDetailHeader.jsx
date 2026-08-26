import React from "react";

import { Typography } from "neetoui";
import PropTypes from "prop-types";

const CardDetailHeader = ({ boardName }) => (
  <Typography className="text-gray-600" style="body2">
    {boardName}
  </Typography>
);

CardDetailHeader.propTypes = {
  boardName: PropTypes.string.isRequired,
};

export default CardDetailHeader;
