import React from "react";

import { useFormikContext } from "formik";
import { Button } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Footer = ({ onClose, onDelete }) => {
  const { isSubmitting, isValid, resetForm } = useFormikContext();
  const { t } = useTranslation();

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="flex w-full items-center justify-between gap-x-3">
      {onDelete ? (
        <Button
          label={t("cardDetail.delete.action")}
          style="danger"
          type="button"
          onClick={onDelete}
        />
      ) : (
        <span />
      )}
      <div className="flex gap-x-3">
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
    </div>
  );
};

Footer.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

Footer.defaultProps = {
  onDelete: undefined,
};

export default Footer;
