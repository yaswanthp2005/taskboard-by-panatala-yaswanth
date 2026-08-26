import React from "react";

import { Field } from "formik";
import { ColorPicker, Label } from "neetoui";

const FormikColorPicker = ({
  className = "",
  label,
  name,
  required = false,
  showHexValue = true,
  size = "medium",
}) => (
  <Field name={name}>
    {({ field, meta, form }) => {
      const error = meta.touched ? meta.error : "";

      const handleChange = ({ hex }) => {
        form.setFieldValue(name, hex);
        form.setFieldTouched(name, true, false);
      };

      return (
        <div className={className}>
          {label && (
            <Label className="mb-1" required={required}>
              {label}
            </Label>
          )}
          <ColorPicker
            color={field.value || ""}
            showHexValue={showHexValue}
            size={size}
            onChange={handleChange}
          />
          {error && <p className="neeto-ui-input__error">{error}</p>}
        </div>
      );
    }}
  </Field>
);

export default FormikColorPicker;
