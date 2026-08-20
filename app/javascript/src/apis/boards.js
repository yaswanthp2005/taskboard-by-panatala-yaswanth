import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";

const fetch = params => axios.get(`${ADMIN_API_BASE_URL}/boards`, { params });

const create = payload =>
  axios.post(`${ADMIN_API_BASE_URL}/boards`, { board: payload });

const update = ({ id, ...payload }) =>
  axios.patch(`${ADMIN_API_BASE_URL}/boards/${id}`, { board: payload });

const destroy = ({ id }) => axios.delete(`${ADMIN_API_BASE_URL}/boards/${id}`);

const boardsApi = { create, destroy, fetch, update };

export default boardsApi;
