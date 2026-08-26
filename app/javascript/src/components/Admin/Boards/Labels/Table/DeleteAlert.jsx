import React from "react";

import { Alert } from "neetoui";
import PropTypes from "prop-types";
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

DeleteAlert.propTypes = {
  isDeleting: PropTypes.bool.isRequired,
  labelToDelete: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

DeleteAlert.defaultProps = {
  labelToDelete: null,
};

export default DeleteAlert;
