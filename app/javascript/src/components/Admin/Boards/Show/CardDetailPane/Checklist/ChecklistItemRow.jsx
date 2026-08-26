import React from "react";

import { MenuHorizontal } from "neetoicons";
import { Checkbox, Dropdown, Typography } from "neetoui";
import { useTranslation } from "react-i18next";

const ChecklistItemRow = ({
  item,
  onRequestDeleteItem,
  onToggleCompleted,
  showItemActions,
}) => {
  const { t } = useTranslation();

  return (
    <li className="flex items-center gap-x-3 py-2">
      <Checkbox
        checked={item.isComplete}
        className="shrink-0 !grow-0"
        label=""
        onChange={() => onToggleCompleted(item)}
      />
      <Typography
        style="body2"
        className={`min-w-0 break-words text-left ${
          item.isComplete ? "text-gray-400 line-through" : "text-gray-800"
        }`}
      >
        {item.text}
      </Typography>
      {showItemActions && (
        <div className="ml-auto flex shrink-0 items-center gap-x-0.5">
          <Dropdown
            dropdownProps={{ appendTo: () => document.body }}
            icon={MenuHorizontal}
            label=""
            position="bottom-end"
            strategy="fixed"
            buttonProps={{
              className: "text-gray-400",
              iconSize: 16,
              size: "small",
              style: "text",
            }}
          >
            <Dropdown.Menu>
              <Dropdown.MenuItem.Button
                style="danger"
                onClick={() => onRequestDeleteItem(item)}
              >
                {t("cardDetail.checklist.removeItem")}
              </Dropdown.MenuItem.Button>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
    </li>
  );
};

export default ChecklistItemRow;
