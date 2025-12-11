// src/lib/api.js

// -----------------------------
// API BASE URL (auto: dev = localhost, prod = Render)
// -----------------------------
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8080"; // fallback for local dev

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

function buildParams(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });
  return search.toString();
}

async function parseError(res) {
  try {
    const data = await res.json();
    return data?.error || null;
  } catch {
    return null;
  }
}

// -----------------------------
// INDICATORS
// -----------------------------
export async function fetchIndicators({ ticker, range, interval }) {
  const qs = buildParams({
    ticker: ticker?.toUpperCase(),
    range,
    interval,
    limit: 500,
  });

  const res = await fetch(apiUrl(`/api/indicators?${qs}`));

  if (!res.ok) {
    const err = await parseError(res);
    return {
      ok: false,
      error: err || `Failed with status ${res.status}`,
    };
  }

  return {
    ok: true,
    data: await res.json(),
  };
}

// -----------------------------
// PRICES
// -----------------------------
export async function fetchPrices({ ticker, range, interval, limit }) {
  const qs = buildParams({
    ticker: ticker?.toUpperCase(),
    range,
    interval,
    limit: limit || 500,
  });

  const res = await fetch(apiUrl(`/api/prices?${qs}`));

  if (!res.ok) {
    const err = await parseError(res);
    return {
      ok: false,
      error: err || `Failed with status ${res.status}`,
    };
  }

  return {
    ok: true,
    data: await res.json(),
  };
}
