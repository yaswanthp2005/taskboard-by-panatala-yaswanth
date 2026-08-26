import routes from "constants/routes";

import React from "react";

import { Typography } from "neetoui";
import { useTranslation } from "react-i18next";

import ManageLink from "./ManageLink";

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

export default ManageLinks;
