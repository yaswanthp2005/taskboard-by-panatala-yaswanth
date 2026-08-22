import React from "react";

import { useFormikContext } from "formik";
import { DatePicker } from "neetoui";
import { useTranslation } from "react-i18next";

const DueDateField = () => {
  const { t } = useTranslation();
  const { errors, setFieldValue, touched, values } = useFormikContext();

  return (
    <DatePicker
      allowClear
      className="w-full"
      dateFormat="MMM D, YYYY"
      error={touched.dueDate ? errors.dueDate : undefined}
      label={t("cardDetail.dueDate")}
      placeholder={t("cardDetail.dueDatePlaceholder")}
      value={values.dueDate}
      onChange={date => setFieldValue("dueDate", date)}
    />
  );
};

export default DueDateField;
