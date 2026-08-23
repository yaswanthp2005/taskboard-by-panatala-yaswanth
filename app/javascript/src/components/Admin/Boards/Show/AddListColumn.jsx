import React from "react";

import { InlineInput } from "@bigbinary/neeto-molecules/InlineInput";
import { useCreateList } from "components/hooks/reactQuery/useListsApi";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const AddListColumn = ({ boardSlug, onCancel, onCreated }) => {
  const { t } = useTranslation();
  const { mutateAsync: createList, isLoading: isCreating } =
    useCreateList(boardSlug);

  const handleSubmit = async value => {
    const trimmedTitle = value.trim();

    if (!trimmedTitle) {
      onCancel?.();

      return;
    }

    try {
      await createList({ title: trimmedTitle });
      onCreated?.();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <div className="neeto-molecules-boardview-section neeto-ui-rounded-xl flex h-full shrink-0 flex-col bg-gray-100">
      <div className="neeto-molecules-boardview-section__header shrink-0 py-3">
        <InlineInput
          autoFocus
          className="w-full"
          handleCancel={onCancel}
          handleSubmit={handleSubmit}
          isSaving={isCreating}
          placeholder={t("boardView.addListPlaceholder")}
          value=""
        />
      </div>
    </div>
  );
};

AddListColumn.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreated: PropTypes.func.isRequired,
};

export default AddListColumn;
