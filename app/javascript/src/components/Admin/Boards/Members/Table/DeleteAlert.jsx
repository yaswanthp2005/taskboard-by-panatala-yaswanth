import React from "react";

import { Alert } from "neetoui";
import { Trans, useTranslation } from "react-i18next";
import { formatMemberName } from "utils/members";

const DeleteAlert = ({ isDeleting, memberToRemove, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const memberName = memberToRemove ? formatMemberName(memberToRemove) : "";

  return (
    <Alert
      isOpen={Boolean(memberToRemove)}
      isSubmitting={isDeleting}
      submitButtonLabel={t("members.delete.submit")}
      title={t("members.delete.title")}
      message={
        <Trans
          components={{ 1: <strong /> }}
          i18nKey="members.delete.confirmMessage"
          values={{ name: memberName }}
        />
      }
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

export default DeleteAlert;
