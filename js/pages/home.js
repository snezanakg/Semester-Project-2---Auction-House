import { ListingsAPI } from "../utils/api.js";
import { highestBid, countdownText } from "../utils/format.js";
import { ASSETS } from "../utils/assets.js";

const fallbacks = [ASSETS.listing1, ASSETS.listing2, ASSETS.listing3, ASSETS.listing4];

function safeImg(url, fallback) {
  return url || fallback;
}

function card(l, idx) {
  const imgUrl = safeImg(l.media?.[0]?.url, fallbacks[idx % fallbacks.length]);
  const top = highestBid(l.bids);

  return `
  <div class="card mb-3">
    <div class="row g-0">
      <div class="col-4">
        <img alt="" src="${imgUrl}" class="img-fluid rounded-start"
             onerror="this.onerror=null;this.src='${fallbacks[idx % fallbacks.length]}';">
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
