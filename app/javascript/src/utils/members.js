const formatMemberName = member => {
  if (!member) {
    return "";
  }

  return [member.firstName, member.lastName].filter(Boolean).join(" ").trim();
};

const getInitials = member => {
  if (!member) {
    return "?";
  }

  const firstInitial = member.firstName?.[0] || "";
  const lastInitial = member.lastName?.[0] || "";

  return `${firstInitial}${lastInitial}`.toUpperCase() || "?";
};

export { formatMemberName, getInitials };
