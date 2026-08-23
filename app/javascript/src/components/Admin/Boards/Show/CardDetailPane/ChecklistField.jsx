import React, { useMemo, useState } from "react";

import {
  useCreateChecklistItem,
  useDeleteChecklistItem,
  useUpdateChecklistItem,
} from "components/hooks/reactQuery/useChecklistItemsApi";
import { Close, Plus } from "neetoicons";
import { Button, Checkbox, Input, Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const ChecklistField = ({ boardSlug, cardId, items = [] }) => {
  const { t } = useTranslation();
  const [newItemText, setNewItemText] = useState("");
  const { mutateAsync: createChecklistItem, isLoading: isCreating } =
    useCreateChecklistItem(boardSlug, cardId);

  const { mutateAsync: deleteChecklistItem } = useDeleteChecklistItem(
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

  const handleAddItem = async () => {
    const text = newItemText.trim();
    if (!text) {
      return;
    }

    try {
      await createChecklistItem({ text });
      setNewItemText("");
    } catch (error) {
      logger.error(error);
    }
  };

  const handleInputKeyDown = event => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    handleAddItem();
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

  return (
    <div className="flex w-full flex-col gap-y-3">
      <div className="flex items-center justify-between gap-x-3">
        <Typography style="body2" weight="semibold">
          {t("cardDetail.checklist.title")}
        </Typography>
        {items.length > 0 && (
          <Typography className="text-gray-500" style="body3">
            {t("cardDetail.checklist.progress", {
              completed: completedCount,
              total: items.length,
            })}
          </Typography>
        )}
      </div>
      {items.length > 0 && (
        <ul className="flex flex-col gap-y-2">
          {items.map(item => (
            <li
              className="flex items-start gap-x-3 rounded-lg border border-gray-200 px-3 py-2"
              key={item.id}
            >
              <Checkbox
                checked={item.isComplete}
                label=""
                onChange={() => handleToggleCompleted(item)}
              />
              <Typography
                style="body2"
                className={`min-w-0 flex-1 ${
                  item.isComplete ? "text-gray-400 line-through" : ""
                }`}
              >
                {item.text}
              </Typography>
              <Button
                aria-label={t("cardDetail.checklist.removeItem")}
                icon={Close}
                style="text"
                type="button"
                onClick={() => handleDeleteItem(item.id)}
              />
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-end gap-x-2">
        <Input
          className="w-full"
          label={t("cardDetail.checklist.addItemLabel")}
          placeholder={t("cardDetail.checklist.addItemPlaceholder")}
          value={newItemText}
          onChange={event => setNewItemText(event.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <Button
          disabled={!newItemText.trim() || isCreating}
          icon={Plus}
          label={t("cardDetail.checklist.addItem")}
          loading={isCreating}
          style="secondary"
          type="button"
          onClick={handleAddItem}
        />
      </div>
    </div>
  );
};

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
};

ChecklistField.defaultProps = {
  items: [],
};

export default ChecklistField;
