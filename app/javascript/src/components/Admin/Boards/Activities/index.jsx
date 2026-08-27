import React from "react";

import BoardLayout from "components/Admin/Boards/Layout";
import { ActivityFeed } from "components/Admin/Boards/Show/Activity";
import { Typography } from "neetoui";
import { useTranslation } from "react-i18next";
import withTitle from "utils/withTitle";

const ActivitiesContent = ({ board }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-6 flex flex-col gap-y-1">
        <Typography style="h3" weight="semibold">
          {t("activity.pageTitle")}
        </Typography>
        <Typography className="text-gray-500" style="body2">
          {t("activity.subtitle")}
        </Typography>
      </div>
      <div className="max-w-3xl">
        <ActivityFeed boardSlug={board.slug} showTitle={false} />
      </div>
    </>
  );
};

const Activities = () => (
  <BoardLayout>{board => <ActivitiesContent board={board} />}</BoardLayout>
);

export default withTitle(Activities, "activity.pageTitle");
