import { AuthAPI } from "../utils/api.js";
import { auth } from "../state/auth.js";

export async function renderLogin(app) {
  app.innerHTML = `
  <div class="container-narrow">
    <div class="card card-yellow p-4">
      <h2 class="fw-bold mb-3">Sign In</h2>
      <form id="loginForm" class="vstack gap-3">
        <input class="form-control input-lg" type="email" name="email" placeholder="E-mail" required>
        <input class="form-control input-lg" type="password" name="password" placeholder="Password" required>
        <button class="btn btn-primary btn-lg">Submit</button>
        <p class="small">Don't have an account? <a href="#/register">Register here</a></p>
        <p id="err" class="text-danger small m-0"></p>
      </form>
    </div>
  </div>`;
  const f = document.getElementById("loginForm");
  const err = document.getElementById("err");
 f.onsubmit = async (e) => {
  e.preventDefault(); err.textContent = "";
  const { email, password } = Object.fromEntries(new FormData(f));

  try {
    const res = await AuthAPI.login({ email, password });

    // Handle both shapes safely
    const user = res?.data || res;
    const accessToken =
      res?.meta?.accessToken || user?.accessToken || res?.accessToken;

    if (!accessToken) throw new Error("Missing access token from API.");

    // user fields (name/email/avatar/credits) usually live under .data
    const name = user?.name;
    const avatar = user?.avatar;   // should already be an object
    const credits = user?.credits;

    // store
    import("../state/auth.js").then(({ auth }) => {
      auth.login({ accessToken, name, email, avatar, credits });
      location.hash = "#/listings";
    });
  } catch (e2) {
    err.textContent = e2.message;
  }
};