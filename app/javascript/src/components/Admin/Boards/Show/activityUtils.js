import dayjs from "dayjs";

import { formatMemberName } from "./CardDetailPane/utils";

const formatActivityMessage = (activity, t, { cardContext = false } = {}) => {
  const actorName = formatMemberName(activity.actor);
  const { metadata = {} } = activity;
  const cardTitle = metadata.cardTitle;
  const listTitle = metadata.listTitle;
  const cardTarget = cardContext
    ? t("activity.thisCard")
    : cardTitle || t("activity.aCard");

  switch (activity.action) {
    case "card_created":
      return t("activity.actions.cardCreated", {
        actorName,
        cardTitle: cardTarget,
      });
    case "card_updated":
      return t("activity.actions.cardUpdated", {
        actorName,
        cardTitle: cardTarget,
      });
    case "card_moved":
      return t("activity.actions.cardMoved", {
        actorName,
        cardTitle: cardTarget,
        listTitle: metadata.destinationListTitle,
      });
    case "card_deleted":
      return t("activity.actions.cardDeleted", {
        actorName,
        cardTitle: cardTitle || cardTarget,
      });
    case "list_created":
      return t("activity.actions.listCreated", { actorName, listTitle });
    case "list_updated":
      return t("activity.actions.listUpdated", { actorName, listTitle });
    case "list_deleted":
      return t("activity.actions.listDeleted", { actorName, listTitle });
    default:
      return t("activity.actions.default", { actorName });
  }
};

const formatActivityTimestamp = createdAt =>
  dayjs(createdAt).format("MMM D, YYYY [at] h:mm A");

export { formatActivityMessage, formatActivityTimestamp };
