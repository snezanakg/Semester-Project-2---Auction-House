import { ListingsAPI } from "../utils/api.js";
import { highestBid, countdownText } from "../utils/format.js";
import { ASSETS } from "../utils/assets.js";

// rotate your art as fallbacks
const FALLBACKS = [ASSETS.listing1, ASSETS.listing2, ASSETS.listing3, ASSETS.listing4];

function card(l, idx) {
  const img = (l.media?.[0]?.url) || FALLBACKS[idx % FALLBACKS.length];
  const top = highestBid(l.bids);
  return `
  <div class="card mb-3">
    <div class="row g-0">
      <div class="col-4">
        <img alt="" src="${img}" class="img-fluid rounded-start"
             onerror="this.onerror=null;this.src='${FALLBACKS[idx % FALLBACKS.length]}';">
      </div>
      <div class="col-8">
        <div class="card-body">
          <h5 class="card-title">${l.title}</h5>
          <p class="card-text small text-muted mb-1">${l.description ?? ""}</p>
          <p class="card-text mb-1"><span class="fw-semibold">Current:</span> ${top} cr</p>
          <p class="card-text small text-muted">Ends: ${countdownText(l.endsAt)}</p>
          <a href="#/listing/${l.id}" class="btn btn-primary btn-sm">Open Post</a>
        </div>
      </div>
    </div>
  </div>`;
}

export async function renderHome(app) {
  app.innerHTML = `
  <div class="container-narrow">
    <div class="input-group mb-3">
      <input id="q" class="form-control" placeholder="Search listings...">
      <button id="searchBtn" class="btn btn-outline-secondary">Search</button>
    </div>
    <div id="list">Loading…</div>
  </div>`;

  const list = document.getElementById("list");

  async function load(q = "") {
    list.textContent = "Loading…";
    try {
      const res = await ListingsAPI.list(q);
      const items = res.data || res;
      list.innerHTML = items.map(card).join("") || "<p>No listings yet.</p>";
    } catch (e) {
      list.innerHTML = `<p class="text-danger">${e.message}</p>`;
    }
  }

  document.getElementById("searchBtn").onclick = () => load(document.getElementById("q").value.trim());
  await load();
}

