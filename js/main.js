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
