export function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}
export function highestBid(bids = []) {
  return bids.reduce((m, b) => Math.max(m, b.amount), 0);
}
export function countdownText(iso) {
  const end = new Date(iso).getTime();
  const now = Date.now();
  if (now >= end) return "Ended";
  const s = Math.floor((end - now) / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${h}h ${m}m ${ss}s`;
}
