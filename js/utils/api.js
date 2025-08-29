const BASE_URL = "https://v2.api.noroff.dev"; 

function authHeader() {
  const token = localStorage.getItem("ah_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try { data = await res.json(); } catch { /* ignore */ }

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
  login: (payload) => api(`/auth/login`, { method: "POST", body: payload }),
};

export const ListingsAPI = {
  list: (q = "") => api(`/auction/listings?limit=20&_bids=true&_seller=true${q ? "&q="+encodeURIComponent(q) : ""}`),
  byId: (id) => api(`/auction/listings/${id}?_bids=true&_seller=true`),
  create: (payload) => api(`/auction/listings`, { method: "POST", body: payload }),
  update: (id, payload) => api(`/auction/listings/${id}`, { method: "PUT", body: payload }),
  remove: (id) => api(`/auction/listings/${id}`, { method: "DELETE" }),
  bid: (id, amount) => api(`/auction/listings/${id}/bids`, { method: "POST", body: { amount } }),
};

export const ProfileAPI = {
  me: (name) => api(`/auction/profiles/${name}?_listings=true&_bids=true`),
  update: (name, payload) => api(`/auction/profiles/${name}`, { method: "PUT", body: payload }),
};
