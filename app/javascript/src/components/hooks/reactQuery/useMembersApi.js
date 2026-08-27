import { DROPDOWN_FETCH_PARAMS } from "constants/pagination";
import QUERY_KEYS from "constants/query";

import membersApi from "apis/members";
import { useMutation, useQuery, useQueryClient } from "react-query";

const useFetchBoardMembers = (
  boardSlug,
  params = DROPDOWN_FETCH_PARAMS,
  { enabled = true } = {}
) =>
  useQuery(
    [QUERY_KEYS.MEMBERS, boardSlug, params],
    async () => {
      const { data } = await membersApi.fetch({ boardSlug, params });

      return {
        members: data.members,
        pagination: data.pagination,
      };
    },
    { enabled: Boolean(boardSlug) && enabled }
  );

const useInviteMember = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(({ email }) => membersApi.create({ boardSlug, email }), {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.MEMBERS, boardSlug]);
    },
  });
};

const useRemoveMember = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(({ id }) => membersApi.destroy({ boardSlug, id }), {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.MEMBERS, boardSlug]);
    },
  });
};

export { useFetchBoardMembers, useInviteMember, useRemoveMember };
