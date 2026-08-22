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

const useMoveCard = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(payload => cardsApi.move(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.BOARDS, boardSlug]);
    },
  });
};

export { useCreateCard, useMoveCard };
