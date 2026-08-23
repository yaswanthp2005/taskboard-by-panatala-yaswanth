import React from "react";

import classnames from "classnames";
import { Button } from "neetoui";
import PropTypes from "prop-types";

const NavItem = ({ active, icon, isCollapsed, label, path }) => {
  const buttonClassName = classnames(
    "w-full !justify-end rounded-lg !px-3 !text-left",
    {
      "neeto-ui-bg-primary-500 !text-white hover:neeto-ui-bg-primary-600 hover:!text-white":
        active,
      "!text-gray-800 hover:!bg-gray-100": !active,
      "!justify-center !px-2": isCollapsed,
    }
  );

  return (
    <Button
      fullWidth
      className={buttonClassName}
      icon={icon}
      iconPosition="left"
      iconSize={20}
      label={isCollapsed ? undefined : label}
      style="text"
      to={path}
      tooltipProps={isCollapsed ? { content: label } : undefined}
    />
  );
};

NavItem.propTypes = {
  active: PropTypes.bool.isRequired,
  icon: PropTypes.elementType.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default NavItem;
