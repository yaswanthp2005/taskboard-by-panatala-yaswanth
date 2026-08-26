import React from "react";

import { Alert } from "neetoui";
import PropTypes from "prop-types";
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

DeleteAllChecklistItemsAlert.propTypes = {
  isDeleting: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default DeleteAllChecklistItemsAlert;
