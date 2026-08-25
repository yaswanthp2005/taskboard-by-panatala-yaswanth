import React from "react";

import { Select } from "neetoui/formik";
import { useTranslation } from "react-i18next";

const Form = ({ assigneeOptions, dueStatusOptions, labelOptions }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-4">
      <div className="w-full">
        <Select
          isClearable
          isMulti
          isSearchable
          className="w-full"
          label={t("boardView.filters.assignee")}
          name="assignees"
          options={assigneeOptions}
          placeholder={t("boardView.filters.assigneePlaceholder")}
        />
      </div>
      <div className="w-full">
        <Select
          isClearable
          isMulti
          isSearchable
          className="w-full"
          label={t("boardView.filters.label")}
          name="labels"
          options={labelOptions}
          placeholder={t("boardView.filters.labelPlaceholder")}
        />
      </div>
      <div className="w-full">
        <Select
          isClearable
          className="w-full"
          label={t("boardView.filters.dueStatus.label")}
          name="dueStatus"
          options={dueStatusOptions}
          placeholder={t("boardView.filters.dueStatus.placeholder")}
        />
      </div>
    </div>
  );
};

export default Form;
