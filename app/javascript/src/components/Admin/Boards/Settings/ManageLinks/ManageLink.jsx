import React from "react";

import { Typography } from "neetoui";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { buildURL } from "utils/buildURL";

const ManageLink = ({ description, slug, title, to }) => (
  <Link
    className="neeto-ui-border-gray-200 flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-gray-50"
    to={buildURL({ path: to, slug })}
  >
    <div>
      <Typography style="body1" weight="semibold">
        {title}
      </Typography>
      <Typography className="mt-1 text-gray-600" style="body2">
        {description}
      </Typography>
    </div>
    <Typography className="text-gray-400" style="body2">
      →
    </Typography>
  </Link>
);

ManageLink.propTypes = {
  description: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default ManageLink;
