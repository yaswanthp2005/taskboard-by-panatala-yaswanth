import QUERY_KEYS from "constants/query";

import cardsApi from "apis/cards";
import { useMutation, useQueryClient } from "react-query";

const useCreateCard = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(payload => cardsApi.create({ boardSlug, ...payload }), {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.BOARDS, boardSlug]);
    },
  });
};

const useReorderCards = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(payload => cardsApi.reorder({ boardSlug, ...payload }), {
    onMutate: async ({ listId, cardIds }) => {
      await queryClient.cancelQueries([QUERY_KEYS.BOARDS, boardSlug]);

      const previousBoard = queryClient.getQueryData([
        QUERY_KEYS.BOARDS,
        boardSlug,
      ]);

      if (!previousBoard) {
        return { previousBoard };
      }

      const cardsById = Object.fromEntries(
        (previousBoard.lists ?? [])
          .flatMap(list => list.cards ?? [])
          .map(card => [card.id, card])
      );

      queryClient.setQueryData([QUERY_KEYS.BOARDS, boardSlug], {
        ...previousBoard,
        lists: (previousBoard.lists ?? []).map(list => {
          if (list.id !== listId) {
            return list;
          }

          return {
            ...list,
            cards: cardIds.map((id, index) => ({
              ...cardsById[id],
              position: index + 1,
            })),
          };
        }),
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

export { useCreateCard, useReorderCards };
