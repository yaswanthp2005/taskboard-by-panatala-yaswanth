import React from "react";

import { MenuHorizontal } from "neetoicons";
import { Button, Dropdown } from "neetoui";
import { useTranslation } from "react-i18next";

const ActionsDropdown = ({ board, onDelete, onRename }) => {
  const { t } = useTranslation();

  return (
    <Dropdown
      buttonStyle="text"
      dropdownProps={{ appendTo: () => document.body }}
      strategy="fixed"
      customTarget={
        <Button
          icon={MenuHorizontal}
          iconSize={20}
          style="text"
          tooltipProps={{
            content: t("boards.actions.menu"),
          }}
        />
      }
    >
      <Dropdown.Menu>
        <Dropdown.MenuItem.Button onClick={() => onRename(board)}>
          {t("boards.actions.rename")}
        </Dropdown.MenuItem.Button>
        <Dropdown.MenuItem.Button
          style="danger"
          onClick={() => onDelete(board)}
        >
          {t("boards.actions.delete")}
        </Dropdown.MenuItem.Button>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ActionsDropdown;
