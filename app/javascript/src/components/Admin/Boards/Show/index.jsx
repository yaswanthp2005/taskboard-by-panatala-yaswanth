import routes from "constants/routes";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import Scrollable from "@bigbinary/neeto-molecules/Scrollable";
import { useFetchBoard } from "components/hooks/reactQuery/useBoardsApi";
import { useFetchCards } from "components/hooks/reactQuery/useCardsApi";
import useFuncDebounce from "components/hooks/useFuncDebounce";
import useQueryParams from "components/hooks/useQueryParams";
import Sidebar from "components/Sidebar";
import { Spinner, Typography } from "neetoui";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { buildURL } from "utils/buildURL";
import withTitle from "utils/withTitle";

import BoardHeader from "./BoardHeader";
import BoardKanban from "./BoardKanban";
import { buildCardFetchParams, hasActiveCardFilters } from "./utils";

const getTotalCards = lists =>
  (lists ?? []).reduce((total, list) => total + (list.cards?.length ?? 0), 0);

const Show = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { slug } = useParams();
  const queryParams = useQueryParams();
  const { search = "" } = queryParams;
  const [isAddingList, setIsAddingList] = useState(false);
  const [searchKey, setSearchKey] = useState(search);

  const trimmedSearch = search.trim();
  const cardFetchParams = useMemo(
    () => buildCardFetchParams({ search: trimmedSearch }),
    [trimmedSearch]
  );

  const { data: board, isError, isLoading } = useFetchBoard(slug);
  const { data: filteredLists, isFetching: isFetchingCards } = useFetchCards(
    slug,
    cardFetchParams
  );

  const lists = useMemo(() => {
    if (!hasActiveCardFilters(cardFetchParams)) {
      return board?.lists ?? [];
    }

    return filteredLists ?? board?.lists ?? [];
  }, [board?.lists, cardFetchParams, filteredLists]);

  useEffect(() => {
    setSearchKey(search);
  }, [search]);

  const replaceQueryParams = useCallback(
    params => {
      history.replace(buildURL({ path: routes.boards.show, slug, ...params }));
    },
    [history, slug]
  );

  const debouncedSearch = useFuncDebounce(value => {
    replaceQueryParams({ search: value || null });
  });

  if (isLoading && !board) {
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

  const totalCards = getTotalCards(lists);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <BoardHeader
          board={board}
          isAddingList={isAddingList}
          search={searchKey}
          totalCards={totalCards}
          onAddList={() => setIsAddingList(true)}
          onSearch={value => {
            setSearchKey(value);
            debouncedSearch(value);
          }}
        />
        <Scrollable
          className="board-kanban-scroll flex !h-auto w-full flex-col overflow-y-hidden"
          size="small"
        >
          <BoardKanban
            boardSlug={board.slug}
            isAddingList={isAddingList}
            isFetching={isFetchingCards}
            lists={lists}
            onCancelAddList={() => setIsAddingList(false)}
          />
        </Scrollable>
      </div>
    </div>
  );
};

export default withTitle(Show, "boardView.pageTitle");
