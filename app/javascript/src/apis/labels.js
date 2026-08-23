import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";
import camelToSnake from "utils/camelToSnake";

const fetch = ({ boardSlug }) =>
  axios.get(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/labels`);

const create = ({ boardSlug, ...payload }) =>
  axios.post(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/labels`, {
    label: camelToSnake(payload),
  });

const update = ({ boardSlug, id, ...payload }) =>
  axios.patch(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/labels/${id}`, {
    label: camelToSnake(payload),
  });

const destroy = ({ boardSlug, id }) =>
  axios.delete(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/labels/${id}`);

const labelsApi = { create, destroy, fetch, update };

export default labelsApi;
