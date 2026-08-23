import QUERY_KEYS from "constants/query";

import labelsApi from "apis/labels";
import { useMutation, useQuery, useQueryClient } from "react-query";

const useFetchLabels = boardSlug =>
  useQuery(
    [QUERY_KEYS.LABELS, boardSlug],
    async () => {
      const {
        data: { labels },
      } = await labelsApi.fetch({ boardSlug });

      return labels;
    },
    { enabled: Boolean(boardSlug) }
  );

const useCreateLabel = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(payload => labelsApi.create({ boardSlug, ...payload }), {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.LABELS, boardSlug]);
    },
  });
};

const useUpdateLabel = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, ...payload }) => labelsApi.update({ boardSlug, id, ...payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.LABELS, boardSlug]);
      },
    }
  );
};

const useDeleteLabel = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(({ id }) => labelsApi.destroy({ boardSlug, id }), {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.LABELS, boardSlug]);
    },
  });
};

export { useCreateLabel, useDeleteLabel, useFetchLabels, useUpdateLabel };
