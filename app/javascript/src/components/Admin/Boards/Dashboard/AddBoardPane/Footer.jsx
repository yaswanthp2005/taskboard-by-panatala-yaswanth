import React from "react";

import { useFormikContext } from "formik";
import { Button } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Footer = ({ onClose }) => {
  const { isSubmitting, isValid, resetForm } = useFormikContext();
  const { t } = useTranslation();

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="flex justify-end gap-x-3">
      <Button
        label={t("common.cancel")}
        style="secondary"
        type="button"
        onClick={handleCancel}
      />
      <Button
        disabled={!isValid || isSubmitting}
        label={t("common.save")}
        loading={isSubmitting}
        style="primary"
        type="submit"
      />
    </div>
  );
};

Footer.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Footer;
