export const BOARD_TAB_KEYS = {
  LISTS: "lists",
  LABELS: "labels",
  ACTIVITIES: "activities",
  MEMBERS: "members",
};

export const isBoardLabelsPath = pathname => pathname.endsWith("/labels");

export const isBoardActivitiesPath = pathname =>
  pathname.endsWith("/activities");

export const isBoardMembersPath = pathname => pathname.endsWith("/members");

export const getActiveBoardTab = pathname => {
  if (isBoardLabelsPath(pathname)) {
    return BOARD_TAB_KEYS.LABELS;
  }

  if (isBoardActivitiesPath(pathname)) {
    return BOARD_TAB_KEYS.ACTIVITIES;
  }

  if (isBoardMembersPath(pathname)) {
    return BOARD_TAB_KEYS.MEMBERS;
  }

  return BOARD_TAB_KEYS.LISTS;
};
