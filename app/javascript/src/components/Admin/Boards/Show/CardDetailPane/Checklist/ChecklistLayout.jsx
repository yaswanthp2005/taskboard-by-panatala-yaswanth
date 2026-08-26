import React from "react";

import { InlineInput } from "@bigbinary/neeto-molecules/InlineInput";
import { MenuHorizontal } from "neetoicons";
import { Dropdown, Typography } from "neetoui";
import { useTranslation } from "react-i18next";

import ChecklistItemRow from "./ChecklistItemRow";
import ChecklistProgressRing from "./ChecklistProgressRing";

const ChecklistLayout = ({
  completedCount,
  inputKey,
  isSaving,
  items,
  onCancelInput,
  onRequestDeleteAllItems,
  onRequestDeleteItem,
  onSubmitItem,
  onToggleCompleted,
  showInput,
  showItemActions,
}) => {
  const { t } = useTranslation();

  const progressPercent =
    items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
      <div className="flex items-center gap-x-3 border-b border-gray-200 px-4 py-3">
        <Typography
          className="shrink-0 text-left"
          style="body2"
          weight="semibold"
        >
          {t("cardDetail.checklist.title")}
        </Typography>
        <div className="ml-auto flex shrink-0 items-center gap-x-3">
          {items.length > 0 && (
            <div className="flex items-center gap-x-2">
              <ChecklistProgressRing percent={progressPercent} />
              <Typography className="text-gray-500" style="body3">
                {t("cardDetail.checklist.progress", {
                  completed: completedCount,
                  total: items.length,
                })}
              </Typography>
            </div>
          )}
          {items.length > 0 && showItemActions && (
            <Dropdown
              buttonProps={{ iconSize: 16, size: "small", style: "text" }}
              dropdownProps={{ appendTo: () => document.body }}
              icon={MenuHorizontal}
              label=""
              position="bottom-end"
              strategy="fixed"
            >
              <Dropdown.Menu>
                <Dropdown.MenuItem.Button
                  style="danger"
                  onClick={onRequestDeleteAllItems}
                >
                  {t("cardDetail.checklist.deleteAll")}
                </Dropdown.MenuItem.Button>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
      {items.length > 0 && (
        <ul className="flex flex-col px-4 pt-1">
          {items.map(item => (
            <ChecklistItemRow
              item={item}
              key={item.id}
              showItemActions={showItemActions}
              onRequestDeleteItem={onRequestDeleteItem}
              onToggleCompleted={onToggleCompleted}
            />
          ))}
        </ul>
      )}
      {showInput && (
        <div
          className={`px-4 py-3 ${
            items.length > 0 ? "border-t border-gray-200" : ""
          }`}
        >
          <InlineInput
            clearOnSave
            className="w-full"
            handleCancel={onCancelInput}
            handleSubmit={onSubmitItem}
            isSaving={isSaving}
            key={inputKey}
            placeholder={t("cardDetail.checklist.itemPlaceholder")}
            value=""
          />
        </div>
      )}
    </div>
  );
};

export default ChecklistLayout;
