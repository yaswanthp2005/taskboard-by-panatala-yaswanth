import React, { useState } from "react";

import { InlineInput } from "@bigbinary/neeto-molecules/InlineInput";
import { useUpdateBoard } from "components/hooks/reactQuery/useBoardsApi";
import { Typography } from "neetoui";
import PropTypes from "prop-types";

const BoardTitle = ({ boardSlug, name }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: updateBoard, isLoading: isSaving } = useUpdateBoard();

  const handleSubmit = async value => {
    const trimmedName = value.trim();

    if (!trimmedName || trimmedName === name) {
      setIsEditing(false);

      return;
    }

    try {
      await updateBoard({ slug: boardSlug, name: trimmedName });
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
        className="w-full"
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        isSaving={isSaving}
        value={name}
      />
    );
  }

  return (
    <Typography
      className="min-w-0 cursor-pointer truncate text-gray-900"
      style="h4"
      weight="semibold"
      onClick={() => setIsEditing(true)}
    >
      {name}
    </Typography>
  );
};

BoardTitle.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default BoardTitle;
