import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";

const fetch = params => axios.get(`${ADMIN_API_BASE_URL}/boards`, { params });

const show = slug =>
  axios.get(`${ADMIN_API_BASE_URL}/boards/${slug}`, { skipErrorToast: true });

const create = payload =>
  axios.post(`${ADMIN_API_BASE_URL}/boards`, { board: payload });

const update = ({ slug, ...payload }) =>
  axios.patch(`${ADMIN_API_BASE_URL}/boards/${slug}`, { board: payload });

const destroy = ({ slug }) =>
  axios.delete(`${ADMIN_API_BASE_URL}/boards/${slug}`);

const boardsApi = { create, destroy, fetch, show, update };

export default boardsApi;
