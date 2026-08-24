import routes from "constants/routes";

import React, { useLayoutEffect, useRef } from "react";

import { Tab } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { buildURL } from "utils/buildURL";

import BoardTitle from "./BoardTitle";
import { BOARD_TAB_KEYS, getActiveBoardTab } from "./constants";

const BoardNavHeader = ({ board }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const headerRef = useRef(null);
  const activeTab = getActiveBoardTab(location.pathname);

  useLayoutEffect(() => {
    const updateHeaderHeight = () => {
      if (!headerRef.current) {
        return;
      }

      document.body.style.setProperty(
        "--neeto-molecules-effective-header-height",
        `${headerRef.current.offsetHeight}px`
      );
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      document.body.style.setProperty(
        "--neeto-molecules-effective-header-height",
        "0px"
      );
    };
  }, []);

  const handleTabChange = tab => {
    if (tab === BOARD_TAB_KEYS.LABELS) {
      history.push(buildURL({ path: routes.boards.labels, slug: board.slug }));

      return;
    }

    if (tab === BOARD_TAB_KEYS.ACTIVITIES) {
      history.push(
        buildURL({ path: routes.boards.activities, slug: board.slug })
      );

      return;
    }

    if (tab === BOARD_TAB_KEYS.MEMBERS) {
      history.push(buildURL({ path: routes.boards.members, slug: board.slug }));

      return;
    }

    history.push(buildURL({ path: routes.boards.show, slug: board.slug }));
  };

  return (
    <div
      className="neeto-ui-border-gray-200 flex h-16 w-full flex-shrink-0 items-center border-b px-5 py-2 lg:px-10"
      ref={headerRef}
    >
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
        <BoardTitle boardSlug={board.slug} name={board.name} />
        <Tab>
          <Tab.Item
            active={activeTab === BOARD_TAB_KEYS.LISTS}
            data-cy="lists-tab"
            onClick={() => handleTabChange(BOARD_TAB_KEYS.LISTS)}
          >
            {t("boardView.tabs.lists")}
          </Tab.Item>
          <Tab.Item
            active={activeTab === BOARD_TAB_KEYS.LABELS}
            data-cy="labels-tab"
            onClick={() => handleTabChange(BOARD_TAB_KEYS.LABELS)}
          >
            {t("boardView.tabs.labels")}
          </Tab.Item>
          <Tab.Item
            active={activeTab === BOARD_TAB_KEYS.ACTIVITIES}
            data-cy="activities-tab"
            onClick={() => handleTabChange(BOARD_TAB_KEYS.ACTIVITIES)}
          >
            {t("boardView.tabs.activities")}
          </Tab.Item>
          <Tab.Item
            active={activeTab === BOARD_TAB_KEYS.MEMBERS}
            data-cy="members-tab"
            onClick={() => handleTabChange(BOARD_TAB_KEYS.MEMBERS)}
          >
            {t("boardView.tabs.members")}
          </Tab.Item>
        </Tab>
        <span />
      </div>
    </div>
  );
};

BoardNavHeader.propTypes = {
  board: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default BoardNavHeader;
