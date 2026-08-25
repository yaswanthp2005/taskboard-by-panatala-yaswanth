import React from "react";

import { useFetchLabels } from "components/hooks/reactQuery/useLabelsApi";
import { useFetchBoardMembers } from "components/hooks/reactQuery/useMembersApi";
import { Pane, Spinner, Toastr, Typography } from "neetoui";
import { Form as NeetoUIForm } from "neetoui/formik";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import Footer from "./Footer";
import Form from "./Form";

import {
  DUE_STATUS_FILTER_OPTIONS,
  FILTER_FORM_INITIAL_VALUES,
} from "../../filterConstants";
import { buildFiltersFromFormValues, memberFilterValue } from "../../utils";

const SearchFilters = ({ boardSlug, filters, isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const { data: members = [], isLoading: isMembersLoading } =
    useFetchBoardMembers(boardSlug);

  const { data: labels = [], isLoading: isLabelsLoading } =
    useFetchLabels(boardSlug);

  const appliedFilters = filters ?? FILTER_FORM_INITIAL_VALUES;
  const isLoading = isMembersLoading || isLabelsLoading;

  const assigneeOptions = members.map(member => {
    const name = memberFilterValue(member);

    return {
      label: name,
      value: name,
    };
  });

  const labelOptions = labels.map(label => ({
    label: label.name,
    value: label.name,
  }));

  const dueStatusOptions = DUE_STATUS_FILTER_OPTIONS.map(
    ({ labelKey, value }) => ({
      label: t(labelKey),
      value,
    })
  );

  const clearedFormValues = {
    assignees: [],
    labels: [],
    dueStatus: null,
  };

  const initialValues = {
    assignees: assigneeOptions.filter(option =>
      appliedFilters.assignees.includes(option.value)
    ),
    labels: labelOptions.filter(option =>
      appliedFilters.labels.includes(option.value)
    ),
    dueStatus:
      dueStatusOptions.find(
        option => option.value === appliedFilters.dueStatus
      ) ?? null,
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex w-full justify-center py-8">
          <Spinner />
        </div>
      );
    }

    return (
      <Form
        assigneeOptions={assigneeOptions}
        dueStatusOptions={dueStatusOptions}
        labelOptions={labelOptions}
      />
    );
  };

  return (
    <Pane
      closeButton
      closeOnEsc
      closeOnOutsideClick
      isOpen={isOpen}
      onClose={onClose}
    >
      <Pane.Header>
        <Typography style="h3" weight="semibold">
          {t("boardView.filters.title")}
        </Typography>
      </Pane.Header>
      <NeetoUIForm
        className="w-full"
        formikProps={{
          enableReinitialize: true,
          initialValues,
          onSubmit: values => {
            onSubmit(buildFiltersFromFormValues(values));
            Toastr.success(t("boardView.filters.filtersApplied"));
            onClose();
          },
        }}
      >
        <Pane.Body>{renderContent()}</Pane.Body>
        <Pane.Footer>
          <Footer
            clearedFormValues={clearedFormValues}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Pane.Footer>
      </NeetoUIForm>
    </Pane>
  );
};

SearchFilters.propTypes = {
  boardSlug: PropTypes.string.isRequired,
  filters: PropTypes.shape({
    assignees: PropTypes.arrayOf(PropTypes.string),
    dueStatus: PropTypes.string,
    labels: PropTypes.arrayOf(PropTypes.string),
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

SearchFilters.defaultProps = {
  filters: FILTER_FORM_INITIAL_VALUES,
};

export default SearchFilters;
