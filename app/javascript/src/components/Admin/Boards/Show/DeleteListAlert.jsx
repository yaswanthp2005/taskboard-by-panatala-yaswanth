import React from "react";

import { Alert } from "neetoui";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";

const DeleteListAlert = ({ isDeleting, listToDelete, onClose, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <Alert
      isOpen={Boolean(listToDelete)}
      isSubmitting={isDeleting}
      submitButtonLabel={t("common.yesDelete")}
      title={t("boardView.deleteList.title")}
      message={
        <Trans
          components={{ 1: <strong /> }}
          i18nKey="boardView.deleteList.confirmMessage"
          values={{ name: listToDelete?.name }}
        />
      }
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

DeleteListAlert.propTypes = {
  isDeleting: PropTypes.bool.isRequired,
  listToDelete: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

DeleteListAlert.defaultProps = {
  listToDelete: null,
};

export default DeleteListAlert;
