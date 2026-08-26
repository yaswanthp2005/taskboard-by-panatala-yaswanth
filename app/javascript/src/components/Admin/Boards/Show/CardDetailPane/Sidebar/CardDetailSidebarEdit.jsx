import React from "react";

import { Button } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import AssigneeField from "./AssigneeField";
import DueDateField from "./DueDateField";
import LabelsField from "./LabelsField";

const CardDetailSidebarEdit = ({
  boardSlug,
  onShowChecklist,
  showChecklistButton,
}) => {
  const { t } = useTranslation();

  return (
    <aside className="card-detail-pane__sidebar">
      <AssigneeField boardSlug={boardSlug} variant="sidebar" />
      <DueDateField variant="sidebar" />
      <LabelsField boardSlug={boardSlug} variant="sidebar" />
      {showChecklistButton && (
        <Button
          className="w-full"
          label={t("cardDetail.addChecklist")}
          style="secondary"
          type="button"
          onClick={onShowChecklist}
        />
      )}
    </aside>
  );
};

CardDetailSidebarEdit.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  onShowChecklist: PropTypes.func.isRequired,
  showChecklistButton: PropTypes.bool.isRequired,
};

export default CardDetailSidebarEdit;
