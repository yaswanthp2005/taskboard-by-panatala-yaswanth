import React from "react";

import DeleteAlert from "components/Admin/Boards/Dashboard/Alerts/DeleteAlert";
import { Button, Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const DeleteBoardSection = ({
  board,
  isDeleting,
  isDeleteAlertOpen,
  onCloseDeleteAlert,
  onDelete,
  onOpenDeleteAlert,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Typography style="h2" weight="semibold">
          {t("boardSettings.dangerZone.title")}
        </Typography>
        <Typography className="mt-2 text-gray-600" style="body2">
          {t("boardSettings.dangerZone.subtitle")}
        </Typography>
        <Button
          className="mt-6"
          label={t("boardSettings.dangerZone.deleteBoard")}
          style="danger"
          onClick={onOpenDeleteAlert}
        />
      </div>
      <DeleteAlert
        boardToDelete={isDeleteAlertOpen ? board : null}
        isDeleting={isDeleting}
        onClose={onCloseDeleteAlert}
        onSubmit={onDelete}
      />
    </>
  );
};

DeleteBoardSection.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  isDeleteAlertOpen: PropTypes.bool.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  onCloseDeleteAlert: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onOpenDeleteAlert: PropTypes.func.isRequired,
};

export default DeleteBoardSection;
