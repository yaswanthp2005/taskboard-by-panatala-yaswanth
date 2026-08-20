import React from "react";

import { Alert } from "neetoui";
import PropTypes from "prop-types";
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

DeleteAlert.propTypes = {
  boardToDelete: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  isDeleting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

DeleteAlert.defaultProps = {
  boardToDelete: null,
};

export default DeleteAlert;
