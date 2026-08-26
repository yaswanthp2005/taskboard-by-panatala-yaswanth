import routes from "constants/routes";

import { useCallback, useMemo } from "react";

import { useFetchBoardMembers } from "components/hooks/reactQuery/useMembersApi";
import useQueryParams from "components/hooks/useQueryParams";
import { useHistory, useParams } from "react-router-dom";
import { buildURL } from "utils/buildURL";

import { buildMembersRequestParams, DEFAULT_PAGE_SIZE } from "../constants";

const useMembersTable = () => {
  const history = useHistory();
  const { slug } = useParams();
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
    () =>
      buildMembersRequestParams({
        limit: pageSize,
        page: currentPageNumber,
      }),
    [currentPageNumber, pageSize]
  );

  const { data, isLoading } = useFetchBoardMembers(slug, requestParams);
  const members = data?.members ?? [];
  const pagination = data?.pagination ?? {};
  const totalCount = pagination.count ?? 0;

  const handlePageChange = useCallback(
    nextPage => {
      history.replace(
        buildURL({
          path: routes.boards.members,
          slug,
          page: nextPage === 1 ? null : nextPage,
        })
      );
    },
    [history, slug]
  );

  return {
    currentPageNumber,
    handlePageChange,
    isLoading,
    members,
    pageSize,
    totalCount,
  };
};

export default useMembersTable;
