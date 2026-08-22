import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";

const create = ({ boardSlug, listId, ...payload }) =>
  axios.post(
    `${ADMIN_API_BASE_URL}/boards/${boardSlug}/lists/${listId}/cards`,
    {
      card: payload,
    }
  );

const show = ({ id }) => axios.get(`${ADMIN_API_BASE_URL}/cards/${id}`);

const update = ({ id, ...payload }) =>
  axios.patch(`${ADMIN_API_BASE_URL}/cards/${id}`, {
    card: payload,
  });

const move = ({ id, listId, position }) =>
  axios.patch(`${ADMIN_API_BASE_URL}/cards/${id}/move`, {
    list_id: listId,
    position,
  });

const cardsApi = { create, move, show, update };

export default cardsApi;
