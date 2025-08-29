import { ListingsAPI } from "../utils/api.js";
import { auth } from "../state/auth.js";

export async function renderCreate(app) {
  if (!auth.isLoggedIn()) { location.hash = "#/login"; return; }
  app.innerHTML = `
  <div class="container-narrow">
    <div class="card card-yellow p-4">
      <h3 class="mb-3">Add new post</h3>
      <form id="createForm" class="vstack gap-3">
        <input class="form-control input-lg" name="title" placeholder="Title" required>
        <textarea class="form-control" name="description" rows="4" placeholder="Description"></textarea>
        <input class="form-control input-lg" name="media1" placeholder="Image URL (optional)">
        <input class="form-control input-lg" name="media2" placeholder="Image URL (optional)">
        <label class="form-label m-0">Deadline</label>
        <input class="form-control input-lg" type="datetime-local" name="endsAt" required>
        <button class="btn btn-primary btn-lg">Submit</button>
        <p id="err" class="text-danger small m-0"></p>
      </form>
    </div>
  </div>`;
  const f = document.getElementById("createForm");
  const err = document.getElementById("err");
  f.onsubmit = async (e) => {
    e.preventDefault(); err.textContent = "";
    const fd = Object.fromEntries(new FormData(f));
    const media = [fd.media1, fd.media2].filter(Boolean).map(url => ({ url }));
    try {
      await ListingsAPI.create({ title: fd.title, description: fd.description, media, endsAt: new Date(fd.endsAt).toISOString() });
      location.hash = "#/listings";
    } catch (e) { err.textContent = e.message; }
  };
}
