import React from "react";

import { Delete, Edit } from "neetoicons";
import { Button } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const HeaderActions = ({ onDelete, onEdit }) => {
  const { t } = useTranslation();

  return (
    <div className="card-detail-pane__header-actions">
      <Button
        aria-label={t("cardDetail.edit")}
        icon={Edit}
        size="small"
        style="text"
        type="button"
        tooltipProps={{
          content: t("cardDetail.edit"),
          position: "bottom",
        }}
        onClick={onEdit}
      />
      <Button
        aria-label={t("cardDetail.delete.action")}
        icon={Delete}
        size="small"
        style="danger-text"
        type="button"
        tooltipProps={{
          content: t("cardDetail.delete.action"),
          position: "bottom",
        }}
        onClick={onDelete}
      />
    </div>
  );
};

HeaderActions.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default HeaderActions;
