import React from "react";

import { useUpdateCard } from "components/hooks/reactQuery/useCardsApi";
import PropTypes from "prop-types";

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

AssigneePicker.propTypes = {
  assignees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    })
  ),
  boardSlug: PropTypes.string.isRequired,
  cardId: PropTypes.string.isRequired,
};

AssigneePicker.defaultProps = {
  assignees: [],
};

export default AssigneePicker;
