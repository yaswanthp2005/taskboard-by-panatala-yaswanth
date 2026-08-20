import QUERY_KEYS from "constants/query";

import boardsApi from "apis/boards";
import { useQuery } from "react-query";

const useFetchBoards = (params = {}) =>
  useQuery([QUERY_KEYS.BOARDS, params], async () => {
    const { data } = await boardsApi.fetch(params);

    return {
      boards: data.boards,
      pagination: data.pagination,
    };
  });

export { useFetchBoards };
