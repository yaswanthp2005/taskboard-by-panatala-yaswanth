import React from "react";

import { Alert } from "neetoui";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";

const DeleteChecklistItemAlert = ({
  isDeleting,
  itemToDelete,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <Alert
      isOpen={Boolean(itemToDelete)}
      isSubmitting={isDeleting}
      submitButtonLabel={t("common.yesDelete")}
      title={t("cardDetail.checklist.deleteItem.title")}
      message={
        <Trans
          components={{ 1: <strong /> }}
          i18nKey="cardDetail.checklist.deleteItem.confirmMessage"
          values={{ text: itemToDelete?.text }}
        />
      }
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

DeleteChecklistItemAlert.propTypes = {
  isDeleting: PropTypes.bool.isRequired,
  itemToDelete: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

DeleteChecklistItemAlert.defaultProps = {
  itemToDelete: null,
};

export default DeleteChecklistItemAlert;
