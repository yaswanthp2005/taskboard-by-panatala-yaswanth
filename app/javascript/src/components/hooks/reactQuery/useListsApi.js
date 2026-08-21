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

export { useUpdateList };
