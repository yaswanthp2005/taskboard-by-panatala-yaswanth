import QUERY_KEYS from "constants/query";

import listsApi from "apis/lists";
import { useMutation, useQueryClient } from "react-query";

const useUpdateList = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(payload => listsApi.update({ boardSlug, ...payload }), {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.BOARDS, boardSlug]);
    },
  });
};

const useReorderLists = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(payload => listsApi.reorder({ boardSlug, ...payload }), {
    onMutate: async ({ listIds }) => {
      await queryClient.cancelQueries([QUERY_KEYS.BOARDS, boardSlug]);

      const previousBoard = queryClient.getQueryData([
        QUERY_KEYS.BOARDS,
        boardSlug,
      ]);

      if (!previousBoard) {
        return { previousBoard };
      }

      const listsById = Object.fromEntries(
        (previousBoard.lists ?? []).map(list => [list.id, list])
      );

      queryClient.setQueryData([QUERY_KEYS.BOARDS, boardSlug], {
        ...previousBoard,
        lists: listIds.map((id, index) => ({
          ...listsById[id],
          position: index + 1,
        })),
      });

      return { previousBoard };
    },
    onError: (_error, _payload, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(
          [QUERY_KEYS.BOARDS, boardSlug],
          context.previousBoard
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries([QUERY_KEYS.BOARDS, boardSlug]);
    },
  });
};

const useDeleteList = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(payload => listsApi.destroy({ boardSlug, ...payload }), {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.BOARDS, boardSlug]);
    },
  });
};

export { useDeleteList, useReorderLists, useUpdateList };
