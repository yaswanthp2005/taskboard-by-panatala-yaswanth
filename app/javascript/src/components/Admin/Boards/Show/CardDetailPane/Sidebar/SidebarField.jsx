import React from "react";

import { Settings } from "neetoicons";
import { Button, Typography } from "neetoui";
import { useTranslation } from "react-i18next";

const SidebarField = ({ children, label, onConfigure }) => {
  const { t } = useTranslation();

  return (
    <div className="card-detail-pane__sidebar-field">
      <div className="card-detail-pane__sidebar-field-header">
        <Typography className="text-gray-800" style="body2" weight="semibold">
          {label}
        </Typography>
        {onConfigure && (
          <Button
            aria-label={t("cardDetail.configureField", { field: label })}
            className="text-gray-500"
            icon={Settings}
            size="small"
            style="text"
            type="button"
            onClick={onConfigure}
          />
        )}
      </div>
      <div className="card-detail-pane__sidebar-field-value">{children}</div>
    </div>
  );
};

export default SidebarField;
