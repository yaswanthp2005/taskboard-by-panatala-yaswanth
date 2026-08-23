import React from "react";

import { useFormikContext } from "formik";
import { Button } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Footer = ({ isCreateMode, onCancelEdit, onClose }) => {
  const { dirty, isSubmitting, isValid, resetForm, values } =
    useFormikContext();
  const { t } = useTranslation();

  const handleCancel = () => {
    resetForm();

    if (isCreateMode) {
      onClose();
    } else {
      onCancelEdit();
    }
  };

  const isSaveDisabled = isCreateMode
    ? isSubmitting || !values.title?.trim()
    : isSubmitting || !isValid || !dirty;

  return (
    <div className="flex w-full items-center justify-end gap-x-3">
      <Button
        label={t("common.cancel")}
        style="secondary"
        type="button"
        onClick={handleCancel}
      />
      <Button
        disabled={isSaveDisabled}
        label={t("common.save")}
        loading={isSubmitting}
        style="primary"
        type="submit"
      />
    </div>
  );
};

Footer.propTypes = {
  isCreateMode: PropTypes.bool.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Footer;
