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
import AppliedFilters from "./Filters/AppliedFilters";
import SearchFilters from "./Filters/SearchFilters";
import {
  buildCardFetchParams,
  extractAssignees,
  extractLabels,
  filtersFromQueryParams,
  hasActiveCardFilters,
  hasPaneFiltersApplied,
} from "./utils";

const getTotalCards = lists =>
  (lists ?? []).reduce((total, list) => total + (list.cards?.length ?? 0), 0);

const Show = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { slug } = useParams();
  const queryParams = useQueryParams();
  const { search = "", assignees, labels, dueStatus = "" } = queryParams;
  const [isAddingList, setIsAddingList] = useState(false);
  const [searchKey, setSearchKey] = useState(search);
  const [isSearchFiltersOpen, setIsSearchFiltersOpen] = useState(false);

  const normalizedAssigneeNames = useMemo(
    () => extractAssignees(assignees),
    [assignees]
  );
  const normalizedLabelNames = useMemo(() => extractLabels(labels), [labels]);

  const trimmedSearch = search.trim();
  const cardFetchParams = useMemo(
    () =>
      buildCardFetchParams({
        assignees: normalizedAssigneeNames,
        dueStatus,
        labels: normalizedLabelNames,
        search: trimmedSearch,
      }),
    [dueStatus, normalizedAssigneeNames, normalizedLabelNames, trimmedSearch]
  );

  const paneFilters = useMemo(
    () =>
      filtersFromQueryParams({
        assignees: normalizedAssigneeNames,
        dueStatus,
        labels: normalizedLabelNames,
      }),
    [dueStatus, normalizedAssigneeNames, normalizedLabelNames]
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
    replaceQueryParams({
      assignees: normalizedAssigneeNames.length
        ? normalizedAssigneeNames
        : null,
      dueStatus: dueStatus || null,
      labels: normalizedLabelNames.length ? normalizedLabelNames : null,
      search: value || null,
    });
  });

  const handleFiltersSubmit = filters => {
    replaceQueryParams({
      assignees: filters.assignees.length ? filters.assignees : null,
      dueStatus: filters.dueStatus || null,
      labels: filters.labels.length ? filters.labels : null,
      search: trimmedSearch || null,
    });
  };

  const handleRemoveAssignee = assigneeName => {
    const remainingAssignees = normalizedAssigneeNames.filter(
      name => name !== assigneeName
    );

    replaceQueryParams({
      assignees: remainingAssignees.length ? remainingAssignees : null,
      dueStatus: dueStatus || null,
      labels: normalizedLabelNames.length ? normalizedLabelNames : null,
      search: trimmedSearch || null,
    });
  };

  const handleRemoveLabel = labelName => {
    const remainingLabels = normalizedLabelNames.filter(
      name => name !== labelName
    );

    replaceQueryParams({
      assignees: normalizedAssigneeNames.length
        ? normalizedAssigneeNames
        : null,
      dueStatus: dueStatus || null,
      labels: remainingLabels.length ? remainingLabels : null,
      search: trimmedSearch || null,
    });
  };

  const handleRemoveDueStatus = () => {
    replaceQueryParams({
      assignees: normalizedAssigneeNames.length
        ? normalizedAssigneeNames
        : null,
      dueStatus: null,
      labels: normalizedLabelNames.length ? normalizedLabelNames : null,
      search: trimmedSearch || null,
    });
  };

  const handleClearFilters = () => {
    replaceQueryParams({
      assignees: null,
      dueStatus: null,
      labels: null,
      search: trimmedSearch || null,
    });
  };

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
  const arePaneFiltersApplied = hasPaneFiltersApplied(paneFilters);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <BoardHeader
          arePaneFiltersApplied={arePaneFiltersApplied}
          board={board}
          isAddingList={isAddingList}
          search={searchKey}
          totalCards={totalCards}
          onAddList={() => setIsAddingList(true)}
          onOpenFilters={() => setIsSearchFiltersOpen(true)}
          onSearch={value => {
            setSearchKey(value);
            debouncedSearch(value);
          }}
        />
        {arePaneFiltersApplied && (
          <AppliedFilters
            appliedFilters={paneFilters}
            totalCards={totalCards}
            onClearFilters={handleClearFilters}
            onRemoveAssignee={handleRemoveAssignee}
            onRemoveDueStatus={handleRemoveDueStatus}
            onRemoveLabel={handleRemoveLabel}
          />
        )}
        <Scrollable
          className="board-kanban-scroll flex !h-auto w-full flex-col overflow-y-hidden"
          size="small"
        >
          <BoardKanban
            boardName={board.name}
            boardSlug={board.slug}
            isAddingList={isAddingList}
            isFetching={isFetchingCards}
            lists={lists}
            onCancelAddList={() => setIsAddingList(false)}
          />
        </Scrollable>
      </div>
      <SearchFilters
        boardSlug={board.slug}
        filters={paneFilters}
        isOpen={isSearchFiltersOpen}
        onClose={() => setIsSearchFiltersOpen(false)}
        onSubmit={handleFiltersSubmit}
      />
    </div>
  );
};

export default withTitle(Show, "boardView.pageTitle");
