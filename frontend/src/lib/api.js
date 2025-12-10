// src/lib/api.js

const API_ROOT = "/api"; 

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

export async function fetchIndicators({ ticker, range, interval }) {
  const qs = buildParams({
    ticker: ticker?.toUpperCase(),
    range,
    interval,
  });

  const res = await fetch(`${API_ROOT}/indicators?${qs}`);

  // 🎯 soft error handling so TickerForm can decide to show message
  if (!res.ok) {
    const err = await parseError(res);
    return {
      ok: false,
      error: err || `Failed with status ${res.status}`
    };
  }

  return {
    ok: true,
    data: await res.json()
  };
}

export async function fetchPrices({ ticker, range, interval, limit }) {
  const qs = buildParams({
    ticker: ticker?.toUpperCase(),
    range,
    interval,
    limit,
  });

  const res = await fetch(`${API_ROOT}/prices?${qs}`);

  if (!res.ok) {
    const err = await parseError(res);
    return {
      ok: false,
      error: err || `Failed with status ${res.status}`
    };
  }

  return {
    ok: true,
    data: await res.json()
  };
}
