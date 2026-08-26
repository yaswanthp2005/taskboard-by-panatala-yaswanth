import React from "react";

import { useFormikContext } from "formik";
import { DatePicker } from "neetoui";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const DueDateField = ({ variant = "default" }) => {
  const { t } = useTranslation();
  const { errors, setFieldValue, touched, values } = useFormikContext();
  const isSidebar = variant === "sidebar";

  return (
    <div className={isSidebar ? "card-detail-pane__sidebar-field" : undefined}>
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
    </div>
  );
};

DueDateField.propTypes = {
  variant: PropTypes.oneOf(["default", "sidebar"]),
};

export default DueDateField;
