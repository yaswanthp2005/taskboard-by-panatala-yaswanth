import QUERY_KEYS from "constants/query";

import activitiesApi from "apis/activities";
import { useQuery } from "react-query";

const useFetchBoardActivities = (boardSlug, { enabled = true } = {}) =>
  useQuery(
    [QUERY_KEYS.ACTIVITIES, "board", boardSlug],
    async () => {
      const {
        data: { activities },
      } = await activitiesApi.fetchForBoard({ boardSlug });

      return activities;
    },
    { enabled: Boolean(boardSlug) && enabled }
  );

const useFetchCardActivities = (cardId, { enabled = true } = {}) =>
  useQuery(
    [QUERY_KEYS.ACTIVITIES, "card", cardId],
    async () => {
      const {
        data: { activities },
      } = await activitiesApi.fetchForCard({ cardId });

      return activities;
    },
    { enabled: Boolean(cardId) && enabled }
  );

export { useFetchBoardActivities, useFetchCardActivities };
