import React, { useState } from "react";

import { InlineInput } from "@bigbinary/neeto-molecules/InlineInput";
import { useUpdateList } from "components/hooks/reactQuery/useListsApi";
import { Typography } from "neetoui";
import PropTypes from "prop-types";

const ListTitle = ({ boardSlug, listId, title }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: updateList, isLoading: isSaving } =
    useUpdateList(boardSlug);

  const handleSubmit = async value => {
    const trimmedTitle = value.trim();

    if (!trimmedTitle || trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    try {
      await updateList({ id: listId, title: trimmedTitle });
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
        value={title}
      />
    );
  }

  return (
    <Typography
      className="cursor-pointer truncate"
      style="h5"
      weight="semibold"
      onClick={() => setIsEditing(true)}
    >
      {title}
    </Typography>
  );
};

ListTitle.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  listId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ListTitle;
