import React from "react";

import { Pane } from "neetoui";
import { Form as NeetoUIForm, Input, Textarea } from "neetoui/formik";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import {
  buildCardDetailFormInitialValues,
  CARD_DETAIL_FORM_VALIDATION_SCHEMA,
} from "./constants";
import Footer from "./Footer";
import { AssigneeField, DueDateField, LabelsField } from "./Sidebar";

const CardCreateForm = ({ boardSlug, listId, onClose, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <NeetoUIForm
      className="w-full"
      key={`card-create-${listId}`}
      formikProps={{
        enableReinitialize: true,
        initialValues: buildCardDetailFormInitialValues(),
        validateOnMount: true,
        validationSchema: CARD_DETAIL_FORM_VALIDATION_SCHEMA,
        onSubmit,
      }}
    >
      <Pane.Body hasFooter>
        <div className="flex w-full flex-col gap-y-4">
          <Input
            autoFocus
            required
            className="w-full"
            label={t("cardDetail.titleLabel")}
            name="title"
            placeholder={t("cardDetail.titlePlaceholder")}
          />
          <Textarea
            className="w-full"
            label={t("cardDetail.description")}
            name="description"
            placeholder={t("cardDetail.descriptionPlaceholder")}
            rows={4}
          />
          <DueDateField />
          <AssigneeField boardSlug={boardSlug} />
          <LabelsField boardSlug={boardSlug} />
        </div>
      </Pane.Body>
      <Pane.Footer>
        <Footer isCreateMode onCancelEdit={() => {}} onClose={onClose} />
      </Pane.Footer>
    </NeetoUIForm>
  );
};

CardCreateForm.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  listId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CardCreateForm;
