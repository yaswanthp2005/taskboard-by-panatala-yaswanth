import QUERY_KEYS from "constants/query";

import membersApi from "apis/members";
import { useQuery } from "react-query";

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

export { useFetchBoardMembers };
