import React from "react";

import { Alert } from "neetoui";
import { useTranslation } from "react-i18next";

const DeleteAllChecklistItemsAlert = ({
  isDeleting,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <Alert
      isOpen={isOpen}
      isSubmitting={isDeleting}
      message={t("cardDetail.checklist.deleteAllAlert.confirmMessage")}
      submitButtonLabel={t("common.yesDelete")}
      title={t("cardDetail.checklist.deleteAllAlert.title")}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

export default DeleteAllChecklistItemsAlert;
