import QUERY_KEYS from "constants/query";

import boardsApi from "apis/boards";
import { useMutation, useQuery, useQueryClient } from "react-query";

const useFetchBoards = (params = {}) =>
  useQuery([QUERY_KEYS.BOARDS, params], async () => {
    const { data } = await boardsApi.fetch(params);

    return {
      boards: data.boards,
      pagination: data.pagination,
    };
  });

const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation(payload => boardsApi.create(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.BOARDS]);
    },
  });
};

export { useCreateBoard, useFetchBoards };
