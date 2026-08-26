import React from "react";

import { useUpdateCard } from "components/hooks/reactQuery/useCardsApi";

import AssigneeDropdown from "./AssigneeDropdown";

const AssigneePicker = ({ assignees = [], boardSlug, cardId }) => {
  const { mutateAsync: updateCard } = useUpdateCard(boardSlug);

  const selectedIds = assignees.map(assignee => assignee.id);

  const handleToggle = async memberId => {
    const nextAssigneeIds = selectedIds.includes(memberId)
      ? selectedIds.filter(id => id !== memberId)
      : [...selectedIds, memberId];

    try {
      await updateCard({ id: cardId, assigneeIds: nextAssigneeIds });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <AssigneeDropdown
      boardSlug={boardSlug}
      selectedIds={selectedIds}
      onToggle={handleToggle}
    />
  );
};

export default AssigneePicker;
