import React from "react";

import { useUpdateCard } from "components/hooks/reactQuery/useCardsApi";
import { Checkbox } from "neetoui";

const CardCompleteCheckbox = ({ boardSlug, cardId, className, isComplete }) => {
  const { mutateAsync: updateCard, isLoading } = useUpdateCard(boardSlug);

  const handleChange = async event => {
    event.stopPropagation();

    try {
      await updateCard({ id: cardId, isComplete: event.target.checked });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <Checkbox
      checked={isComplete}
      className={className}
      disabled={isLoading}
      label=""
      onChange={handleChange}
      onClick={event => event.stopPropagation()}
    />
  );
};

export default CardCompleteCheckbox;
