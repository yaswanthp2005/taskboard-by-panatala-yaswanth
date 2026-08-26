import React, { useState } from "react";

import { InlineInput } from "@bigbinary/neeto-molecules/InlineInput";
import { useUpdateCard } from "components/hooks/reactQuery/useCardsApi";
import { Typography } from "neetoui";

const CardTitle = ({ boardSlug, cardId, isComplete = false, title }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: updateCard, isLoading: isSaving } =
    useUpdateCard(boardSlug);

  const handleSubmit = async value => {
    const trimmedTitle = value.trim();

    if (!trimmedTitle || trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    try {
      await updateCard({ id: cardId, title: trimmedTitle });
      setIsEditing(false);
    } catch (error) {
      logger.error(error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <InlineInput
        autoFocus
        className="card-detail-pane__title-inline-input min-w-0 flex-1"
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        isSaving={isSaving}
        value={title}
      />
    );
  }

  return (
    <Typography
      style="h3"
      weight="semibold"
      className={`min-w-0 flex-1 cursor-pointer break-words ${
        isComplete ? "text-gray-400 line-through" : ""
      }`}
      onClick={() => setIsEditing(true)}
    >
      {title}
    </Typography>
  );
};

export default CardTitle;
