const BASE_URL = "https://v2.api.noroff.dev";

function getToken() {
  return localStorage.getItem("ah_token"); // MUST match auth.js
}
function getApiKey() {
  return localStorage.getItem("ah_api_key");
}
function setApiKey(k) {
  if (k) localStorage.setItem("ah_api_key", k);
}

function authHeaders(withApiKey = true) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (withApiKey) {
    const apiKey = getApiKey();
    if (apiKey) headers["X-Noroff-API-Key"] = apiKey;
  }
  return headers;
}

/** Create an API key (v2 requirement). Call after login */
export async function createApiKeyIfMissing() {
  if (getApiKey()) return getApiKey();

  const token = getToken();
  if (!token) return null;

  // Important: Some backends 500 if body is empty or header missing.
  const res = await fetch(`${BASE_URL}/auth/create-api-key`, {
    method: "POST",
    headers: authHeaders(false), // send ONLY Authorization + JSON
    body: JSON.stringify({ name: "Auction House Frontend" }),
  });

  let data = {};
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    const msg = data?.errors?.[0]?.message || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const key = data?.data?.key || data?.key;
  if (key) setApiKey(key);
  return key;
}

export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: authHeaders(true),
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    const msg = data?.errors?.[0]?.message || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const AuthAPI = {
  register: (p) => api(`/auth/register`, { method: "POST", body: p }),
  login:    (p) => api(`/auth/login`,    { method: "POST", body: p }),
};

export const ListingsAPI = {
  list:   (q = "") => api(`/auction/listings?limit=20&_bids=true&_seller=true${q ? "&q="+encodeURIComponent(q) : ""}`),
  byId:   (id)     => api(`/auction/listings/${id}?_bids=true&_seller=true`),
  create: (p)      => api(`/auction/listings`, { method: "POST", body: p }),
  update: (id,p)   => api(`/auction/listings/${id}`, { method: "PUT", body: p }),
  remove: (id)     => api(`/auction/listings/${id}`, { method: "DELETE" }),
  bid:    (id,amt) => api(`/auction/listings/${id}/bids`, { method: "POST", body: { amount: amt } }),
};

export const ProfileAPI = {
  me:     (name)   => api(`/auction/profiles/${name}?_listings=true&_bids=true`),
  update: (name,p) => api(`/auction/profiles/${name}`, { method: "PUT", body: p }),
};
