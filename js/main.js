import { router, mountHeader, ensureDefaultHash } from "./router.js";
import { createApiKeyIfMissing } from "./utils/api.js";
import { auth } from "./state/auth.js";

ensureDefaultHash();
mountHeader();

(async () => {
  try {
    if (auth.isLoggedIn()) {
      await createApiKeyIfMissing();
    }
  } catch (e) {
    console.warn("API key ensure failed:", e);
  } finally {
    router();
  }
})();
(function attachHamburger() {
  const btn = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    menu.classList.toggle("show");
    const expanded = menu.classList.contains("show");
    btn.setAttribute("aria-expanded", String(expanded));
  });

  // Auto-close menu on navigation
  window.addEventListener("hashchange", () => {
    menu.classList.remove("show");
    btn.setAttribute("aria-expanded", "false");
  });
})();
