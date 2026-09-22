import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import MacroBar from "./MacroBar";
import { CALORIE_LIMIT } from "../constants/nutrition";
import { formatNumber } from "../utils/num";

const Summary = ({ totals, split, itemCount }) => {
  const isOver = totals.calories > CALORIE_LIMIT;
  const progress = Math.min(totals.calories / CALORIE_LIMIT, 1);
  const remaining = CALORIE_LIMIT - totals.calories;

  return (
    <section className="rounded-xl border border-line bg-surface-muted p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
        Today
      </h2>

      {/* The one hero figure on the page. Proportional figures, not tabular —
          tabular gives every digit the width of a zero, which reads loose at
          display sizes. */}
      <p className="mt-2 flex items-baseline gap-2">
        <span className="text-5xl font-bold leading-none tracking-tight text-ink">
          {formatNumber(totals.calories)}
        </span>
        <span className="text-sm text-ink-muted">
          / {formatNumber(CALORIE_LIMIT)} cal
        </span>
      </p>

      {/* Meter: the fill carries severity, and the track is a soft step of the
          same colour so the state reads across the whole bar. */}
      <div
        className={`mt-4 h-2 w-full overflow-hidden rounded-[4px] ${
          isOver ? "bg-warning-soft" : "bg-accent-soft"
        }`}
        role="progressbar"
        aria-valuenow={Math.round(totals.calories)}
        aria-valuemin={0}
        aria-valuemax={CALORIE_LIMIT}
        aria-label="Calories against today's guideline"
      >
        <div
          className={`h-full rounded-[4px] transition-[width] duration-300 ease-out ${
            isOver ? "bg-warning" : "bg-accent"
          }`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {isOver ? (
        // Status colour never travels alone: an icon and the wording carry it
        // too, so the meaning survives without hue.
        <p
          role="status"
          className="mt-3 flex items-start gap-2 text-sm text-ink"
        >
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="mt-0.5 shrink-0 text-warning"
            aria-hidden="true"
          />
          <span>
            {formatNumber(Math.abs(remaining))} cal over the guideline.
          </span>
        </p>
      ) : (
        <p className="mt-3 text-sm text-ink-muted">
          {formatNumber(remaining)} cal left today.
        </p>
      )}

      <div className="mt-5 border-t border-line pt-5">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Where the energy comes from
        </h3>
        {itemCount > 0 ? (
          <MacroBar split={split} />
        ) : (
          <p className="text-sm text-ink-subtle">
            Add a food to see the breakdown.
          </p>
        )}
      </div>
    </section>
  );
};

export default Summary;
