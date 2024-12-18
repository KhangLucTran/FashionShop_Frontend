export const KEY_TOKEN = "accessToken";
export const ADMIN_KEY_TOKEN = "adminAccessToken";

export const setToken = (token) => {
  localStorage.setItem(KEY_TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(KEY_TOKEN);
};

export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
};

// Admin Token
export const setAdminToken = (token) => {
  localStorage.setItem(ADMIN_KEY_TOKEN, token);
};
export const getAdminToken = () => {
  return localStorage.getItem(ADMIN_KEY_TOKEN);
};
export const removeAdminToken = () => {
  return localStorage.removeItem(ADMIN_KEY_TOKEN);
};
