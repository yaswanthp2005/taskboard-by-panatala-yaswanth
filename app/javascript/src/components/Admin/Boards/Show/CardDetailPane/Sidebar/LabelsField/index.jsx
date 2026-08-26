import React, { useMemo } from "react";

import { useFetchLabels } from "components/hooks/reactQuery/useLabelsApi";
import { useFormikContext } from "formik";
import { Dropdown, Tag, Typography } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import LabelColorIcon from "./LabelColorIcon";

const LabelsField = ({ boardSlug, variant = "default" }) => {
  const { t } = useTranslation();
  const { setFieldValue, values } = useFormikContext();
  const isSidebar = variant === "sidebar";
  const labelsLabel = t(isSidebar ? "cardDetail.tags" : "cardDetail.labels");
  const { data, isLoading } = useFetchLabels(boardSlug);
  const labels = data?.labels ?? [];

  const selectedLabelIds = useMemo(
    () => new Set(values.labelIds || []),
    [values.labelIds]
  );

  const selectedLabels = useMemo(
    () => labels.filter(label => selectedLabelIds.has(label.id)),
    [labels, selectedLabelIds]
  );

  const availableLabels = useMemo(
    () => labels.filter(label => !selectedLabelIds.has(label.id)),
    [labels, selectedLabelIds]
  );

  const handleAddLabel = labelId => {
    const currentLabelIds = values.labelIds || [];

    if (selectedLabelIds.has(labelId)) {
      return;
    }

    setFieldValue("labelIds", [...currentLabelIds, labelId]);
  };

  const handleRemoveLabel = labelId => {
    const currentLabelIds = values.labelIds || [];

    setFieldValue(
      "labelIds",
      currentLabelIds.filter(id => id !== labelId)
    );
  };

  if (isLoading) {
    return null;
  }

  if (!labels.length) {
    return (
      <div
        className={`flex w-full flex-col ${
          isSidebar ? "card-detail-pane__sidebar-field" : "gap-y-2"
        }`}
      >
        <Typography style="body2" weight="semibold">
          {labelsLabel}
        </Typography>
        <Typography className="text-gray-500" style="body3">
          {t("cardDetail.labelsEmpty")}
        </Typography>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full flex-col ${
        isSidebar ? "card-detail-pane__sidebar-field" : "gap-y-2"
      }`}
    >
      <div className="flex items-center justify-between gap-x-3">
        <Typography className="shrink-0" style="body2" weight="semibold">
          {labelsLabel}
        </Typography>
        {availableLabels.length > 0 && (
          <Dropdown
            buttonStyle="secondary"
            dropdownProps={{ appendTo: () => document.body }}
            label={t("cardDetail.labelsPlaceholder")}
            position="bottom-end"
            size="small"
            strategy="fixed"
          >
            <Dropdown.Menu>
              {availableLabels.map(label => (
                <Dropdown.MenuItem.Button
                  key={label.id}
                  onClick={() => handleAddLabel(label.id)}
                >
                  <div className="flex items-center gap-x-2">
                    <LabelColorIcon color={label.color} />
                    <span>{label.name}</span>
                  </div>
                </Dropdown.MenuItem.Button>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedLabels.map(label => (
            <Tag
              icon={() => <LabelColorIcon color={label.color} />}
              key={label.id}
              label={label.name}
              size="small"
              style="secondary"
              type="solid"
              onClose={() => handleRemoveLabel(label.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

LabelsField.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["default", "sidebar"]),
};

export default LabelsField;
