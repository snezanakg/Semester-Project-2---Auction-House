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
// Mobile menu toggle
(function attachHamburger() {
  const btn = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const open = menu.classList.contains("d-none");
    menu.classList.toggle("d-none", !open);
    btn.setAttribute("aria-expanded", String(open));
  });

  // Close menu on route change
  window.addEventListener("hashchange", () => {
    menu.classList.add("d-none");
    btn.setAttribute("aria-expanded", "false");
  });
})();
