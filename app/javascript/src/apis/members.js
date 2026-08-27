import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";

const fetch = ({ boardSlug, params = {} }) =>
  axios.get(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/members`, { params });

const create = ({ boardSlug, email }) =>
  axios.post(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/members`, {
    member: { email },
  });

const destroy = ({ boardSlug, id }) =>
  axios.delete(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/members/${id}`);

const membersApi = { create, destroy, fetch };

export default membersApi;
