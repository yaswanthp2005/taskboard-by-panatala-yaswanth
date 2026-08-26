import React from "react";

import { Alert } from "neetoui";
import { Trans, useTranslation } from "react-i18next";

const DeleteCardAlert = ({ cardToDelete, isDeleting, onClose, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <Alert
      isOpen={Boolean(cardToDelete)}
      isSubmitting={isDeleting}
      submitButtonLabel={t("common.yesDelete")}
      title={t("cardDetail.delete.title")}
      message={
        <Trans
          components={{ 1: <strong /> }}
          i18nKey="cardDetail.delete.confirmMessage"
          values={{ title: cardToDelete?.title }}
        />
      }
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

export default DeleteCardAlert;
