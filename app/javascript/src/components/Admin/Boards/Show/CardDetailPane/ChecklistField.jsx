import React, { useMemo, useState } from "react";

import { InlineInput } from "@bigbinary/neeto-molecules/InlineInput";
import {
  useBulkDeleteChecklistItems,
  useCreateChecklistItem,
  useDeleteChecklistItem,
  useUpdateChecklistItem,
} from "components/hooks/reactQuery/useChecklistItemsApi";
import { MenuHorizontal } from "neetoicons";
import { Checkbox, Dropdown, Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import DeleteAllChecklistItemsAlert from "./DeleteAllChecklistItemsAlert";
import DeleteChecklistItemAlert from "./DeleteChecklistItemAlert";

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

ChecklistItemRow.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    isComplete: PropTypes.bool.isRequired,
  }).isRequired,
  onRequestDeleteItem: PropTypes.func.isRequired,
  onToggleCompleted: PropTypes.func.isRequired,
  showItemActions: PropTypes.bool.isRequired,
};

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
  onRequestDeleteAllItems: PropTypes.func.isRequired,
  onRequestDeleteItem: PropTypes.func.isRequired,
  onSubmitItem: PropTypes.func.isRequired,
  onToggleCompleted: PropTypes.func.isRequired,
  showInput: PropTypes.bool.isRequired,
  showItemActions: PropTypes.bool.isRequired,
};

const PersistedChecklistField = ({
  boardSlug,
  cardId,
  items = [],
  onCloseWhenEmpty,
  showInput = true,
  showItemActions = true,
}) => {
  const [inputKey, setInputKey] = useState(0);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const { mutateAsync: createChecklistItem, isLoading: isCreating } =
    useCreateChecklistItem(boardSlug, cardId);

  const { mutateAsync: deleteChecklistItem, isLoading: isDeletingItem } =
    useDeleteChecklistItem(boardSlug, cardId);

  const {
    mutateAsync: bulkDeleteChecklistItems,
    isLoading: isDeletingAllItems,
  } = useBulkDeleteChecklistItems(boardSlug, cardId);

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

    if (items.length === 0) {
      onCloseWhenEmpty?.();
    }
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

  const handleDeleteItem = async () => {
    if (!itemToDelete) {
      return;
    }

    try {
      await deleteChecklistItem({ id: itemToDelete.id });
      setItemToDelete(null);
    } catch (error) {
      logger.error(error);
    }
  };

  const handleDeleteAllItems = async () => {
    try {
      await bulkDeleteChecklistItems();
      setIsDeleteAllOpen(false);
      onCloseWhenEmpty?.();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <ChecklistLayout
        completedCount={completedCount}
        inputKey={inputKey}
        isSaving={isCreating}
        items={items}
        showInput={showInput}
        showItemActions={showItemActions}
        onCancelInput={handleCancelInput}
        onRequestDeleteAllItems={() => setIsDeleteAllOpen(true)}
        onRequestDeleteItem={setItemToDelete}
        onSubmitItem={handleSubmitItem}
        onToggleCompleted={handleToggleCompleted}
      />
      <DeleteChecklistItemAlert
        isDeleting={isDeletingItem}
        itemToDelete={itemToDelete}
        onClose={() => setItemToDelete(null)}
        onSubmit={handleDeleteItem}
      />
      <DeleteAllChecklistItemsAlert
        isDeleting={isDeletingAllItems}
        isOpen={isDeleteAllOpen}
        onClose={() => setIsDeleteAllOpen(false)}
        onSubmit={handleDeleteAllItems}
      />
    </>
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
  onCloseWhenEmpty: PropTypes.func,
  showInput: PropTypes.bool,
  showItemActions: PropTypes.bool,
};

PersistedChecklistField.defaultProps = {
  items: [],
  onCloseWhenEmpty: undefined,
  showInput: true,
  showItemActions: true,
};

const ChecklistField = ({
  boardSlug,
  cardId,
  items = [],
  onCloseWhenEmpty,
  showInput = true,
  showItemActions = true,
}) => (
  <PersistedChecklistField
    boardSlug={boardSlug}
    cardId={cardId}
    items={items}
    showInput={showInput}
    showItemActions={showItemActions}
    onCloseWhenEmpty={onCloseWhenEmpty}
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
  onCloseWhenEmpty: PropTypes.func,
  showInput: PropTypes.bool,
  showItemActions: PropTypes.bool,
};

ChecklistField.defaultProps = {
  items: [],
  onCloseWhenEmpty: undefined,
  showInput: true,
  showItemActions: true,
};

export default ChecklistField;
