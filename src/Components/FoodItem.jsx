import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrashCan,
  faPlus,
  faMinus,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { MACROS } from "../constants/nutrition";
import { draftErrors, draftToItem, itemToDraft } from "../utils/draft";
import { energyMismatch } from "../utils/energy";
import {
  destructiveGhostClass,
  fieldClass,
  ghostButtonClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
  stepperButtonClass,
} from "./ui/fields";
import { formatGrams, formatNumber } from "../utils/num";

const FoodItem = ({ item, onUpdate, onRemove, onQuantityChange }) => {
  const reduceMotion = useReducedMotion();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(() => itemToDraft(item));

  const errors = draftErrors(draft);
  const canSave = Object.keys(errors).length === 0;

  // Checked per serving rather than per row, so the hint doesn't come and go
  // as the quantity changes.
  const mismatch = energyMismatch(item);
  const mismatchNote = mismatch
    ? `The macros add up to about ${formatNumber(mismatch.derived)} cal, not ${formatNumber(
        mismatch.logged
      )}. Worth checking the serving size.`
    : "";

  // Reset the draft from the saved values, so cancelling discards edits and
  // reopening never shows a stale draft.
  const startEditing = () => {
    setDraft(itemToDraft(item));
    setIsEditing(true);
  };

  const save = (event) => {
    event.preventDefault();
    if (!canSave) return;
    onUpdate(item.id, draftToItem(draft, item.id, item.quantity));
    setIsEditing(false);
  };

  const motionProps = {
    layout: !reduceMotion,
    initial: reduceMotion ? false : { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    exit: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, x: -16, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 },
    transition: { duration: reduceMotion ? 0 : 0.18, ease: "easeOut" },
  };

  if (isEditing) {
    return (
      <motion.form
        {...motionProps}
        onSubmit={save}
        className="mb-2 overflow-hidden rounded-xl border border-accent bg-surface-muted p-4"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor={`edit-name-${item.id}`}>
              Item name
            </label>
            <input
              id={`edit-name-${item.id}`}
              type="text"
              className={fieldClass(!!errors.name)}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </div>

          {[{ key: "calories", label: "Calories" }, ...MACROS.map((m) => ({ key: m.key, label: `${m.label} (g)` }))].map(
            (field) => (
              <div key={field.key}>
                <label className={labelClass} htmlFor={`edit-${field.key}-${item.id}`}>
                  {field.label}
                </label>
                <input
                  id={`edit-${field.key}-${item.id}`}
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  className={fieldClass(!!errors[field.key])}
                  value={draft[field.key]}
                  onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                />
              </div>
            )
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className={secondaryButtonClass} onClick={() => setIsEditing(false)}>
            Cancel
          </button>
          <button type="submit" className={primaryButtonClass} disabled={!canSave}>
            Save
          </button>
        </div>
      </motion.form>
    );
  }

  return (
    <motion.article
      {...motionProps}
      className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-line-strong"
    >
      <div className="min-w-0 flex-1 basis-full sm:basis-auto">
        <h3 className="truncate font-medium text-ink">{item.name}</h3>

        {/* Identity rides the chip; the figure itself stays in ink. */}
        <dl className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
          {MACROS.map((macro) => (
            <div key={macro.key} className="flex items-center gap-1.5">
              <span className={`size-2 shrink-0 rounded-full ${macro.dot}`} aria-hidden="true" />
              <dt aria-label={macro.label}>{macro.short}</dt>
              <dd className="tabular-nums">{formatGrams(item[macro.key] * item.quantity)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mr-auto flex items-center gap-1.5 whitespace-nowrap text-sm sm:mr-0">
        <span className="font-semibold tabular-nums text-ink">
          {formatNumber(item.calories * item.quantity)}
        </span>
        <span className="text-ink-muted">cal</span>
        {mismatch && (
          // The shape carries the signal, and the accessible name carries the
          // detail — the colour is doing neither job on its own.
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="text-warning"
            title={mismatchNote}
            aria-label={mismatchNote}
            role="img"
          />
        )}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onQuantityChange(item.id, -1)}
          disabled={item.quantity <= 1}
          aria-label={`Decrease quantity of ${item.name}`}
          className={stepperButtonClass}
        >
          <FontAwesomeIcon icon={faMinus} className="text-xs" />
        </button>
        <span className="min-w-5 text-center text-sm tabular-nums text-ink">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => onQuantityChange(item.id, 1)}
          aria-label={`Increase quantity of ${item.name}`}
          className={stepperButtonClass}
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={startEditing}
          aria-label={`Edit ${item.name}`}
          className={ghostButtonClass}
        >
          <FontAwesomeIcon icon={faPen} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name}`}
          className={destructiveGhostClass}
        >
          <FontAwesomeIcon icon={faTrashCan} aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
};

export default FoodItem;
