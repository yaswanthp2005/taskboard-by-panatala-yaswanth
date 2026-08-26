import React, { useMemo, useState } from "react";

import {
  useBulkDeleteChecklistItems,
  useCreateChecklistItem,
  useDeleteChecklistItem,
  useUpdateChecklistItem,
} from "components/hooks/reactQuery/useChecklistItemsApi";

import ChecklistLayout from "./ChecklistLayout";

import {
  DeleteAllChecklistItemsAlert,
  DeleteChecklistItemAlert,
} from "../Alerts";

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

export default PersistedChecklistField;
