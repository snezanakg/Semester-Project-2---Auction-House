import { ListingsAPI } from "../utils/api.js";
import { auth } from "../state/auth.js";
import { highestBid, formatDateTime } from "../utils/format.js";
import { ASSETS } from "../utils/assets.js";

export async function renderListing(app, id) {
  app.innerHTML = `<div class="container-narrow" id="wrap">Loading…</div>`;
  const wrap = document.getElementById("wrap");

  try {
    const res = await ListingsAPI.byId(id);
    const l = res.data || res;
    const img = l.media?.[0]?.url || ASSETS.listing3; // fallback
    const top = highestBid(l.bids);
    const isOwner = auth.user?.name && l.seller?.name === auth.user.name;
    const ended = Date.now() >= new Date(l.endsAt).getTime();

    wrap.innerHTML = `
    <div class="card card-yellow p-4">
      <div class="d-flex justify-content-between align-items-start">
        <h3 class="mb-3">${l.title}</h3>
        ${isOwner ? `
          <div class="d-flex gap-2">
            <a href="#/edit/${l.id}" class="btn btn-sm btn-outline-dark">Edit</a>
            <button id="delBtn" class="btn btn-sm btn-outline-danger">Delete</button>
          </div>` : ``}
      </div>
      <img src="${img}" class="img-fluid rounded mb-3" alt=""
           onerror="this.onerror=null;this.src='${ASSETS.listing3}';">
      <p>${l.description ?? ""}</p>
      <p class="mb-1"><span class="fw-semibold">Current:</span> ${top} cr</p>
      <p class="text-muted small mb-3">Ends: ${formatDateTime(l.endsAt)}</p>

      <div class="mb-3">
        <h6 class="mb-2">Bid history</h6>
        <ul class="list-group small mb-3">
          ${(l.bids || []).slice().reverse().map(b => `
            <li class="list-group-item d-flex justify-content-between">
              <span>${b.bidder?.name || "User"}</span><span>${b.amount} cr</span>
            </li>`).join("") || "<li class='list-group-item'>No bids yet</li>"}
        </ul>
      </div>

      ${auth.isLoggedIn() && !isOwner && !ended ? `
        <form id="bidForm" class="d-flex gap-2">
          <input class="form-control" type="number" name="amount" min="${top + 1}" placeholder="${top + 1}" required>
          <button class="btn btn-primary">Place bid</button>
        </form>
        <p id="err" class="text-danger small mt-2"></p>
      ` : `<p class="text-muted">${ended ? "This auction has ended." : "Log in to bid."}${isOwner ? " You can't bid on your own listing." : ""}</p>`}
    </div>`;

    const delBtn = document.getElementById("delBtn");
    if (delBtn) {
      delBtn.onclick = async () => {
        if (!confirm("Delete this listing?")) return;
        try { await ListingsAPI.remove(l.id); location.hash = "#/listings"; }
        catch (e) { alert(e.message); }
      };
    }

    const form = document.getElementById("bidForm");
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const err = document.getElementById("err"); err.textContent = "";
        const { amount } = Object.fromEntries(new FormData(form));
        try { await ListingsAPI.bid(id, Number(amount)); location.reload(); }
        catch (e) { err.textContent = e.message; }
      };
    }
  } catch (e) { wrap.innerHTML = `<p class="text-danger">${e.message}</p>`; }
}
