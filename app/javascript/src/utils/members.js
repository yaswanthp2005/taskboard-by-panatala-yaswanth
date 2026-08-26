const formatMemberName = member =>
  [member.firstName, member.lastName].filter(Boolean).join(" ").trim();

const getInitials = member => {
  const firstInitial = member.firstName?.[0] || "";
  const lastInitial = member.lastName?.[0] || "";

  return `${firstInitial}${lastInitial}`.toUpperCase() || "?";
};

export { formatMemberName, getInitials };
