export const BOARD_TAB_KEYS = {
  LISTS: "lists",
  ACTIVITIES: "activities",
  SETTINGS: "settings",
};

export const isBoardLabelsPath = pathname => pathname.endsWith("/labels");

export const isBoardActivitiesPath = pathname =>
  pathname.endsWith("/activities");

export const isBoardMembersPath = pathname => pathname.endsWith("/members");

export const isBoardSettingsPath = pathname => pathname.endsWith("/settings");

export const getActiveBoardTab = pathname => {
  if (
    isBoardLabelsPath(pathname) ||
    isBoardMembersPath(pathname) ||
    isBoardSettingsPath(pathname)
  ) {
    return BOARD_TAB_KEYS.SETTINGS;
  }

  if (isBoardActivitiesPath(pathname)) {
    return BOARD_TAB_KEYS.ACTIVITIES;
  }

  return BOARD_TAB_KEYS.LISTS;
};
