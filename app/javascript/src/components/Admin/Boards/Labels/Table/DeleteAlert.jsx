import React from "react";

import { Alert } from "neetoui";
import { Trans, useTranslation } from "react-i18next";

const DeleteAlert = ({ isDeleting, labelToDelete, onClose, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <Alert
      isOpen={Boolean(labelToDelete)}
      isSubmitting={isDeleting}
      submitButtonLabel={t("common.yesDelete")}
      title={t("labels.delete.title")}
      message={
        <Trans
          components={{ 1: <strong /> }}
          i18nKey="labels.delete.confirmMessage"
          values={{ name: labelToDelete?.name }}
        />
      }
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

export default DeleteAlert;
