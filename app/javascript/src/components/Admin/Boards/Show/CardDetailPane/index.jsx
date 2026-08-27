import React, { useEffect, useState } from "react";

import {
  useCreateCard,
  useFetchCard,
  useUpdateCard,
} from "components/hooks/reactQuery/useCardsApi";
import dayjs from "dayjs";
import { Pane, Spinner, Typography } from "neetoui";
import {
  Checkbox as FormikCheckbox,
  Form as NeetoUIForm,
  Textarea,
} from "neetoui/formik";
import { useTranslation } from "react-i18next";

import CardCreateForm from "./CardCreateForm";
import { ChecklistField } from "./Checklist";
import {
  buildCardDetailFormInitialValues,
  CARD_DETAIL_FORM_VALIDATION_SCHEMA,
} from "./constants";
import CardTitleField from "./Fields";
import Footer from "./Footer";
import { CardDetailHeader, HeaderActions } from "./Header";
import { CardDetailSidebarEdit } from "./Sidebar";
import { CardDetailView } from "./View";

import { ActivityFeed } from "../Activity";

const CardDetailPane = ({
  boardName,
  boardSlug,
  cardId,
  initialEditing = false,
  isOpen,
  listId,
  onClose,
  onDelete,
}) => {
  const { t } = useTranslation();
  const isCreateMode = Boolean(listId) && !cardId;
  const [isEditing, setIsEditing] = useState(isCreateMode || initialEditing);
  const [showChecklist, setShowChecklist] = useState(false);
  const { data: card, isLoading } = useFetchCard(cardId, {
    enabled: isOpen && Boolean(cardId),
  });
  const { mutateAsync: createCard } = useCreateCard(boardSlug);
  const { mutateAsync: updateCard } = useUpdateCard(boardSlug);

  useEffect(() => {
    if (isOpen) {
      setIsEditing(isCreateMode || initialEditing);
    }
  }, [initialEditing, isCreateMode, isOpen, cardId]);

  useEffect(() => {
    if (!isOpen) {
      setShowChecklist(false);

      return;
    }

    if ((card?.checklistItems ?? []).length > 0) {
      setShowChecklist(true);
    }
  }, [card?.checklistItems, isOpen]);

  const handleClose = () => {
    setIsEditing(isCreateMode);
    setShowChecklist(false);
    onClose();
  };

  const handleCreateSubmit = async (values, { resetForm, setSubmitting }) => {
    const payload = {
      assigneeIds: values.assigneeIds,
      description: values.description.trim(),
      dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : null,
      isComplete: values.isComplete,
      labelIds: values.labelIds,
      title: values.title.trim(),
    };

    try {
      await createCard({ listId, ...payload });
      resetForm();
      handleClose();
    } catch (error) {
      logger.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (values, { resetForm, setSubmitting }) => {
    const payload = {
      assigneeIds: values.assigneeIds,
      description: values.description.trim(),
      dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : null,
      isComplete: values.isComplete,
      labelIds: values.labelIds,
      title: values.title.trim(),
    };

    try {
      await updateCard({ id: cardId, ...payload });
      resetForm();
      setIsEditing(false);
    } catch (error) {
      logger.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderEditForm = initialValues => (
    <NeetoUIForm
      className="w-full"
      key={`card-edit-${cardId}`}
      formikProps={{
        enableReinitialize: true,
        initialValues,
        validateOnMount: true,
        validationSchema: CARD_DETAIL_FORM_VALIDATION_SCHEMA,
        onSubmit: handleUpdateSubmit,
      }}
    >
      <Pane.Body hasFooter>
        <div className="card-detail-pane__layout">
          <div className="card-detail-pane__main">
            <div className="card-detail-pane__title-row">
              <FormikCheckbox
                className="card-detail-pane__title-checkbox shrink-0 !grow-0"
                label=""
                name="isComplete"
              />
              <CardTitleField />
            </div>
            <Textarea
              className="w-full"
              label={t("cardDetail.description")}
              name="description"
              placeholder={t("cardDetail.descriptionPlaceholder")}
              rows={4}
            />
            {showChecklist && (
              <ChecklistField
                boardSlug={boardSlug}
                cardId={cardId}
                items={card?.checklistItems ?? []}
                onCloseWhenEmpty={() => setShowChecklist(false)}
              />
            )}
            <ActivityFeed cardId={cardId} />
          </div>
          <CardDetailSidebarEdit
            boardSlug={boardSlug}
            showChecklistButton={!showChecklist}
            onShowChecklist={() => setShowChecklist(true)}
          />
        </div>
      </Pane.Body>
      <Pane.Footer>
        <Footer
          isCreateMode={false}
          onCancelEdit={() => setIsEditing(false)}
          onClose={handleClose}
        />
      </Pane.Footer>
    </NeetoUIForm>
  );

  const renderContent = () => {
    if (isCreateMode) {
      return (
        <CardCreateForm
          boardSlug={boardSlug}
          listId={listId}
          onClose={handleClose}
          onSubmit={handleCreateSubmit}
        />
      );
    }

    if (isLoading || !card) {
      return (
        <Pane.Body hasFooter={false}>
          <div className="flex w-full items-center justify-center py-12">
            <Spinner />
          </div>
        </Pane.Body>
      );
    }

    if (isEditing) {
      const initialValues = buildCardDetailFormInitialValues({
        ...card,
        dueDate: card.dueDate ? dayjs(card.dueDate) : null,
      });

      return renderEditForm(initialValues);
    }

    return (
      <Pane.Body hasFooter={false}>
        <CardDetailView
          boardSlug={boardSlug}
          card={card}
          cardId={cardId}
          showChecklist={showChecklist}
          onEdit={() => setIsEditing(true)}
          onHideChecklist={() => setShowChecklist(false)}
          onShowChecklist={() => setShowChecklist(true)}
        />
      </Pane.Body>
    );
  };

  const showHeaderActions = !isCreateMode && !isEditing && card;

  return (
    <Pane
      closeButton
      closeOnEsc
      className="card-detail-pane"
      isOpen={isOpen}
      size="large"
      onClose={handleClose}
    >
      {showHeaderActions && (
        <HeaderActions
          onDelete={() => onDelete?.({ id: cardId, title: card.title })}
          onEdit={() => setIsEditing(true)}
        />
      )}
      <Pane.Header className="card-detail-pane__header">
        {isCreateMode ? (
          <Typography style="h3" weight="semibold">
            {t("cardDetail.addTitle")}
          </Typography>
        ) : (
          <CardDetailHeader boardName={boardName} />
        )}
      </Pane.Header>
      {renderContent()}
    </Pane>
  );
};

export default CardDetailPane;
