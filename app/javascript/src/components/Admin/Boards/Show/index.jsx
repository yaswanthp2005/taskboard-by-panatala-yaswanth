import routes from "constants/routes";

import React from "react";

import Container from "@bigbinary/neeto-molecules/Container";
import Header from "@bigbinary/neeto-molecules/Header";
import Scrollable from "@bigbinary/neeto-molecules/Scrollable";
import { useFetchBoard } from "components/hooks/reactQuery/useBoardsApi";
import { Button, Spinner, Typography } from "neetoui";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { buildURL } from "utils/buildURL";
import withTitle from "utils/withTitle";

import BoardKanban from "./BoardKanban";

const Show = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { data: board, isError, isLoading } = useFetchBoard(slug);

  if (isLoading) {
    return (
      <Container className="flex min-h-screen items-center justify-center">
        <Spinner />
      </Container>
    );
  }

  if (isError || !board) {
    return (
      <Container className="flex min-h-screen items-center justify-center">
        <Typography style="body1">{t("common.somethingWentWrong")}</Typography>
      </Container>
    );
  }

  return (
    <Container isHeaderFixed>
      <Header
        title={board.name}
        actionBlock={
          <Button
            component={Link}
            label={t("labels.manage")}
            style="secondary"
            to={buildURL({ path: routes.boards.labels, slug: board.slug })}
          />
        }
        breadcrumbs={[
          {
            text: t("boards.title"),
            link: routes.boards.index,
          },
          {
            text: board.name,
          },
        ]}
      />
      <Scrollable className="flex w-full flex-col" size="small">
        <BoardKanban boardSlug={board.slug} lists={board.lists ?? []} />
      </Scrollable>
    </Container>
  );
};

export default withTitle(Show, "boardView.pageTitle");
