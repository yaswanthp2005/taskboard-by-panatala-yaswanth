import React, { useState } from "react";

import Scrollable from "@bigbinary/neeto-molecules/Scrollable";
import { useFetchBoard } from "components/hooks/reactQuery/useBoardsApi";
import Sidebar from "components/Sidebar";
import { Spinner, Typography } from "neetoui";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import withTitle from "utils/withTitle";

import BoardHeader from "./BoardHeader";
import BoardKanban from "./BoardKanban";

const getTotalCards = lists =>
  (lists ?? []).reduce((total, list) => total + (list.cards?.length ?? 0), 0);

const Show = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [isAddingList, setIsAddingList] = useState(false);
  const { data: board, isError, isLoading } = useFetchBoard(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !board) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Typography style="body1">{t("common.somethingWentWrong")}</Typography>
      </div>
    );
  }

  const totalCards = getTotalCards(board.lists);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <BoardHeader
          board={board}
          isAddingList={isAddingList}
          totalCards={totalCards}
          onAddList={() => setIsAddingList(true)}
        />
        <Scrollable
          className="board-kanban-scroll flex !h-auto w-full flex-col overflow-y-hidden"
          size="small"
        >
          <BoardKanban
            boardSlug={board.slug}
            isAddingList={isAddingList}
            lists={board.lists ?? []}
            onCancelAddList={() => setIsAddingList(false)}
          />
        </Scrollable>
      </div>
    </div>
  );
};

export default withTitle(Show, "boardView.pageTitle");
