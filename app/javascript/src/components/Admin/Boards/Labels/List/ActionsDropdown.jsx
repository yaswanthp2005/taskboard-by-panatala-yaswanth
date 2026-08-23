import React from "react";

import { MenuHorizontal } from "neetoicons";
import { Button, Dropdown } from "neetoui";
import { useTranslation } from "react-i18next";

const ActionsDropdown = ({ label, onDelete, onEdit }) => {
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
            content: t("labels.actions.menu"),
          }}
        />
      }
    >
      <Dropdown.Menu>
        <Dropdown.MenuItem.Button onClick={() => onEdit(label)}>
          {t("labels.actions.edit")}
        </Dropdown.MenuItem.Button>
        <Dropdown.MenuItem.Button
          style="danger"
          onClick={() => onDelete(label)}
        >
          {t("labels.actions.delete")}
        </Dropdown.MenuItem.Button>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ActionsDropdown;
