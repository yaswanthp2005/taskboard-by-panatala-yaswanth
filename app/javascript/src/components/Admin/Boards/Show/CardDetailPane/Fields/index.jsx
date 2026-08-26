import React, { useState } from "react";

import { InlineInput } from "@bigbinary/neeto-molecules/InlineInput";
import { useFormikContext } from "formik";
import { Typography } from "neetoui";

const CardTitleField = () => {
  const { setFieldTouched, setFieldValue, values } = useFormikContext();
  const [isEditing, setIsEditing] = useState(true);

  const handleSubmit = value => {
    const trimmedTitle = value.trim();

    if (!trimmedTitle) {
      return;
    }

    setFieldValue("title", trimmedTitle);
    setFieldTouched("title", true);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <InlineInput
        autoFocus
        className="card-detail-pane__title-inline-input min-w-0 flex-1"
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        value={values.title}
      />
    );
  }

  return (
    <Typography
      className="min-w-0 flex-1 cursor-pointer break-words"
      style="h3"
      weight="semibold"
      onClick={() => setIsEditing(true)}
    >
      {values.title || "\u00A0"}
    </Typography>
  );
};

export default CardTitleField;
