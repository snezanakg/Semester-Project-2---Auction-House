import { ProfileAPI } from "../utils/api.js";
import { auth } from "../state/auth.js";
import { ASSETS } from "../utils/assets.js";

function updateStoredUser(patch = {}) {
  // Merge into saved user and notify header to refresh
  try {
    const u = auth.user || {};
    const next = { ...u, ...patch };
    localStorage.setItem("ah_user", JSON.stringify(next));
    window.dispatchEvent(new Event("auth-changed"));
  } catch {}
}

export async function renderProfile(app) {
  if (!auth.isLoggedIn()) { location.hash = "#/login"; return; }

  const name = (auth.user?.name || "").trim();
  if (!name) { app.innerHTML = `<p class="text-danger">No user in session.</p>`; return; }

  app.innerHTML = `<div class="container-narrow" id="wrap">Loading…</div>`;
  const wrap = document.getElementById("wrap");

  try {
    // GET /auction/profiles/:name?_listings=true&_bids=true
    const res = await ProfileAPI.me(name);
    const p = res?.data || res;

    // Sync credits to header/user block
    if (typeof p?.credits === "number") updateStoredUser({ credits: p.credits });

    const avatarUrl = p?.avatar?.url || ASSETS.avatarDefault;
    const email = p?.email || "";

    wrap.innerHTML = `
      <div class="card card-yellow p-4">
        <!-- Header (avatar + meta) -->
        <div class="d-flex align-items-center gap-3 mb-4">
          <img src="${avatarUrl}" class="rounded-circle" width="72" height="72" alt="${p.name} avatar"
               onerror="this.onerror=null;this.src='${ASSETS.avatarDefault}'">
          <div>
            <h4 class="m-0">${p.name}</h4>
            <div class="text-muted small">${email}</div>
            <div class="fw-semibold mt-1">Credits: ${p.credits ?? 0}</div>
          </div>
        </div>

        <!-- Update avatar -->
        <form id="avatarForm" class="input-group mb-4" style="max-width:560px;">
          <input name="avatar" class="form-control" placeholder="New avatar URL (https://…)" />
          <button class="btn btn-outline-dark" type="submit">Update avatar</button>
        </form>
        <p id="err" class="text-danger small"></p>

        <!-- My Listings -->
        <h5 class="mt-2 mb-2">My Listings</h5>
        <ul class="list-group mb-4 small">
          ${
            (p.listings && p.listings.length)
              ? p.listings
                  .slice()
                  .sort((a,b)=> new Date(b.created) - new Date(a.created))
                  .map(l => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      <div class="text-truncate" style="max-width:60%">${l.title}</div>
                      <div class="d-flex gap-2">
                        <a href="#/listing/${l.id}" class="btn btn-sm btn-outline-primary">Open</a>
                        <a href="#/edit/${l.id}" class="btn btn-sm btn-outline-dark">Edit</a>
                      </div>
                    </li>
                  `).join("")
              : "<li class='list-group-item'>No listings yet.</li>"
          }
        </ul>

        <!-- My Bids -->
        <h5 class="mb-2">My Bids</h5>
        <ul class="list-group small">
          ${
            (p.bids && p.bids.length)
              ? p.bids
                  .slice()
                  .sort((a,b)=> new Date(b.created) - new Date(a.created))
                  .map(b => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      <span class="text-truncate" style="max-width:60%">${b.listing?.title || "Listing"}</span>
                      <span>${b.amount} cr</span>
                    </li>
                  `).join("")
              : "<li class='list-group-item'>No bids yet.</li>"
          }
        </ul>
      </div>
    `;

    // Handle avatar update
    const avatarForm = document.getElementById("avatarForm");
    const err = document.getElementById("err");
    avatarForm.onsubmit = async (e) => {
      e.preventDefault();
      err.textContent = "";
      const url = new FormData(avatarForm).get("avatar")?.toString().trim();
      if (!url) { err.textContent = "Please enter an image URL."; return; }

      try {
        await ProfileAPI.update(name, { avatar: { url } });
        // Reflect change in header/user state immediately
        updateStoredUser({ avatar: { url } });
        // Reload profile to show updated image/credits
        renderProfile(app);
      } catch (ex) {
        err.textContent = ex?.message || "Failed to update avatar.";
      }
    };

  } catch (e) {
    wrap.innerHTML = `<div class="alert alert-danger">Failed to load profile: ${e?.message || "Unknown error"}</div>`;
  }
}
