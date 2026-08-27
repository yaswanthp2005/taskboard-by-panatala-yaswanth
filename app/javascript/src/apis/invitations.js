import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";

const show = ({ token }) =>
  axios.get(`${ADMIN_API_BASE_URL}/board_invitations/${token}`, {
    skipErrorToast: true,
  });

const accept = ({ token }) =>
  axios.patch(`${ADMIN_API_BASE_URL}/board_invitations/${token}/accept`, null, {
    skipErrorToast: true,
  });

const invitationsApi = { accept, show };

export default invitationsApi;
