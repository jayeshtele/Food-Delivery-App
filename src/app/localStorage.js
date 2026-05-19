const STORAGE_KEY = "noirbite-state";

export function loadState() {
  if (typeof localStorage === "undefined") {
    return undefined;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

export function saveState(state) {
  if (typeof localStorage === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failures so checkout never breaks because of browser limits.
  }
}
