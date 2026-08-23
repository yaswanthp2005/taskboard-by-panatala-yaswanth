import React, { useMemo, useState } from "react";

import { InlineInput } from "@bigbinary/neeto-molecules/InlineInput";
import {
  useBulkDeleteChecklistItems,
  useCreateChecklistItem,
  useDeleteChecklistItem,
  useUpdateChecklistItem,
} from "components/hooks/reactQuery/useChecklistItemsApi";
import { Clock, MenuHorizontal, UserAdd } from "neetoicons";
import { Button, Checkbox, Dropdown, Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const ChecklistProgressRing = ({ percent }) => {
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg
      aria-hidden
      className="shrink-0"
      height="18"
      viewBox="0 0 18 18"
      width="18"
    >
      <circle
        className="stroke-gray-300"
        cx="9"
        cy="9"
        fill="none"
        r={radius}
        strokeWidth="2"
      />
      <circle
        className="stroke-green-600 transition-all"
        cx="9"
        cy="9"
        fill="none"
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        strokeWidth="2"
        transform="rotate(-90 9 9)"
      />
    </svg>
  );
};

ChecklistProgressRing.propTypes = {
  percent: PropTypes.number.isRequired,
};

const ChecklistItemRow = ({
  item,
  onDeleteItem,
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
          <Button
            aria-label={t("cardDetail.checklist.assignMember")}
            className="text-gray-400"
            icon={UserAdd}
            size="small"
            style="text"
            type="button"
          />
          <Button
            aria-label={t("cardDetail.checklist.setDueDate")}
            className="text-gray-400"
            icon={Clock}
            size="small"
            style="text"
            type="button"
          />
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
                onClick={() => onDeleteItem(item.id)}
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

ChecklistItemRow.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    isComplete: PropTypes.bool.isRequired,
  }).isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onToggleCompleted: PropTypes.func.isRequired,
  showItemActions: PropTypes.bool.isRequired,
};

const ChecklistLayout = ({
  completedCount,
  inputKey,
  isSaving,
  items,
  onCancelInput,
  onDeleteAllItems,
  onDeleteItem,
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
                  onClick={onDeleteAllItems}
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
              onDeleteItem={onDeleteItem}
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

ChecklistLayout.propTypes = {
  completedCount: PropTypes.number.isRequired,
  inputKey: PropTypes.number.isRequired,
  isSaving: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      isComplete: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onCancelInput: PropTypes.func.isRequired,
  onDeleteAllItems: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onSubmitItem: PropTypes.func.isRequired,
  onToggleCompleted: PropTypes.func.isRequired,
  showInput: PropTypes.bool.isRequired,
  showItemActions: PropTypes.bool.isRequired,
};

const PersistedChecklistField = ({
  boardSlug,
  cardId,
  items = [],
  showInput = true,
  showItemActions = true,
}) => {
  const [inputKey, setInputKey] = useState(0);
  const { mutateAsync: createChecklistItem, isLoading: isCreating } =
    useCreateChecklistItem(boardSlug, cardId);

  const { mutateAsync: deleteChecklistItem } = useDeleteChecklistItem(
    boardSlug,
    cardId
  );

  const { mutateAsync: bulkDeleteChecklistItems } = useBulkDeleteChecklistItems(
    boardSlug,
    cardId
  );

  const { mutateAsync: updateChecklistItem } = useUpdateChecklistItem(
    boardSlug,
    cardId
  );

  const completedCount = useMemo(
    () => items.filter(item => item.isComplete).length,
    [items]
  );

  const handleSubmitItem = async text => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    try {
      await createChecklistItem({ text: trimmedText });
      setInputKey(currentKey => currentKey + 1);
    } catch (error) {
      logger.error(error);
    }
  };

  const handleCancelInput = () => {
    setInputKey(currentKey => currentKey + 1);
  };

  const handleToggleCompleted = async item => {
    try {
      await updateChecklistItem({
        id: item.id,
        isComplete: !item.isComplete,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  const handleDeleteItem = async itemId => {
    try {
      await deleteChecklistItem({ id: itemId });
    } catch (error) {
      logger.error(error);
    }
  };

  const handleDeleteAllItems = async () => {
    try {
      await bulkDeleteChecklistItems();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <ChecklistLayout
      completedCount={completedCount}
      inputKey={inputKey}
      isSaving={isCreating}
      items={items}
      showInput={showInput}
      showItemActions={showItemActions}
      onCancelInput={handleCancelInput}
      onDeleteAllItems={handleDeleteAllItems}
      onDeleteItem={handleDeleteItem}
      onSubmitItem={handleSubmitItem}
      onToggleCompleted={handleToggleCompleted}
    />
  );
};

PersistedChecklistField.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  cardId: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      isComplete: PropTypes.bool.isRequired,
    })
  ),
  showInput: PropTypes.bool,
  showItemActions: PropTypes.bool,
};

PersistedChecklistField.defaultProps = {
  items: [],
  showInput: true,
  showItemActions: true,
};

const ChecklistField = ({
  boardSlug,
  cardId,
  items = [],
  showInput = true,
  showItemActions = true,
}) => (
  <PersistedChecklistField
    boardSlug={boardSlug}
    cardId={cardId}
    items={items}
    showInput={showInput}
    showItemActions={showItemActions}
  />
);

ChecklistField.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  cardId: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      isComplete: PropTypes.bool.isRequired,
    })
  ),
  showInput: PropTypes.bool,
  showItemActions: PropTypes.bool,
};

ChecklistField.defaultProps = {
  items: [],
  showInput: true,
  showItemActions: true,
};

export default ChecklistField;
