// src/lib/favorites.js
const STORAGE_KEY = "stocksight_favorites_v1";

function safeWindow() {
  return typeof window === "undefined" ? null : window;
}

export function getFavorites() {
  const w = safeWindow();
  if (!w) return [];

  try {
    const raw = w.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // normalize to uppercase strings and dedupe
    const set = new Set(
      parsed
        .map((t) => (typeof t === "string" ? t.toUpperCase().trim() : ""))
        .filter(Boolean)
    );
    return Array.from(set);
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  const w = safeWindow();
  if (!w) return;
  try {
    w.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function toggleFavorite(ticker) {
  const sym = (ticker || "").toUpperCase().trim();
  if (!sym) return { list: getFavorites(), isNowFavorite: false };

  const current = getFavorites();
  const exists = current.includes(sym);
  let next;

  if (exists) {
    next = current.filter((t) => t !== sym);
  } else {
    next = [...current, sym];
  }

  saveFavorites(next);
  return { list: next, isNowFavorite: !exists };
}

export function isFavorite(ticker) {
  const sym = (ticker || "").toUpperCase().trim();
  if (!sym) return false;
  return getFavorites().includes(sym);
}

// optional helper if you ever want a "Clear all" button somewhere
export function clearFavorites() {
  saveFavorites([]);
}
