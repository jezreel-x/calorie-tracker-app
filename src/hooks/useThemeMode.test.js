import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useThemeMode from "./useThemeMode";

const STORAGE_KEY = "nutrition-meter:theme";

// A matchMedia stub that can report either OS setting, and that captures the
// change listener so an OS switch can be simulated.
const mockMatchMedia = (prefersDark) => {
  const listeners = new Set();

  window.matchMedia = vi.fn().mockImplementation((media) => ({
    matches: prefersDark,
    media,
    addEventListener: (_event, handler) => listeners.add(handler),
    removeEventListener: (_event, handler) => listeners.delete(handler),
    addListener: (handler) => listeners.add(handler),
    removeListener: (handler) => listeners.delete(handler),
    dispatchEvent: vi.fn(),
  }));

  return {
    emit: (matches) => listeners.forEach((handler) => handler({ matches })),
  };
};

beforeEach(() => {
  window.localStorage.clear();
});

describe("useThemeMode", () => {
  it("follows the OS when nothing has been chosen", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useThemeMode());

    expect(result.current.mode).toBe("dark");
    expect(result.current.preference).toBe("system");
  });

  it("keeps following the OS while the preference is 'system'", () => {
    const media = mockMatchMedia(false);
    const { result } = renderHook(() => useThemeMode());

    expect(result.current.mode).toBe("light");

    // Someone switching their machine to dark at sunset should see this move.
    act(() => media.emit(true));

    expect(result.current.mode).toBe("dark");
  });

  it("puts the resolved mode on the root element, which is what the tokens key off", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useThemeMode());

    expect(document.documentElement.classList.contains("dark")).toBe(false);

    act(() => result.current.toggle());

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("stores an explicit choice so it survives a reload", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useThemeMode());

    act(() => result.current.toggle());

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  it("restores a stored choice over the OS setting", () => {
    window.localStorage.setItem(STORAGE_KEY, "light");
    mockMatchMedia(true);

    const { result } = renderHook(() => useThemeMode());

    expect(result.current.mode).toBe("light");
  });

  it("toggles away from what is on screen, not from the stored preference", () => {
    // OS is dark and nothing is stored, so the first toggle must go to light.
    mockMatchMedia(true);
    const { result } = renderHook(() => useThemeMode());

    act(() => result.current.toggle());

    expect(result.current.mode).toBe("light");
  });

  it("falls back to light when the browser has no matchMedia", () => {
    delete window.matchMedia;

    const { result } = renderHook(() => useThemeMode());

    expect(result.current.mode).toBe("light");
  });
});
