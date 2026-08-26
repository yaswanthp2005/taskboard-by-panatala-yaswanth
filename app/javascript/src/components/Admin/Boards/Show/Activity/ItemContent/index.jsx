import React from "react";

import { useTranslation } from "react-i18next";
import { formatMemberName } from "utils/members";

import ActivityBadge from "./ActivityBadge";
import ActivityText from "./ActivityText";

const ActivityItemContent = ({ activity, cardContext = false }) => {
  const { t } = useTranslation();
  const actorName = formatMemberName(activity.actor);
  const { metadata = {} } = activity;
  const cardTitle = metadata.cardTitle;
  const listTitle = metadata.listTitle;

  const renderRow = content => (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1">{content}</div>
  );

  switch (activity.action) {
    case "card_created":
      return renderRow(
        <>
          <ActivityText bold>{actorName}</ActivityText>
          <ActivityText muted>{t("activity.verbs.created")}</ActivityText>
          {!cardContext && cardTitle && <ActivityBadge label={cardTitle} />}
          {cardContext && (
            <ActivityText muted>{t("activity.thisCard")}</ActivityText>
          )}
        </>
      );
    case "card_updated":
      return renderRow(
        <>
          <ActivityText bold>{actorName}</ActivityText>
          <ActivityText muted>{t("activity.verbs.updated")}</ActivityText>
          {!cardContext && cardTitle && <ActivityBadge label={cardTitle} />}
          {cardContext && (
            <ActivityText muted>{t("activity.thisCard")}</ActivityText>
          )}
        </>
      );
    case "card_moved":
      return renderRow(
        <>
          <ActivityText bold>{actorName}</ActivityText>
          <ActivityText muted>{t("activity.verbs.moved")}</ActivityText>
          {cardContext ? (
            <ActivityText muted>{t("activity.thisCard")}</ActivityText>
          ) : (
            cardTitle && <ActivityBadge label={cardTitle} />
          )}
          {metadata.sourceListTitle && (
            <>
              <ActivityText muted>{t("activity.verbs.from")}</ActivityText>
              <ActivityBadge label={metadata.sourceListTitle} />
            </>
          )}
          <ActivityText muted>{t("activity.verbs.to")}</ActivityText>
          {metadata.destinationListTitle && (
            <ActivityBadge label={metadata.destinationListTitle} />
          )}
        </>
      );
    case "card_deleted":
      return renderRow(
        <>
          <ActivityText bold>{actorName}</ActivityText>
          <ActivityText muted>{t("activity.verbs.deleted")}</ActivityText>
          {!cardContext && cardTitle && <ActivityBadge label={cardTitle} />}
          {cardContext && (
            <ActivityText muted>{t("activity.thisCard")}</ActivityText>
          )}
        </>
      );
    case "list_created":
      return renderRow(
        <>
          <ActivityText bold>{actorName}</ActivityText>
          <ActivityText muted>{t("activity.verbs.created")}</ActivityText>
          <ActivityText muted>{t("activity.verbs.theList")}</ActivityText>
          {listTitle && <ActivityBadge label={listTitle} />}
        </>
      );
    case "list_updated":
      return renderRow(
        <>
          <ActivityText bold>{actorName}</ActivityText>
          <ActivityText muted>{t("activity.verbs.updated")}</ActivityText>
          <ActivityText muted>{t("activity.verbs.theList")}</ActivityText>
          {listTitle && <ActivityBadge label={listTitle} />}
        </>
      );
    case "list_deleted":
      return renderRow(
        <>
          <ActivityText bold>{actorName}</ActivityText>
          <ActivityText muted>{t("activity.verbs.deleted")}</ActivityText>
          <ActivityText muted>{t("activity.verbs.theList")}</ActivityText>
          {listTitle && <ActivityBadge label={listTitle} />}
        </>
      );
    default:
      return renderRow(
        <>
          <ActivityText bold>{actorName}</ActivityText>
          <ActivityText muted>{t("activity.verbs.defaultAction")}</ActivityText>
        </>
      );
  }
};

export default ActivityItemContent;
