import React from "react";

import { useDeleteLabel } from "components/hooks/reactQuery/useLabelsApi";

import DeleteAlert from "./DeleteAlert";
import LabelRow from "./LabelRow";

const LabelsList = ({
  boardSlug,
  labelToDelete,
  labels,
  onCloseDeleteAlert,
  onDelete,
  onEdit,
}) => {
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
