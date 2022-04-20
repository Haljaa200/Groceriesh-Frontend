import http from "./httpService";

export function getCategories() {
  return http.get(process.env.REACT_APP_API_URL + "/categories");
}

export function saveCategory(category) {
  return http.post(process.env.REACT_APP_API_URL + "/category", category);
}
