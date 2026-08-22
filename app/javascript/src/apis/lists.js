import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";

const update = ({ boardSlug, id, ...payload }) =>
  axios.patch(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/lists/${id}`, {
    list: payload,
  });

const destroy = ({ boardSlug, id }) =>
  axios.delete(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/lists/${id}`);

const reorder = ({ boardSlug, listIds }) =>
  axios.patch(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/lists/reorder`, {
    list_ids: listIds,
  });

const listsApi = { destroy, reorder, update };

export default listsApi;
