import React from "react";

import { Alert } from "neetoui";
import PropTypes from "prop-types";
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

DeleteCardAlert.propTypes = {
  cardToDelete: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  isDeleting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

DeleteCardAlert.defaultProps = {
  cardToDelete: null,
};

export default DeleteCardAlert;
