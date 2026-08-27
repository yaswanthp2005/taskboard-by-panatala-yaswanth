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

const useFetchBoard = (slug, options = {}) =>
  useQuery(
    [QUERY_KEYS.BOARDS, slug],
    async () => {
      const { data } = await boardsApi.show(slug);

      return data;
    },
    {
      enabled: Boolean(slug),
      retry: (failureCount, error) =>
        error?.response?.status !== 404 && failureCount < 3,
      ...options,
    }
  );

const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation(payload => boardsApi.create(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.BOARDS]);
    },
  });
};

const useUpdateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation(payload => boardsApi.update(payload), {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([QUERY_KEYS.BOARDS]);
      queryClient.invalidateQueries([QUERY_KEYS.BOARDS, variables.slug]);
    },
  });
};

const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation(payload => boardsApi.destroy(payload), {
    onSuccess: (_, { slug }) => {
      queryClient.cancelQueries([QUERY_KEYS.BOARDS, slug]);
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          queryKey[0] === QUERY_KEYS.BOARDS && typeof queryKey[1] === "object",
      });
    },
  });
};

export {
  useCreateBoard,
  useDeleteBoard,
  useFetchBoard,
  useFetchBoards,
  useUpdateBoard,
};
