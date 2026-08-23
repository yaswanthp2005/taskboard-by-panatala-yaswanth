import React, { useMemo } from "react";

import { useFetchLabels } from "components/hooks/reactQuery/useLabelsApi";
import { useFormikContext } from "formik";
import { Typography } from "neetoui";
import { useTranslation } from "react-i18next";

const LabelsField = ({ boardSlug }) => {
  const { t } = useTranslation();
  const { setFieldValue, values } = useFormikContext();
  const { data: labels = [], isLoading } = useFetchLabels(boardSlug);

  const selectedLabelIds = useMemo(
    () => new Set(values.labelIds || []),
    [values.labelIds]
  );

  const handleToggleLabel = labelId => {
    const currentLabelIds = values.labelIds || [];

    if (selectedLabelIds.has(labelId)) {
      setFieldValue(
        "labelIds",
        currentLabelIds.filter(id => id !== labelId)
      );

      return;
    }

    setFieldValue("labelIds", [...currentLabelIds, labelId]);
  };

  if (isLoading) {
    return null;
  }

  if (!labels.length) {
    return (
      <div className="flex w-full flex-col gap-y-2">
        <Typography style="body2" weight="semibold">
          {t("cardDetail.labels")}
        </Typography>
        <Typography className="text-gray-500" style="body3">
          {t("cardDetail.labelsEmpty")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-y-2">
      <Typography style="body2" weight="semibold">
        {t("cardDetail.labels")}
      </Typography>
      <div className="flex flex-wrap gap-2">
        {labels.map(label => {
          const isSelected = selectedLabelIds.has(label.id);

          return (
            <button
              className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              key={label.id}
              type="button"
              style={{
                backgroundColor: isSelected ? label.color : "#ffffff",
                borderColor: label.color,
                color: isSelected ? "#ffffff" : label.color,
              }}
              onClick={() => handleToggleLabel(label.id)}
            >
              {label.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LabelsField;
