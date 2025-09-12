const TOKEN_KEY = "ah_token";
const USER_KEY  = "ah_user";
const APIKEY_KEY = "ah_api_key"; 

function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function load(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }

export const auth = {
  get token() { return localStorage.getItem(TOKEN_KEY); },
  get user()  { return load(USER_KEY) || {}; },

  isLoggedIn() { return !!localStorage.getItem(TOKEN_KEY); },

  login({ accessToken, ...user }) {
    if (!accessToken) throw new Error("Missing access token");
    localStorage.setItem(TOKEN_KEY, accessToken); // <-- EXACT key used by api.js
    save(USER_KEY, user);
    window.dispatchEvent(new Event("auth-changed"));
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("ah_api_key"); // clear api key too
    window.dispatchEvent(new Event("auth-changed"));
    location.hash = "#/login";
  },
};
