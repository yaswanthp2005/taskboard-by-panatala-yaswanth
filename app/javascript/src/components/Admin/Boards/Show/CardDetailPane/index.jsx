import React from "react";

import {
  useCreateCard,
  useFetchCard,
  useUpdateCard,
} from "components/hooks/reactQuery/useCardsApi";
import dayjs from "dayjs";
import { Pane, Spinner, Typography } from "neetoui";
import { Form as NeetoUIForm, Input, Textarea } from "neetoui/formik";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import {
  buildCardDetailFormInitialValues,
  CARD_DETAIL_FORM_VALIDATION_SCHEMA,
} from "./constants";
import DueDateField from "./DueDateField";
import Footer from "./Footer";

const CardDetailPane = ({ boardSlug, cardId, isOpen, listId, onClose }) => {
  const { t } = useTranslation();
  const isCreateMode = Boolean(listId) && !cardId;
  const { data: card, isLoading } = useFetchCard(cardId, {
    enabled: isOpen && Boolean(cardId),
  });
  const { mutateAsync: createCard } = useCreateCard(boardSlug);
  const { mutateAsync: updateCard } = useUpdateCard(boardSlug);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : null,
    };

    try {
      if (isCreateMode) {
        await createCard({ listId, ...payload });
      } else {
        await updateCard({ id: cardId, ...payload });
      }

      resetForm();
      onClose();
    } catch (error) {
      logger.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderForm = initialValues => (
    <NeetoUIForm
      className="w-full"
      key={isCreateMode ? `card-create-${listId}` : `card-detail-${cardId}`}
      formikProps={{
        enableReinitialize: true,
        initialValues,
        validateOnMount: true,
        validationSchema: CARD_DETAIL_FORM_VALIDATION_SCHEMA,
        onSubmit: handleSubmit,
      }}
    >
      <Pane.Body>
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
            rows={6}
          />
          <DueDateField />
        </div>
      </Pane.Body>
      <Pane.Footer>
        <Footer onClose={onClose} />
      </Pane.Footer>
    </NeetoUIForm>
  );

  const renderContent = () => {
    if (!isCreateMode && (isLoading || !card)) {
      return (
        <Pane.Body className="flex items-center justify-center">
          <Spinner />
        </Pane.Body>
      );
    }

    const initialValues = isCreateMode
      ? buildCardDetailFormInitialValues()
      : buildCardDetailFormInitialValues({
          ...card,
          dueDate: card.dueDate ? dayjs(card.dueDate) : null,
        });

    return renderForm(initialValues);
  };

  return (
    <Pane closeButton closeOnEsc isOpen={isOpen} size="large" onClose={onClose}>
      <Pane.Header>
        <Typography style="h3" weight="semibold">
          {t(isCreateMode ? "cardDetail.addTitle" : "cardDetail.title")}
        </Typography>
      </Pane.Header>
      {renderContent()}
    </Pane>
  );
};

CardDetailPane.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  cardId: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  listId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

CardDetailPane.defaultProps = {
  cardId: null,
  listId: null,
};

export default CardDetailPane;
