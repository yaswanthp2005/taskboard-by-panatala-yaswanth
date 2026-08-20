import routes from "constants/routes";

import { useCallback, useMemo } from "react";

import { useFetchBoards } from "components/hooks/reactQuery/useBoardsApi";
import useQueryParams from "components/hooks/useQueryParams";
import { useHistory } from "react-router-dom";
import { buildURL } from "utils/buildURL";

import { DEFAULT_PAGE_SIZE } from "../constants";

const useBoardsTable = () => {
  const history = useHistory();
  const queryParams = useQueryParams();
  const { page, limit } = queryParams;

  const currentPageNumber = useMemo(() => {
    const parsedPage = Number(page);

    return parsedPage > 0 ? parsedPage : 1;
  }, [page]);

  const pageSize = useMemo(() => {
    const parsedLimit = Number(limit);

    return parsedLimit > 0 ? parsedLimit : DEFAULT_PAGE_SIZE;
  }, [limit]);

  const requestParams = useMemo(
    () => ({
      limit: pageSize,
      page: currentPageNumber,
    }),
    [currentPageNumber, pageSize]
  );

  const { data, isLoading } = useFetchBoards(requestParams);
  const boards = data?.boards ?? [];
  const pagination = data?.pagination ?? {};
  const totalCount = pagination.count ?? 0;

  const handlePageChange = useCallback(
    nextPage => {
      history.replace(
        buildURL({
          path: routes.boards.index,
          page: nextPage === 1 ? null : nextPage,
        })
      );
    },
    [history]
  );

  return {
    boards,
    currentPageNumber,
    handlePageChange,
    isLoading,
    pageSize,
    rowData: boards,
    totalCount,
  };
};

export default useBoardsTable;
