export const auth = {
  get token() { return localStorage.getItem("ah_token"); },
  get user()  { try { return JSON.parse(localStorage.getItem("ah_user")) || null; } catch { return null; } },
  login({ accessToken, name, email, avatar, credits }) {
    localStorage.setItem("ah_token", accessToken);
    localStorage.setItem("ah_user", JSON.stringify({ name, email, avatar, credits }));
    window.dispatchEvent(new CustomEvent("auth-changed"));
  },
  setCredits(credits) {
    const u = this.user || {}; u.credits = credits;
    localStorage.setItem("ah_user", JSON.stringify(u));
    window.dispatchEvent(new CustomEvent("auth-changed"));
  },
  setAvatar(url) {
    const u = this.user || {}; u.avatar = { url };
    localStorage.setItem("ah_user", JSON.stringify(u));
    window.dispatchEvent(new CustomEvent("auth-changed"));
  },
  logout() {
    localStorage.removeItem("ah_token");
    localStorage.removeItem("ah_user");
    window.dispatchEvent(new CustomEvent("auth-changed"));
    location.hash = "#/login";
  },
  isLoggedIn() { return !!this.token; },
};
