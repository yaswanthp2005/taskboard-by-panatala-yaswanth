import routes from "constants/routes";

import React from "react";

import { Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
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

const ManageLinks = ({ canManageMembers, slug }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-10">
      <Typography style="h2" weight="semibold">
        {t("boardSettings.manage.title")}
      </Typography>
      <Typography className="mt-2 text-gray-600" style="body2">
        {t("boardSettings.manage.subtitle")}
      </Typography>
      <div className="mt-6 flex flex-col gap-3">
        {canManageMembers && (
          <ManageLink
            description={t("boardSettings.manage.membersDescription")}
            slug={slug}
            title={t("boardSettings.manage.members")}
            to={routes.boards.members}
          />
        )}
        <ManageLink
          description={t("boardSettings.manage.labelsDescription")}
          slug={slug}
          title={t("boardSettings.manage.labels")}
          to={routes.boards.labels}
        />
      </div>
    </div>
  );
};

ManageLinks.propTypes = {
  canManageMembers: PropTypes.bool,
  slug: PropTypes.string.isRequired,
};

ManageLinks.defaultProps = {
  canManageMembers: false,
};

export default ManageLinks;
