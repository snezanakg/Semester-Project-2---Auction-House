import { renderHome } from "./pages/home.js";
import { renderLogin } from "./pages/login.js";
import { renderRegister } from "./pages/register.js";
import { renderListing } from "./pages/listing.js";
import { renderCreate } from "./pages/create.js";
import { renderEdit } from "./pages/edit.js";
import { renderProfile } from "./pages/profile.js";
import { auth } from "./state/auth.js";
import { ASSETS } from "./utils/assets.js";

const routes = {
  "/listings": renderHome,
  "/login": renderLogin,
  "/register": renderRegister,
  "/listing": renderListing,
  "/create": renderCreate,
  "/edit": renderEdit,
  "/profile": renderProfile,
};

export function ensureDefaultHash() {
  if (!location.hash) location.hash = "#/listings";
}

export function mountHeader() {
  const creditsPill = document.getElementById("creditsPill");
  const navLogin = document.getElementById("navLogin");
  const navLogout = document.getElementById("navLogout");
  const navCreate = document.getElementById("navCreate");
  const navProfile = document.getElementById("navProfile");

  const userBlock = document.getElementById("userBlock");
  const userAvatar = document.getElementById("userAvatar");
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");
  const userCreditsInline = document.getElementById("userCreditsInline");

  function refresh() {
    if (auth.isLoggedIn()) {
      const u = auth.user || {};
      creditsPill.classList.remove("d-none");
      creditsPill.textContent = `${u.credits ?? 0} cr`;
      navLogin.classList.add("d-none");
      navLogout.classList.remove("d-none");
      navCreate.classList.remove("d-none");
      navProfile.classList.remove("d-none");

      userBlock.classList.remove("d-none");
      userAvatar.src = (u.avatar && (u.avatar.url || u.avatar)) || ASSETS.avatarDefault;
      userAvatar.alt = u.name ? `${u.name} avatar` : "User avatar";
      userName.textContent = u.name || "User";
      userEmail.textContent = u.email || "";
      userCreditsInline.textContent = `Credits: ${u.credits ?? 0}`;
    } else {
      creditsPill.classList.add("d-none");
      navLogin.classList.remove("d-none");
      navLogout.classList.add("d-none");
      navCreate.classList.add("d-none");
      navProfile.classList.add("d-none");
      userBlock.classList.add("d-none");
    }
  }
  refresh();
  window.addEventListener("auth-changed", refresh);
  navLogout.onclick = () => auth.logout();
}

export async function router() {
  const app = document.getElementById("app");
  const [_, rawPath, param] = (location.hash || "#/listings").split("/");
  const path = `/${rawPath || "listings"}`;
  const handler = routes[path] || renderHome;
  await handler(app, param);
}

window.addEventListener("hashchange", () => { ensureDefaultHash(); router(); });
