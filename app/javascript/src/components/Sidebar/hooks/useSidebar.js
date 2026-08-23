import routes from "constants/routes";

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { getFromLocalStorage } from "utils/storage";

import useLogout from "./useLogout";

import { SIDEBAR_COLLAPSED_STORAGE_KEY } from "../constants";

const useSidebar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { handleLogout } = useLogout();
  const userName = getFromLocalStorage("authUserName");
  const userEmail = getFromLocalStorage("authEmail");
  const [isCollapsed, setIsCollapsed] = useState(
    () => getFromLocalStorage(SIDEBAR_COLLAPSED_STORAGE_KEY) === true
  );

  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsCollapsed(
        getFromLocalStorage(SIDEBAR_COLLAPSED_STORAGE_KEY) === true
      );
    };

    window.addEventListener("sidebar-toggle", handleSidebarToggle);

    return () => {
      window.removeEventListener("sidebar-toggle", handleSidebarToggle);
    };
  }, []);

  const toggleCollapsed = () => {
    const nextValue = !isCollapsed;

    localStorage.setItem(
      SIDEBAR_COLLAPSED_STORAGE_KEY,
      JSON.stringify(nextValue)
    );
    setIsCollapsed(nextValue);
  };

  return {
    handleLogout,
    isCollapsed,
    isOnBoardsDashboard: location.pathname === routes.boards.index,
    location,
    t,
    toggleCollapsed,
    userEmail,
    userName,
  };
};

export default useSidebar;
