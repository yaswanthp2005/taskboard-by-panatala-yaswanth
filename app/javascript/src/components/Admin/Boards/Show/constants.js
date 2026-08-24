export const BOARD_TAB_KEYS = {
  LISTS: "lists",
  LABELS: "labels",
  ACTIVITIES: "activities",
};

export const isBoardLabelsPath = pathname => pathname.endsWith("/labels");

export const isBoardActivitiesPath = pathname =>
  pathname.endsWith("/activities");

export const getActiveBoardTab = pathname => {
  if (isBoardLabelsPath(pathname)) {
    return BOARD_TAB_KEYS.LABELS;
  }

  if (isBoardActivitiesPath(pathname)) {
    return BOARD_TAB_KEYS.ACTIVITIES;
  }

  return BOARD_TAB_KEYS.LISTS;
};
