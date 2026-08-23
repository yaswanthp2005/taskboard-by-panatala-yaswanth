import routes from "constants/routes";

import { List } from "neetoicons";

const SIDEBAR_COLLAPSED_STORAGE_KEY = "sidebarCollapsed";

const PRIMARY_NAV_ITEMS = [
  {
    labelKey: "sidebar.boards",
    path: routes.boards.index,
    icon: List,
    isActive: pathname =>
      pathname === routes.boards.index ||
      (pathname !== routes.login && pathname !== routes.signup),
  },
];

const SECONDARY_NAV_ITEMS = [];

export {
  PRIMARY_NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
  SIDEBAR_COLLAPSED_STORAGE_KEY,
};
