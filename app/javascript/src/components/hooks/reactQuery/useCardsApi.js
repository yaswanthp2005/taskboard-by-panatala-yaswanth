import QUERY_KEYS from "constants/query";

import cardsApi from "apis/cards";
import { useMutation, useQuery, useQueryClient } from "react-query";

const useCreateCard = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(payload => cardsApi.create({ boardSlug, ...payload }), {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.BOARDS, boardSlug]);
    },
  });
};

const useFetchCard = (id, { enabled = true } = {}) =>
  useQuery(
    [QUERY_KEYS.CARDS, id],
    async () => {
      const { data } = await cardsApi.show({ id });

      return data;
    },
    { enabled: Boolean(id) && enabled }
  );

const useUpdateCard = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(payload => cardsApi.update(payload), {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries([QUERY_KEYS.BOARDS, boardSlug]);
      queryClient.invalidateQueries([QUERY_KEYS.CARDS, variables.id]);
    },
  });
};

const useDeleteCard = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(({ id }) => cardsApi.destroy({ id }), {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries([QUERY_KEYS.BOARDS, boardSlug]);
      queryClient.removeQueries([QUERY_KEYS.CARDS, variables.id]);
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

export {
  useCreateCard,
  useDeleteCard,
  useFetchCard,
  useMoveCard,
  useUpdateCard,
};
