const STORAGE_KEY = "stocksight_favorites";

function safeParse(jsonString) {
  try {
    const value = JSON.parse(jsonString);
    if (Array.isArray(value)) {
      return value;
    }
    return [];
  } catch {
    return [];
  }
}

export function getFavorites() {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }

  return safeParse(stored);
}

export function saveFavorites(list) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addFavorite(symbol) {
  const list = getFavorites();
  const next = list.includes(symbol) ? list : [...list, symbol];
  saveFavorites(next);
}

export function removeFavorite(symbol) {
  const list = getFavorites();
  const next = list.filter((s) => s !== symbol);
  saveFavorites(next);
}
