import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";

const update = ({ boardSlug, id, ...payload }) =>
  axios.patch(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/lists/${id}`, {
    list: payload,
  });

const destroy = ({ boardSlug, id }) =>
  axios.delete(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/lists/${id}`);

const move = ({ boardSlug, id, position }) =>
  axios.patch(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/lists/${id}/move`, {
    position,
  });

const listsApi = { destroy, move, update };

export default listsApi;
