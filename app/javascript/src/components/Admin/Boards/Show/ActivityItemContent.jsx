import React from "react";

import { Tag, Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { formatMemberName } from "./CardDetailPane/utils";

const ActivityText = ({ bold = false, children, muted = false }) => (
  <Typography
    className={muted ? "text-gray-500" : "text-gray-800"}
    component="span"
    style="body2"
    weight={bold ? "semibold" : "regular"}
  >
    {children}
  </Typography>
);

ActivityText.propTypes = {
  bold: PropTypes.bool,
  children: PropTypes.node.isRequired,
  muted: PropTypes.bool,
};

ActivityText.defaultProps = {
  bold: false,
  muted: false,
};

const ActivityBadge = ({ label }) => (
  <Tag
    className="mx-0.5 inline-flex max-w-full"
    label={label}
    size="small"
    style="primary"
    type="solid"
  />
);

ActivityBadge.propTypes = {
  label: PropTypes.string.isRequired,
};

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

ActivityItemContent.propTypes = {
  activity: PropTypes.shape({
    action: PropTypes.string.isRequired,
    actor: PropTypes.object.isRequired,
    metadata: PropTypes.object,
  }).isRequired,
  cardContext: PropTypes.bool,
};

ActivityItemContent.defaultProps = {
  cardContext: false,
};

export default ActivityItemContent;
