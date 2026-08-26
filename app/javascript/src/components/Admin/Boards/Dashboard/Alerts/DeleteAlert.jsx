import React from "react";

import { Alert } from "neetoui";
import { Trans, useTranslation } from "react-i18next";

const DeleteAlert = ({ boardToDelete, isDeleting, onClose, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <Alert
      isOpen={Boolean(boardToDelete)}
      isSubmitting={isDeleting}
      submitButtonLabel={t("common.yesDelete")}
      title={t("boards.delete.title")}
      message={
        <Trans
          components={{ 1: <strong /> }}
          i18nKey="boards.delete.confirmMessage"
          values={{ name: boardToDelete?.name }}
        />
      }
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

export default DeleteAlert;
