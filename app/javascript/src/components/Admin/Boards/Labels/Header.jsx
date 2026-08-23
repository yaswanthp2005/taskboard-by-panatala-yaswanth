import React from "react";

import { Typography } from "neetoui";
import { useTranslation } from "react-i18next";

const LabelsHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <Typography style="h2" weight="semibold">
        {t("labels.title")}
      </Typography>
      <Typography className="mt-2 text-gray-600" style="body2">
        {t("labels.subtitle")}
      </Typography>
    </div>
  );
};

export default LabelsHeader;
