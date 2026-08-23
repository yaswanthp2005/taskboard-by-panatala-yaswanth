export const BOARD_TAB_KEYS = {
  LISTS: "lists",
  LABELS: "labels",
};

export const isBoardLabelsPath = pathname => pathname.endsWith("/labels");

export const getActiveBoardTab = pathname =>
  isBoardLabelsPath(pathname) ? BOARD_TAB_KEYS.LABELS : BOARD_TAB_KEYS.LISTS;
