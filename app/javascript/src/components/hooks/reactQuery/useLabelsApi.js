import { DROPDOWN_FETCH_PARAMS } from "constants/pagination";
import QUERY_KEYS from "constants/query";

import labelsApi from "apis/labels";
import { useMutation, useQuery, useQueryClient } from "react-query";

const useFetchLabels = (
  boardSlug,
  params = DROPDOWN_FETCH_PARAMS,
  { enabled = true } = {}
) =>
  useQuery(
    [QUERY_KEYS.LABELS, boardSlug, params],
    async () => {
      const { data } = await labelsApi.fetch({ boardSlug, params });

      return {
        labels: data.labels,
        pagination: data.pagination,
      };
    },
    { enabled: Boolean(boardSlug) && enabled }
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
