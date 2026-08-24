import React from "react";

import { useInviteMember } from "components/hooks/reactQuery/useMembersApi";
import { Button, Modal, Typography } from "neetoui";
import { Form as NeetoUIForm, Input } from "neetoui/formik";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import {
  ADD_MEMBER_FORM_INITIAL_VALUES,
  ADD_MEMBER_FORM_VALIDATION_SCHEMA,
} from "./constants";

const AddMemberModal = ({ boardSlug, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { mutateAsync: inviteMember, isLoading: isSubmitting } =
    useInviteMember(boardSlug);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await inviteMember({ email: values.email.trim() });
      resetForm();
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
        formikProps={{
          initialValues: ADD_MEMBER_FORM_INITIAL_VALUES,
          validationSchema: ADD_MEMBER_FORM_VALIDATION_SCHEMA,
          validateOnBlur: false,
          validateOnChange: false,
          validateOnMount: false,
          onSubmit: handleSubmit,
        }}
      >
        <Modal.Header>
          <Typography style="h3" weight="semibold">
            {t("members.form.addTitle")}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <Input
            autoFocus
            label={t("members.form.emailLabel")}
            name="email"
            placeholder={t("members.form.emailPlaceholder")}
          />
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
            label={t("members.form.submitAdd")}
            loading={isSubmitting}
            style="primary"
            type="submit"
          />
        </Modal.Footer>
      </NeetoUIForm>
    </Modal>
  );
};

AddMemberModal.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddMemberModal;
