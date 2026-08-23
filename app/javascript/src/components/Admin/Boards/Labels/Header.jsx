import React from "react";

import { Plus } from "neetoicons";
import { Button, Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const LabelsHeader = ({ isAddDisabled, onAddLabel }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8 flex items-start justify-between gap-x-4">
      <div>
        <Typography style="h2" weight="semibold">
          {t("labels.title")}
        </Typography>
        <Typography className="mt-2 text-gray-600" style="body2">
          {t("labels.subtitle")}
        </Typography>
      </div>
      <Button
        disabled={isAddDisabled}
        icon={Plus}
        label={t("labels.addNewLabel")}
        style="secondary"
        onClick={onAddLabel}
      />
    </div>
  );
};

LabelsHeader.propTypes = {
  isAddDisabled: PropTypes.bool,
  onAddLabel: PropTypes.func.isRequired,
};

LabelsHeader.defaultProps = {
  isAddDisabled: false,
};

export default LabelsHeader;
