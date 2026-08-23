import React from "react";

import {
  useCreateLabel,
  useUpdateLabel,
} from "components/hooks/reactQuery/useLabelsApi";
import { Button, Modal, Typography } from "neetoui";
import { Form as NeetoUIForm, Input } from "neetoui/formik";
import { useTranslation } from "react-i18next";

import {
  buildLabelFormInitialValues,
  LABEL_FORM_VALIDATION_SCHEMA,
} from "./constants";

const LabelFormModal = ({ boardSlug, isOpen, label = null, onClose }) => {
  const { t } = useTranslation();
  const isEditMode = Boolean(label);
  const { mutateAsync: createLabel, isLoading: isCreating } =
    useCreateLabel(boardSlug);

  const { mutateAsync: updateLabel, isLoading: isUpdating } =
    useUpdateLabel(boardSlug);
  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      name: values.name.trim(),
      color: values.color.trim(),
    };

    try {
      if (isEditMode) {
        await updateLabel({ id: label.id, ...payload });
      } else {
        await createLabel(payload);
      }

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen size="small" onClose={onClose}>
      <NeetoUIForm
        className="w-full"
        key={isEditMode ? `edit-${label.id}` : "create"}
        formikProps={{
          initialValues: buildLabelFormInitialValues(label),
          validationSchema: LABEL_FORM_VALIDATION_SCHEMA,
          validateOnBlur: false,
          validateOnChange: false,
          validateOnMount: false,
          onSubmit: handleSubmit,
        }}
      >
        <Modal.Header>
          <Typography style="h3" weight="semibold">
            {isEditMode
              ? t("labels.form.editTitle")
              : t("labels.form.addTitle")}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-y-4">
            <Input
              autoFocus
              label={t("labels.form.nameLabel")}
              name="name"
              placeholder={t("labels.form.namePlaceholder")}
            />
            <Input
              label={t("labels.form.colorLabel")}
              name="color"
              placeholder={t("labels.form.colorPlaceholder")}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex items-center justify-end gap-2">
          <Button
            disabled={isSubmitting}
            label={t("common.cancel")}
            style="tertiary"
            onClick={onClose}
          />
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            style="primary"
            type="submit"
            label={
              isEditMode
                ? t("labels.form.submitEdit")
                : t("labels.form.submitAdd")
            }
          />
        </Modal.Footer>
      </NeetoUIForm>
    </Modal>
  );
};

export default LabelFormModal;
