// Shared control styling. The add form and the inline item editor use the same
// controls, so the classes live here rather than being duplicated across both.

export const fieldClass = (invalid = false) =>
  [
    "w-full rounded-lg border bg-surface px-3 py-2 text-ink transition-colors",
    "placeholder:text-ink-subtle",
    "focus:outline-none focus:ring-3 focus:ring-[var(--app-focus)]",
    invalid
      ? "border-critical focus:border-critical"
      : "border-line focus:border-accent",
  ].join(" ");

export const primaryButtonClass = [
  "rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-ink-inverse",
  "transition-colors hover:bg-accent-hover",
  // Readable while clearly inactive — inverse-on-muted was neither.
  "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-subtle",
  "disabled:border disabled:border-line",
].join(" ");

export const secondaryButtonClass = [
  "rounded-lg border border-line-strong px-4 py-2 text-sm font-medium text-ink-muted",
  "transition-colors hover:bg-surface-muted hover:text-ink",
].join(" ");

export const ghostButtonClass = [
  "rounded-md px-2 py-1 text-sm text-ink-subtle transition-colors",
  "hover:bg-accent-soft hover:text-ink",
].join(" ");

export const destructiveGhostClass = [
  "rounded-md px-2 py-1 text-sm text-ink-subtle transition-colors",
  "hover:bg-critical-soft hover:text-critical",
].join(" ");

export const stepperButtonClass = [
  "inline-flex size-7 items-center justify-center rounded-md border border-line",
  "text-ink-muted transition-colors hover:border-line-strong hover:text-ink",
  "disabled:cursor-not-allowed disabled:opacity-40",
  "disabled:hover:border-line disabled:hover:text-ink-muted",
].join(" ");

export const labelClass =
  "mb-1.5 block text-xs font-medium text-ink-muted";
