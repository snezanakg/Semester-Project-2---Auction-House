import { ProfileAPI } from "../utils/api.js";
import { auth } from "../state/auth.js";
import { ASSETS } from "../utils/assets.js";

export async function renderProfile(app) {
  if (!auth.isLoggedIn()) { location.hash = "#/login"; return; }
  const name = auth.user.name;

  app.innerHTML = `<div class="container-narrow" id="wrap">Loading…</div>`;
  const wrap = document.getElementById("wrap");

  try {
    const res = await ProfileAPI.me(name);
    const p = res.data || res;
    auth.setCredits(p.credits);

    wrap.innerHTML = `
    <div class="card card-yellow p-4">
      <div class="d-flex align-items-center gap-3 mb-3">
        <img src="${p.avatar?.url || ASSETS.avatarDefault}" class="rounded-circle" width="64" height="64" alt="">
        <div><h4 class="m-0">${p.name}</h4><div class="text-muted small">${p.email || ""}</div></div>
      </div>

      <form id="avatarForm" class="input-group mb-4" style="max-width:520px;">
        <input name="avatar" class="form-control" placeholder="New avatar URL">
        <button class="btn btn-outline-dark">Update avatar</button>
      </form>

      <h6 class="mt-2">My Listings</h6>
      <ul class="list-group mb-3 small">
        ${(p.listings || []).map(l => `
          <li class="list-group-item d-flex justify-content-between">
            <span>${l.title}</span>
            <span class="d-flex gap-2">
              <a href="#/listing/${l.id}" class="btn btn-sm btn-outline-primary">Open</a>
              <a href="#/edit/${l.id}" class="btn btn-sm btn-outline-dark">Edit</a>
            </span>
          </li>`).join("") || "<li class='list-group-item'>No listings</li>"}
      </ul>

      <h6>My Bids</h6>
      <ul class="list-group small">
        ${(p.bids || []).map(b => `
          <li class="list-group-item d-flex justify-content-between">
            <span>${b.listing?.title || "Listing"}</span>
            <span>${b.amount} cr</span>
          </li>`).join("") || "<li class='list-group-item'>No bids</li>"}
      </ul>
    </div>`;

    document.getElementById("avatarForm").onsubmit = async (e) => {
      e.preventDefault();
      const url = new FormData(e.target).get("avatar")?.trim();
      if (!url) return;
      try { await ProfileAPI.update(name, { avatar: { url } }); auth.setAvatar(url); location.reload(); }
      catch (e) { alert(e.message); }
    };
  } catch (e) { wrap.innerHTML = `<p class="text-danger">${e.message}</p>`; }
}
