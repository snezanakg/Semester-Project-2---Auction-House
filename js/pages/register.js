import { AuthAPI } from "../utils/api.js";

export async function renderRegister(app) {
  app.innerHTML = `
  <div class="container-narrow">
    <div class="card card-yellow p-4">
      <h2 class="fw-bold mb-3">Sign Up</h2>
      <form id="regForm" class="vstack gap-3" novalidate>
        <input class="form-control input-lg" name="name" placeholder="Name" required>
        <input class="form-control input-lg" type="email" name="email" placeholder="E-mail (@stud.noroff.no)" required>
        <input class="form-control input-lg" type="password" name="password" placeholder="Password" minlength="8" required>
        <input class="form-control input-lg" name="avatar" placeholder="Avatar URL (optional)">
        <button class="btn btn-primary btn-lg" type="submit">Submit</button>
        <p id="err" class="text-danger small m-0" role="alert"></p>
      </form>
    </div>
  </div>`;

  const formEl = document.getElementById("regForm");
  const errEl = document.getElementById("err");

  formEl.onsubmit = async (e) => {
    e.preventDefault(); errEl.textContent = "";
    const form = Object.fromEntries(new FormData(formEl));

    if (!form.email.endsWith("@stud.noroff.no")) {
      errEl.textContent = "Email must end with @stud.noroff.no"; return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      avatar: form.avatar ? { url: form.avatar.trim() } : undefined,
    };

    try { await AuthAPI.register(payload); location.hash = "#/login"; }
    catch (err) { errEl.textContent = err.message || "Registration failed."; }
  };
}
