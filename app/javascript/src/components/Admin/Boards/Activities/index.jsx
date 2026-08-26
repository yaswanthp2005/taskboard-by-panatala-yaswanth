import React from "react";

import Container from "@bigbinary/neeto-molecules/Container";
import Scrollable from "@bigbinary/neeto-molecules/Scrollable";
import { ActivityFeed } from "components/Admin/Boards/Show/Activity";
import { BoardNavHeader } from "components/Admin/Boards/Show/Header";
import { useFetchBoard } from "components/hooks/reactQuery/useBoardsApi";
import Sidebar from "components/Sidebar";
import { Spinner, Typography } from "neetoui";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import withTitle from "utils/withTitle";

const Activities = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const {
    data: board,
    isError: isBoardError,
    isLoading: isBoardLoading,
  } = useFetchBoard(slug);

  if (isBoardLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isBoardError || !board) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Typography style="body1">{t("common.somethingWentWrong")}</Typography>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Container
          isHeaderFixed
          className="!h-full min-h-0 flex-1 !overflow-hidden"
        >
          <BoardNavHeader board={board} />
          <Scrollable className="flex min-h-0 flex-1 flex-col" size="medium">
            <div className="px-5 py-6 lg:px-10">
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
            </div>
          </Scrollable>
        </Container>
      </main>
    </div>
  );
};

export default withTitle(Activities, "activity.pageTitle");
