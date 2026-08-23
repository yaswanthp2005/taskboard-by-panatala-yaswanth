import React from "react";

import Avvvatars from "avvvatars-react";
import { Left } from "neetoicons";
import { Button, Typography } from "neetoui";
import PropTypes from "prop-types";

const UserMenu = ({ onLogout, t, userEmail, userName }) => (
  <div className="w-56">
    <div className="mb-3 flex items-center gap-x-2 text-left">
      <Avvvatars
        size={28}
        style="character"
        value={userName || t("common.user")}
      />
      <div className="min-w-0 flex-1">
        <Typography className="text-gray-900" style="body2" weight="semibold">
          {userName || t("common.user")}
        </Typography>
        <Typography className="text-gray-500" style="body3" weight="normal">
          {userEmail || "-"}
        </Typography>
      </div>
    </div>
    <div className="mb-2 border-t border-gray-200" />
    <Button
      fullWidth
      className="!justify-end !px-3"
      icon={Left}
      iconPosition="left"
      iconSize={16}
      label={t("sidebar.logout")}
      style="text"
      onClick={onLogout}
    />
  </div>
);

UserMenu.propTypes = {
  onLogout: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  userEmail: PropTypes.string,
  userName: PropTypes.string,
};

UserMenu.defaultProps = {
  userEmail: null,
  userName: null,
};

export default UserMenu;
