import React from "react";

import PropTypes from "prop-types";

import MemberRow from "./MemberRow";

import { MEMBER_ROLES } from "../constants";

const MembersList = ({ members }) => (
  <div className="flex flex-col gap-y-3">
    {members.map(member => (
      <MemberRow key={member.id} member={member} />
    ))}
  </div>
);

MembersList.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      role: PropTypes.oneOf([MEMBER_ROLES.OWNER, MEMBER_ROLES.MEMBER])
        .isRequired,
    })
  ).isRequired,
};

export default MembersList;
