import React from "react";

import { useDeleteLabel } from "components/hooks/reactQuery/useLabelsApi";
import { Plus } from "neetoicons";
import { Button } from "neetoui";
import { useTranslation } from "react-i18next";

import DeleteAlert from "./DeleteAlert";
import LabelRow from "./LabelRow";

const LabelsList = ({
  boardSlug,
  isAddDisabled,
  labelToDelete,
  labels,
  onAddLabel,
  onCloseDeleteAlert,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation();
  const { mutateAsync: deleteLabel, isLoading: isDeleting } =
    useDeleteLabel(boardSlug);

  const handleDeleteSubmit = async () => {
    if (!labelToDelete) {
      return;
    }

    await deleteLabel({ id: labelToDelete.id });
    onCloseDeleteAlert();
  };

  return (
    <>
      <div className="flex flex-col gap-y-3">
        {labels.map(label => (
          <LabelRow
            key={label.id}
            label={label}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
      <div className="mt-4">
        <Button
          disabled={isAddDisabled}
          icon={Plus}
          label={t("labels.addNewLabel")}
          style="link"
          onClick={onAddLabel}
        />
      </div>
      <DeleteAlert
        isDeleting={isDeleting}
        labelToDelete={labelToDelete}
        onClose={onCloseDeleteAlert}
        onSubmit={handleDeleteSubmit}
      />
    </>
  );
};

export default LabelsList;
