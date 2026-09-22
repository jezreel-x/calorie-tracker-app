import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EMPTY_DRAFT, MACROS } from "../constants/nutrition";
import { fieldClass, labelClass, primaryButtonClass, secondaryButtonClass } from "./ui/fields";
import { draftErrors, draftToItem } from "../utils/draft";

const NUMERIC_FIELDS = [
  { key: "calories", label: "Calories", placeholder: "0" },
  ...MACROS.map((macro) => ({
    key: macro.key,
    label: `${macro.label} (g)`,
    placeholder: "0",
  })),
];

const AddFoodForm = ({ onAdd, onClose }) => {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [submitted, setSubmitted] = useState(false);
  const reduceMotion = useReducedMotion();

  const errors = draftErrors(draft);
  const canSubmit = Object.keys(errors).length === 0;

  const setField = (key, value) => setDraft({ ...draft, [key]: value });

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!canSubmit) return;

    onAdd(draftToItem(draft));
    setDraft(EMPTY_DRAFT);
    setSubmitted(false);
    onClose();
  };

  // Errors stay quiet until a submit has been attempted — flagging a field the
  // moment it is focused and left blank is noise, not help.
  const showError = (key) => submitted && errors[key];

  return (
    <motion.form
      onSubmit={submit}
      initial={reduceMotion ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
      className="mt-4 rounded-xl border border-line bg-surface-muted p-4 sm:p-5"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="food-name">
            Item name
          </label>
          <input
            id="food-name"
            type="text"
            autoFocus
            placeholder="e.g. Greek yoghurt"
            className={fieldClass(showError("name"))}
            value={draft.name}
            onChange={(e) => setField("name", e.target.value)}
          />
        </div>

        {NUMERIC_FIELDS.map((field) => (
          <div key={field.key}>
            <label className={labelClass} htmlFor={`food-${field.key}`}>
              {field.label}
            </label>
            <input
              id={`food-${field.key}`}
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              placeholder={field.placeholder}
              className={fieldClass(showError(field.key))}
              value={draft[field.key]}
              onChange={(e) => setField(field.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      {submitted && !canSubmit && (
        <p className="mt-3 text-sm text-critical">
          {errors.name
            ? "Give the item a name."
            : "Macros can be left blank, but not negative."}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="submit" className={primaryButtonClass} disabled={!canSubmit}>
          Add item
        </button>
        <button type="button" className={secondaryButtonClass} onClick={onClose}>
          Cancel
        </button>
      </div>
    </motion.form>
  );
};

export default AddFoodForm;
