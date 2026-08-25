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

const buildCardFetchParams = ({ search = "" } = {}) => ({
  search: search.trim() || undefined,
});

const hasActiveCardFilters = (params = {}) =>
  Object.values(params).some(Boolean);

export {
  buildCardFetchParams,
  hasActiveCardFilters,
  mapListsToSections,
  moveItem,
  moveSection,
};
