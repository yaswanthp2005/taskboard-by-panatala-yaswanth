import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";
import { serializeQueryParams } from "utils/buildURL";
import camelToSnake from "utils/camelToSnake";

const create = ({ boardSlug, listId, ...payload }) =>
  axios.post(
    `${ADMIN_API_BASE_URL}/boards/${boardSlug}/lists/${listId}/cards`,
    {
      card: camelToSnake(payload),
    }
  );

const show = ({ id }) => axios.get(`${ADMIN_API_BASE_URL}/cards/${id}`);

const update = ({ id, ...payload }) =>
  axios.patch(`${ADMIN_API_BASE_URL}/cards/${id}`, {
    card: camelToSnake(payload),
  });

const move = ({ id, ...payload }) =>
  axios.patch(`${ADMIN_API_BASE_URL}/cards/${id}/move`, camelToSnake(payload));

const destroy = ({ id }) => axios.delete(`${ADMIN_API_BASE_URL}/cards/${id}`);

const fetch = ({ boardSlug, ...params }) =>
  axios.get(`${ADMIN_API_BASE_URL}/boards/${boardSlug}/cards`, {
    params,
    paramsSerializer: serializeQueryParams,
  });

const cardsApi = { create, destroy, fetch, move, show, update };

export default cardsApi;
