import React from "react";

import { useFormikContext } from "formik";
import { Button } from "neetoui";
import { useTranslation } from "react-i18next";

const FormActions = () => {
  const { dirty, isSubmitting, isValid, resetForm } = useFormikContext();
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      <Button
        disabled={!dirty || !isValid || isSubmitting}
        label={t("boardSettings.form.saveChanges")}
        loading={isSubmitting}
        style="primary"
        type="submit"
      />
      <Button
        disabled={!dirty || isSubmitting}
        label={t("common.cancel")}
        style="text"
        type="button"
        onClick={() => resetForm()}
      />
    </div>
  );
};

export default FormActions;
