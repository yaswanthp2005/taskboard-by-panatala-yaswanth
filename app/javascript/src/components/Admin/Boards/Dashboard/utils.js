import dayjs from "dayjs";

const formatBoardUpdatedAt = updatedAt =>
  updatedAt ? dayjs(updatedAt).format("MMM D, YYYY h:mm A") : "-";

const getTruncatedText = (text, maxLength = 80) => {
  const normalizedText = text?.trim() || "";

  if (normalizedText.length <= maxLength) {
    return { displayText: normalizedText || "-", isTruncated: false };
  }

  return {
    displayText: `${normalizedText.slice(0, maxLength)}...`,
    isTruncated: true,
  };
};

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
  getTruncatedText,
};
