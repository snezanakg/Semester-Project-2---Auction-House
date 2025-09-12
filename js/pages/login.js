import { AuthAPI, createApiKeyIfMissing } from "../utils/api.js";
import { auth } from "../state/auth.js";

export async function renderLogin(app) {
  app.innerHTML = `
  <div class="container-narrow">
    <div class="card card-yellow p-4">
      <h2 class="fw-bold mb-3">Sign In</h2>

      <form id="loginForm" class="vstack gap-3" novalidate>
        <input class="form-control input-lg" type="email" name="email" placeholder="E-mail" required>
        <input class="form-control input-lg" type="password" name="password" placeholder="Password" required>
        <button class="btn btn-primary btn-lg" type="submit">Submit</button>
        <p id="err" class="text-danger small m-0" role="alert"></p>
      </form>

      <p class="small mt-3 mb-0">
        No account? <a href="#/register" class="fw-semibold text-dark">Create one</a>
      </p>
    </div>
  </div>`;

  const form = document.getElementById("loginForm");
  const errEl = document.getElementById("err");

  form.onsubmit = async (e) => {
    e.preventDefault();
    errEl.textContent = "";

    const fd = Object.fromEntries(new FormData(form));
    const email = (fd.email || "").trim().toLowerCase();
    const password = (fd.password || "").trim();

    if (!email || !password) {
      errEl.textContent = "Please enter email and password.";
      return;
    }

    try {
      // 1) Login via Noroff v2
      const res = await AuthAPI.login({ email, password });
      const user = res?.data || res;

      // v2 responses may return token in meta or on data
      const accessToken =
        res?.meta?.accessToken || user?.accessToken || res?.accessToken;

      if (!accessToken) throw new Error("Missing access token from API.");

      // 2) Store token + user in localStorage
      auth.login({
        accessToken,
        name: user?.name,
        email: user?.email || email,
        avatar: user?.avatar,
        credits: user?.credits,
      });

      // 3) Ensure API key exists (required for create/bid/edit/delete)
      try {
        await createApiKeyIfMissing();
      } catch (keyErr) {
        // Non-fatal: user can still browse; creating listings will need the key
        console.warn("API key creation failed:", keyErr?.message || keyErr);
      }

      // 4) Go to dashboard
      location.hash = "#/listings";
    } catch (e2) {
      console.error("Login error:", e2);
      errEl.textContent = e2?.message || "Login failed.";
    }
  };
}
