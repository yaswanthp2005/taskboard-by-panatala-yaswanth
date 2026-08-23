import QUERY_KEYS from "constants/query";

import checklistItemsApi from "apis/checklistItems";
import { useMutation, useQueryClient } from "react-query";

const invalidateCardQueries = (queryClient, boardSlug, cardId) => {
  queryClient.invalidateQueries([QUERY_KEYS.BOARDS, boardSlug]);
  queryClient.invalidateQueries([QUERY_KEYS.CARDS, cardId]);
};

const useCreateChecklistItem = (boardSlug, cardId) => {
  const queryClient = useQueryClient();

  return useMutation(
    payload => checklistItemsApi.create({ cardId, ...payload }),
    {
      onSuccess: () => {
        invalidateCardQueries(queryClient, boardSlug, cardId);
      },
    }
  );
};

const useUpdateChecklistItem = (boardSlug, cardId) => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, ...payload }) => checklistItemsApi.update({ id, ...payload }),
    {
      onSuccess: () => {
        invalidateCardQueries(queryClient, boardSlug, cardId);
      },
    }
  );
};

const useDeleteChecklistItem = (boardSlug, cardId) => {
  const queryClient = useQueryClient();

  return useMutation(({ id }) => checklistItemsApi.destroy({ id }), {
    onSuccess: () => {
      invalidateCardQueries(queryClient, boardSlug, cardId);
    },
  });
};

const useBulkDeleteChecklistItems = (boardSlug, cardId) => {
  const queryClient = useQueryClient();

  return useMutation(() => checklistItemsApi.bulkDelete({ cardId }), {
    onSuccess: () => {
      invalidateCardQueries(queryClient, boardSlug, cardId);
    },
  });
};

export {
  useBulkDeleteChecklistItems,
  useCreateChecklistItem,
  useDeleteChecklistItem,
  useUpdateChecklistItem,
};
