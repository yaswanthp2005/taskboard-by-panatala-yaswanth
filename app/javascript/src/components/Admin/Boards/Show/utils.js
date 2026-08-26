import { filterNonNull, serializeKeysToSnakeCase } from "neetocist";

import { formatMemberName } from "./CardDetailPane/utils";
import { FILTER_FORM_INITIAL_VALUES } from "./filterConstants";

const mapListsToSections = (lists = []) =>
  [...lists]
    .sort((first, second) => first.position - second.position)
    .map(list => ({
      id: list.id,
      name: list.title,
      items: [...(list.cards ?? [])]
        .sort((first, second) => first.position - second.position)
        .map(card => ({
          id: card.id,
          title: card.title,
          dueDate: card.dueDate,
          assignees: card.assignees ?? [],
          labels: card.labels ?? [],
        })),
    }));

const moveSection = (sections, source, destination) => {
  const nextSections = [...sections];
  const destinationIndex =
    source.index >= destination.index
      ? destination.index
      : destination.index - 1;

  const [section] = nextSections.splice(source.index, 1);
  nextSections.splice(destinationIndex, 0, section);

  return nextSections;
};

const moveItem = (sections, source, destination) => {
  const nextSections = sections.map(section => ({
    ...section,
    items: [...section.items],
  }));

  const destinationIndex =
    source.section.id === destination.section.id &&
    source.index >= destination.index
      ? destination.index - 1
      : destination.index;

  let movedItem;

  nextSections.forEach(section => {
    if (section.id === source.section.id) {
      [movedItem] = section.items.splice(source.index, 1);
    }
  });

  nextSections.forEach(section => {
    if (section.id === destination.section.id && movedItem) {
      section.items.splice(destinationIndex, 0, movedItem);
    }
  });

  return nextSections;
};

const extractSelectValue = value => {
  if (value && typeof value === "object") {
    return value.value ?? "";
  }

  return value ?? "";
};

const normalizeValues = value => {
  if (!value) {
    return [];
  }

  const splitValue = item =>
    String(item)
      .split(",")
      .map(part => part.trim())
      .filter(Boolean);

  if (Array.isArray(value)) {
    return value.flatMap(splitValue);
  }

  return splitValue(value);
};

const extractValues = value => {
  if (!Array.isArray(value)) {
    return normalizeValues(value);
  }

  return value.map(extractSelectValue).filter(Boolean).map(String);
};

const extractAssignees = assignees => extractValues(assignees);

const extractLabels = labels => extractValues(labels);

const memberFilterValue = member =>
  formatMemberName(member) || member.email || "";

const filtersFromQueryParams = ({
  search = "",
  assignees,
  labels,
  dueStatus = "",
} = {}) => ({
  search,
  assignees: normalizeValues(assignees),
  labels: normalizeValues(labels),
  dueStatus: dueStatus || "",
});

const buildFiltersFromFormValues = values => ({
  assignees: extractAssignees(values.assignees),
  labels: extractLabels(values.labels),
  dueStatus: extractSelectValue(values.dueStatus) || "",
});

const hasActiveCardFilters = (params = {}) =>
  Object.values(params).some(value => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return Boolean(value);
  });

const hasPaneFiltersApplied = (filters = FILTER_FORM_INITIAL_VALUES) =>
  Boolean(
    extractAssignees(filters.assignees).length ||
      extractLabels(filters.labels).length ||
      filters.dueStatus
  );

const buildCardFetchParams = ({
  search = "",
  assignees,
  labels,
  dueStatus = "",
} = {}) => {
  const filters = filtersFromQueryParams({
    assignees,
    dueStatus,
    labels,
    search,
  });
  const assigneeNames = extractAssignees(filters.assignees);
  const labelNames = extractLabels(filters.labels);

  return serializeKeysToSnakeCase(
    filterNonNull({
      assignees: assigneeNames.length ? assigneeNames : null,
      dueStatus: filters.dueStatus || null,
      labels: labelNames.length ? labelNames : null,
      search: filters.search?.trim() || null,
    })
  );
};

export {
  buildCardFetchParams,
  buildFiltersFromFormValues,
  extractAssignees,
  extractLabels,
  filtersFromQueryParams,
  hasActiveCardFilters,
  hasPaneFiltersApplied,
  mapListsToSections,
  memberFilterValue,
  moveItem,
  moveSection,
};
