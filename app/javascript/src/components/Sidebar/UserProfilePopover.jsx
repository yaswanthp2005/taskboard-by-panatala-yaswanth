import React, { useRef } from "react";

import Avvvatars from "avvvatars-react";
import { Popover } from "neetoui";
import PropTypes from "prop-types";

import UserMenu from "./UserMenu";

const UserProfilePopover = ({
  isCollapsed,
  onLogout,
  t,
  userEmail,
  userName,
}) => {
  const popoverReference = useRef(null);

  if (!isCollapsed) {
    return (
      <UserMenu
        t={t}
        userEmail={userEmail}
        userName={userName}
        onLogout={onLogout}
      />
    );
  }

  return (
    <>
      <button
        aria-label={userName || t("common.user")}
        className="flex w-full justify-center rounded-lg p-1 hover:bg-gray-100"
        ref={popoverReference}
        type="button"
      >
        <Avvvatars
          size={32}
          style="character"
          value={userName || t("common.user")}
        />
      </button>
      <Popover
        interactive
        hideOnClick={false}
        offset={[0, 8]}
        position="right-end"
        reference={popoverReference}
        strategy="fixed"
        trigger="mouseenter focus"
      >
        <UserMenu
          t={t}
          userEmail={userEmail}
          userName={userName}
          onLogout={onLogout}
        />
      </Popover>
    </>
  );
};

UserProfilePopover.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  userEmail: PropTypes.string,
  userName: PropTypes.string,
};

UserProfilePopover.defaultProps = {
  userEmail: null,
  userName: null,
};

export default UserProfilePopover;
