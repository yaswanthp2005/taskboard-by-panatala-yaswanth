import { ADMIN_API_BASE_URL } from "constants/apis";

import axios from "axios";
import camelToSnake from "utils/camelToSnake";

const create = ({ cardId, ...payload }) =>
  axios.post(`${ADMIN_API_BASE_URL}/cards/${cardId}/checklist_items`, {
    checklist_item: camelToSnake(payload),
  });

const update = ({ id, ...payload }) =>
  axios.patch(`${ADMIN_API_BASE_URL}/checklist_items/${id}`, {
    checklist_item: camelToSnake(payload),
  });

const destroy = ({ id }) =>
  axios.delete(`${ADMIN_API_BASE_URL}/checklist_items/${id}`);

const checklistItemsApi = { create, destroy, update };

export default checklistItemsApi;
