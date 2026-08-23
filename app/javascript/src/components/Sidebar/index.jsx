import React from "react";

import classnames from "classnames";
import { NeetoIcon } from "neetoicons";
import { Button, Typography } from "neetoui";
import PropTypes from "prop-types";

import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from "./constants";
import useSidebar from "./hooks/useSidebar";
import NavItem from "./NavItem";
import SidebarToggleChevron from "./SidebarToggleChevron";
import UserProfilePopover from "./UserProfilePopover";

const Sidebar = ({ className }) => {
  const {
    handleLogout,
    isCollapsed,
    location,
    t,
    toggleCollapsed,
    userEmail,
    userName,
  } = useSidebar();

  const renderNavItems = items =>
    items.map(item => (
      <NavItem
        active={item.isActive(location.pathname)}
        icon={item.icon}
        isCollapsed={isCollapsed}
        key={item.labelKey}
        label={t(item.labelKey)}
        path={item.path}
      />
    ));

  return (
    <aside
      className={classnames(
        "flex flex-shrink-0 flex-col justify-between border-r border-gray-200 bg-white py-4 transition-all duration-200",
        isCollapsed ? "w-16" : "w-60",
        className
      )}
    >
      <div className="flex flex-col gap-y-3 px-2">
        <div
          className={classnames("flex px-2 py-1", {
            "flex-col items-center gap-y-2": isCollapsed,
            "items-center justify-between gap-x-2": !isCollapsed,
          })}
        >
          <div
            className={classnames("flex min-w-0 items-center gap-x-2", {
              "justify-center": isCollapsed,
            })}
          >
            <NeetoIcon size={isCollapsed ? 28 : 32} />
            {!isCollapsed && (
              <Typography
                className="truncate text-gray-900"
                style="h4"
                weight="semibold"
              >
                {t("title")}
              </Typography>
            )}
          </div>
          <Button
            data-cy="sidebar-toggle-button"
            icon={() => <SidebarToggleChevron />}
            style="text"
            aria-label={t(
              isCollapsed ? "sidebar.showMenu" : "sidebar.hideMenu"
            )}
            className={classnames("flex-shrink-0", {
              "scale-x-[-1]": isCollapsed,
            })}
            tooltipProps={{
              content: t(isCollapsed ? "sidebar.showMenu" : "sidebar.hideMenu"),
              position: "bottom",
            }}
            onClick={toggleCollapsed}
          />
        </div>
        <nav className="flex flex-col gap-y-1">
          {renderNavItems(PRIMARY_NAV_ITEMS)}
          {SECONDARY_NAV_ITEMS.length > 0 && (
            <>
              <div className="my-2 border-t border-gray-200" />
              {renderNavItems(SECONDARY_NAV_ITEMS)}
            </>
          )}
        </nav>
      </div>
      <div className="flex flex-col gap-y-3 px-2">
        <div className="border-t border-gray-200" />
        <UserProfilePopover
          isCollapsed={isCollapsed}
          t={t}
          userEmail={userEmail}
          userName={userName}
          onLogout={handleLogout}
        />
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
};

Sidebar.defaultProps = {
  className: "",
};

export default Sidebar;
