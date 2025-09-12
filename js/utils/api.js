const BASE_URL = "https://v2.api.noroff.dev";

function getToken() {
  return localStorage.getItem("ah_token");
}
function getApiKey() {
  return localStorage.getItem("ah_api_key");
}
function setApiKey(key) {
  localStorage.setItem("ah_api_key", key);
}

/**
 * Create an API key (v2 requirement).
 * Must be called AFTER login, using only the Bearer token (no API key yet).
 */
export async function createApiKeyIfMissing() {
  if (getApiKey()) return getApiKey();
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${BASE_URL}/auth/create-api-key`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  let data = {};
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const msg = data?.errors?.[0]?.message || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  // API returns { data: { key: "UUID", ... }, meta: {} }
  const key = data?.data?.key || data?.key;
  if (key) setApiKey(key);
  return key;
}

function authHeaders() {
  const token = getToken();
  const apiKey = getApiKey();
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (apiKey) headers["X-Noroff-API-Key"] = apiKey; // v2 requirement
  return headers;
}

export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    const msg =
      data?.errors?.[0]?.message ||
      data?.message ||
      data?.error ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const AuthAPI = {
  register: (payload) => api(`/auth/register`, { method: "POST", body: payload }),
  login:    (payload) => api(`/auth/login`,    { method: "POST", body: payload }),
};

export const ListingsAPI = {
  list:   (q = "") => api(`/auction/listings?limit=20&_bids=true&_seller=true${q ? "&q="+encodeURIComponent(q) : ""}`),
  byId:   (id)     => api(`/auction/listings/${id}?_bids=true&_seller=true`),
  create: (payload)=> api(`/auction/listings`, { method: "POST", body: payload }),
  update: (id,p)   => api(`/auction/listings/${id}`, { method: "PUT", body: p }),
  remove: (id)     => api(`/auction/listings/${id}`, { method: "DELETE" }),
  bid:    (id,amt) => api(`/auction/listings/${id}/bids`, { method: "POST", body: { amount: amt } }),
};

export const ProfileAPI = {
  me:     (name)   => api(`/auction/profiles/${name}?_listings=true&_bids=true`),
  update: (name,p) => api(`/auction/profiles/${name}`, { method: "PUT", body: p }),
};
