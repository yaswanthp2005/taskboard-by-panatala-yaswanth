import dayjs from "dayjs";

const formatBoardUpdatedAt = updatedAt =>
  updatedAt ? dayjs(updatedAt).format("MMM D, YYYY h:mm A") : "-";

const buildBoardsRequestParams = ({ limit, page, search = "" }) => ({
  limit,
  page,
  search: search.trim() || undefined,
});

const getEmptyStateTitleKey = search =>
  search?.trim()
    ? "boards.emptyState.noSearchResults"
    : "boards.emptyState.title";

export {
  buildBoardsRequestParams,
  formatBoardUpdatedAt,
  getEmptyStateTitleKey,
};
