import React, { useEffect, useState } from "react";

import {
  useCreateCard,
  useFetchCard,
  useUpdateCard,
} from "components/hooks/reactQuery/useCardsApi";
import dayjs from "dayjs";
import { Checkbox, Pane, Spinner } from "neetoui";
import { Form as NeetoUIForm, Textarea } from "neetoui/formik";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import CardDetailHeader from "./CardDetailHeader";
import { CardDetailSidebarEdit } from "./CardDetailSidebar";
import CardDetailView from "./CardDetailView";
import CardTitleField from "./CardTitleField";
import ChecklistField from "./ChecklistField";
import {
  buildCardDetailFormInitialValues,
  CARD_DETAIL_FORM_VALIDATION_SCHEMA,
} from "./constants";
import Footer from "./Footer";
import HeaderActions from "./HeaderActions";

import ActivityFeed from "../ActivityFeed";

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

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : null,
      labelIds: values.labelIds,
      assigneeIds: values.assigneeIds,
    };

    try {
      if (isCreateMode) {
        await createCard({ listId, ...payload });

        resetForm();
        handleClose();
      } else {
        await updateCard({ id: cardId, ...payload });
        resetForm();
        setIsEditing(false);
      }
    } catch (error) {
      logger.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderEditForm = initialValues => (
    <NeetoUIForm
      className="w-full"
      key={isCreateMode ? `card-create-${listId}` : `card-edit-${cardId}`}
      formikProps={{
        enableReinitialize: true,
        initialValues,
        validateOnMount: true,
        validationSchema: CARD_DETAIL_FORM_VALIDATION_SCHEMA,
        onSubmit: handleSubmit,
      }}
    >
      <Pane.Body hasFooter>
        <div className="card-detail-pane__layout">
          <div className="card-detail-pane__main">
            <div className="card-detail-pane__title-row">
              <Checkbox
                checked={false}
                className="card-detail-pane__title-checkbox shrink-0 !grow-0"
                label=""
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
            {!isCreateMode && <ActivityFeed cardId={cardId} />}
            {!isCreateMode && showChecklist && (
              <ChecklistField
                boardSlug={boardSlug}
                cardId={cardId}
                items={card?.checklistItems ?? []}
                onCloseWhenEmpty={() => setShowChecklist(false)}
              />
            )}
          </div>
          <CardDetailSidebarEdit
            boardSlug={boardSlug}
            showChecklistButton={!isCreateMode && !showChecklist}
            onShowChecklist={() => setShowChecklist(true)}
          />
        </div>
      </Pane.Body>
      <Pane.Footer>
        <Footer
          isCreateMode={isCreateMode}
          onCancelEdit={() => setIsEditing(false)}
          onClose={handleClose}
        />
      </Pane.Footer>
    </NeetoUIForm>
  );

  const renderContent = () => {
    if (!isCreateMode && (isLoading || !card)) {
      return (
        <Pane.Body hasFooter={false}>
          <div className="flex w-full items-center justify-center py-12">
            <Spinner />
          </div>
        </Pane.Body>
      );
    }

    if (isCreateMode || isEditing) {
      const initialValues = isCreateMode
        ? buildCardDetailFormInitialValues()
        : buildCardDetailFormInitialValues({
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
        <CardDetailHeader boardName={boardName} />
      </Pane.Header>
      {renderContent()}
    </Pane>
  );
};

CardDetailPane.propTypes = {
  boardName: PropTypes.string.isRequired,
  boardSlug: PropTypes.string.isRequired,
  cardId: PropTypes.string,
  initialEditing: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  listId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

CardDetailPane.defaultProps = {
  cardId: null,
  initialEditing: false,
  listId: null,
  onDelete: undefined,
};

export default CardDetailPane;
