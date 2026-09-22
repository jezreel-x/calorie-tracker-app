import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "nutrition-meter:theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

const supportsMatchMedia = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function";

// Absence of a stored value means "follow the system", which is why the
// preference is removed rather than written when it returns to that state.
const readPreference = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
};

const readSystemMode = () => {
  if (!supportsMatchMedia()) return "light";
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
};

const useThemeMode = () => {
  const [preference, setPreference] = useState(readPreference);
  const [systemMode, setSystemMode] = useState(readSystemMode);

  // Keep following the OS while the preference is "system" — someone
  // switching their machine to dark at sunset should see this follow.
  useEffect(() => {
    if (!supportsMatchMedia()) return undefined;

    const query = window.matchMedia(DARK_QUERY);
    const onChange = (event) => setSystemMode(event.matches ? "dark" : "light");

    // addEventListener on MediaQueryList is the modern form; older Safari
    // only has addListener.
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    }
    if (typeof query.addListener === "function") {
      query.addListener(onChange);
      return () => query.removeListener(onChange);
    }
    return undefined;
  }, []);

  useEffect(() => {
    try {
      if (preference === "system") {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, preference);
      }
    } catch {
      // Storage unavailable — the choice just won't survive a reload.
    }
  }, [preference]);

  const mode = preference === "system" ? systemMode : preference;

  // The Tailwind tokens key off `.dark` on the root element, so the resolved
  // mode has to land there rather than in a provider.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const toggle = useCallback(() => {
    setPreference(mode === "dark" ? "light" : "dark");
  }, [mode]);

  return { mode, preference, toggle };
};

export default useThemeMode;
