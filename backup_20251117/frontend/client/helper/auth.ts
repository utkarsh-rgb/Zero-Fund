// utils/auth.ts
export function getToken() {
  return localStorage.getItem("jwt_token");
}

export function isLoggedIn() {
  const token = getToken();
  return !!token; // optional: decode & check expiry using jwt-decode
}
