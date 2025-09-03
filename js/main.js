import { router, mountHeader, ensureDefaultHash } from "./router.js";
ensureDefaultHash();
mountHeader();
router();
