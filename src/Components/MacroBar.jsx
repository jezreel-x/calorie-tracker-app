import { formatGrams, formatPercent } from "../utils/num";

// A stacked bar of where the day's energy comes from, with the legend carrying
// identity. Per the mark spec the bar is thin, the segments are separated by a
// 2px gap in the surface colour rather than by strokes, and only the two outer
// data-ends are rounded — an interior segment with its own rounding would read
// as a separate bar.
const MacroBar = ({ split }) => {
  const visible = split.filter((part) => part.share > 0);

  return (
    <div>
      <div
        className="flex h-2.5 gap-0.5 overflow-hidden rounded-[4px]"
        role="img"
        aria-label={
          visible.length
            ? `Energy split: ${visible
                .map((p) => `${p.label} ${formatPercent(p.share)}`)
                .join(", ")}`
            : "No energy logged yet"
        }
      >
        {visible.length > 0 ? (
          visible.map((part) => (
            <div
              key={part.key}
              className="h-full first:rounded-l-[4px] last:rounded-r-[4px]"
              style={{
                width: `${part.share * 100}%`,
                backgroundColor: part.fill,
              }}
            />
          ))
        ) : (
          <div className="h-full w-full rounded-[4px] bg-surface-muted" />
        )}
      </div>

      {/* The legend is the dependable identity channel — the colour chip sits
          beside the text, never on it. */}
      <dl className="mt-3 space-y-1.5">
        {split.map((part) => (
          <div key={part.key} className="flex items-center gap-2 text-sm">
            <span
              className={`size-2 shrink-0 rounded-full ${part.dot}`}
              aria-hidden="true"
            />
            <dt className="text-ink-muted">{part.label}</dt>
            <dd className="ml-auto flex items-baseline gap-2">
              <span className="tabular-nums text-ink">
                {formatGrams(part.grams)}
              </span>
              <span className="w-9 text-right tabular-nums text-xs text-ink-subtle">
                {formatPercent(part.share)}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default MacroBar;
