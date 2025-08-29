//update listing//
import { ListingsAPI } from "../utils/api.js";
import { auth } from "../state/auth.js";

export async function renderEdit(app, id) {
  if (!auth.isLoggedIn()) { location.hash = "#/login"; return; }
  app.innerHTML = `<div class="container-narrow" id="wrap">Loading…</div>`;
  const wrap = document.getElementById("wrap");

  try {
    const res = await ListingsAPI.byId(id);
    const l = res.data || res;
    if (l.seller?.name !== auth.user?.name) { location.hash = `#/listing/${id}`; return; }
    const m1 = l.media?.[0]?.url || "";
    const m2 = l.media?.[1]?.url || "";
    const dtLocal = new Date(l.endsAt).toISOString().slice(0,16);

    wrap.innerHTML = `
    <div class="card card-yellow p-4">
      <h3 class="mb-3">Edit listing</h3>
      <form id="editForm" class="vstack gap-3">
        <input class="form-control input-lg" name="title" value="${l.title}" required>
        <textarea class="form-control" name="description" rows="4">${l.description ?? ""}</textarea>
        <input class="form-control input-lg" name="media1" value="${m1}" placeholder="Image URL (optional)">
        <input class="form-control input-lg" name="media2" value="${m2}" placeholder="Image URL (optional)">
        <label class="form-label m-0">Deadline</label>
        <input class="form-control input-lg" type="datetime-local" name="endsAt" value="${dtLocal}" required>
        <button class="btn btn-primary btn-lg">Save</button>
        <p id="err" class="text-danger small m-0"></p>
      </form>
    </div>`;

    document.getElementById("editForm").onsubmit = async (e) => {
      e.preventDefault();
      const err = document.getElementById("err"); err.textContent = "";
      const fd = Object.fromEntries(new FormData(e.target));
      const media = [fd.media1, fd.media2].filter(Boolean).map(url => ({ url }));
      try {
        await ListingsAPI.update(id, { title: fd.title, description: fd.description, media, endsAt: new Date(fd.endsAt).toISOString() });
        location.hash = `#/listing/${id}`;
      } catch (e) { err.textContent = e.message; }
    };
  } catch (e) { wrap.innerHTML = `<p class="text-danger">${e.message}</p>`; }
}
