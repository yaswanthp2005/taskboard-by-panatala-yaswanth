import React from "react";

import { useFormikContext } from "formik";
import { Button, Toastr } from "neetoui";
import { useTranslation } from "react-i18next";

import { FILTER_FORM_INITIAL_VALUES } from "../../constants";

const Footer = ({ clearedFormValues, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const { resetForm } = useFormikContext();

  const handleClear = () => {
    resetForm({ values: clearedFormValues });
    onSubmit(FILTER_FORM_INITIAL_VALUES);
    Toastr.success(t("boardView.filters.filtersCleared"));
    onClose();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        label={t("boardView.filters.done")}
        style="primary"
        type="submit"
      />
      <Button
        label={t("boardView.filters.clearFilters")}
        style="secondary"
        onClick={handleClear}
      />
    </div>
  );
};

export default Footer;
