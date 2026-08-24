import QUERY_KEYS from "constants/query";

import membersApi from "apis/members";
import { useMutation, useQuery, useQueryClient } from "react-query";

const useFetchBoardMembers = boardSlug =>
  useQuery(
    [QUERY_KEYS.MEMBERS, boardSlug],
    async () => {
      const {
        data: { members },
      } = await membersApi.fetch({ boardSlug });

      return members;
    },
    { enabled: Boolean(boardSlug) }
  );

const useInviteMember = boardSlug => {
  const queryClient = useQueryClient();

  return useMutation(({ email }) => membersApi.create({ boardSlug, email }), {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.MEMBERS, boardSlug]);
    },
  });
};

export { useFetchBoardMembers, useInviteMember };
