import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";
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

const cardsApi = { create, move, show, update };

export default cardsApi;
