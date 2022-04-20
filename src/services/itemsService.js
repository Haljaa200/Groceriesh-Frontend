import http from "./httpService";

const apiEndpoint = process.env.REACT_APP_API_URL + "/items";
const apiEndpointSingleItem = process.env.REACT_APP_API_URL + "/item";

function itemUrl(id) {
  return `${apiEndpointSingleItem}/${id}`;
}

export function getItems() {
  return http.get(apiEndpoint);
}

export function getItem(itemId) {
  return http.get(itemUrl(itemId));
}

export function saveItem(item) {
  if (item._id) {
    const body = { ...item };
    delete body._id;
    return http.put(itemUrl(item._id), body);
  }

  return http.post(apiEndpointSingleItem, item);
}

export function deleteItem(itemId) {
  return http.delete(itemUrl(itemId));
}
