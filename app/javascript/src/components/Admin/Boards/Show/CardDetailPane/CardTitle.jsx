import React, { useState } from "react";

import { InlineInput } from "@bigbinary/neeto-molecules/InlineInput";
import { useUpdateCard } from "components/hooks/reactQuery/useCardsApi";
import { Typography } from "neetoui";
import PropTypes from "prop-types";

const CardTitle = ({ boardSlug, cardId, title }) => {
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
      className="min-w-0 flex-1 cursor-pointer break-words"
      style="h3"
      weight="semibold"
      onClick={() => setIsEditing(true)}
    >
      {title}
    </Typography>
  );
};

CardTitle.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  cardId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default CardTitle;
