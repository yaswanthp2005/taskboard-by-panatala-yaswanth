const buildInitialLists = () => [
  {
    id: "list-todo",
    name: "To Do",
    items: [
      { id: "card-1", title: "Set up project board" },
      { id: "card-2", title: "Review requirements" },
    ],
  },
  {
    id: "list-in-progress",
    name: "In Progress",
    items: [{ id: "card-3", title: "Design board layout" }],
  },
  {
    id: "list-done",
    name: "Done",
    items: [{ id: "card-4", title: "Create user accounts" }],
  },
];

export { buildInitialLists };
