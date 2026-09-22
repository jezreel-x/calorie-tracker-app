import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faPlus,
  faMinus,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "./Components/ThemeToggle";

const CALORIE_LIMIT = 1000;

// parseFloat("") is NaN, and one empty macro field used to poison every total
// on the page with it.
const num = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

// Identity for the three macros lives in a colour chip beside the figure; the
// figure itself stays in ink, so the colour never carries the meaning alone.
const MACROS = [
  { key: "protein", label: "Protein", dot: "bg-protein" },
  { key: "carbs", label: "Carbs", dot: "bg-carbs" },
  { key: "fat", label: "Fat", dot: "bg-fat" },
];

const fieldClass = (invalid) =>
  [
    "w-full rounded-lg border bg-surface px-3 py-2 text-ink transition-colors",
    "placeholder:text-ink-subtle",
    "focus:outline-none focus:ring-3 focus:ring-[var(--app-focus)]",
    invalid
      ? "border-critical focus:border-critical"
      : "border-line focus:border-accent",
  ].join(" ");

const NutritionMeter = ({ mode, onToggleTheme }) => {
  const defaultItemsDisplayed = [
    { id: 1, name: "Apple", calories: 52, protein: 0.26, carbs: 14, fat: 1, quantity: 1 },
    { id: 2, name: "Banana", calories: 89, protein: 1.09, carbs: 23, fat: 5, quantity: 1 },
    { id: 3, name: "Grapes", calories: 40, protein: 0.2, carbs: 20, fat: 2, quantity: 1 },
    { id: 4, name: "Orange", calories: 35, protein: 0.15, carbs: 25, fat: 4, quantity: 1 },
  ];

  const [nutritionItems, setNutritionItems] = useState(defaultItemsDisplayed);
  const [newItem, setNewItem] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const [editItem, setEditItem] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [inputError, setInputError] = useState(false);

  useEffect(() => {
    const calculateTotalCalories = nutritionItems.reduce(
      (total, item) => total + num(item.calories) * item.quantity,
      0
    );

    setTotalCalories(calculateTotalCalories);
    setShowWarning(calculateTotalCalories > CALORIE_LIMIT);
  }, [nutritionItems]);

  const addNutritionItem = () => {
    if (
      newItem.name &&
      newItem.calories >= 0 &&
      newItem.protein >= 0 &&
      newItem.carbs >= 0 &&
      newItem.fat >= 0
    ) {
      setNutritionItems([
        ...nutritionItems,
        { ...newItem, id: Date.now(), quantity: 1 },
      ]);
      setNewItem({ name: "", calories: "", protein: "", carbs: "", fat: "" });
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  const removeAllItems = () => {
    setNutritionItems([]);
  };

  const editItemFunction = (item) => {
    setEditItem(item.id);
    setNewItem({ ...item });
  };

  const updateItemFunction = () => {
    if (
      newItem.name &&
      newItem.calories >= 0 &&
      newItem.protein >= 0 &&
      newItem.carbs >= 0 &&
      newItem.fat >= 0
    ) {
      const updatedItems = nutritionItems.map((item) =>
        item.id === newItem.id ? newItem : item
      );
      setNutritionItems(updatedItems);
      setNewItem({ name: "", calories: "", protein: "", carbs: "", fat: "" });
      setEditItem(null);
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  const deleteItemFunction = (id) => {
    setNutritionItems(nutritionItems.filter((item) => item.id !== id));
  };

  const updateItemQuantity = (id, change) => {
    setNutritionItems(
      nutritionItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + change, 1) }
          : item
      )
    );
  };

  const totalFor = (key) =>
    nutritionItems.reduce(
      (total, item) => total + num(item[key]) * item.quantity,
      0
    );

  // Trailing zeroes read as noise on a macro figure: 14 rather than 14.00,
  // but 0.26 keeps its precision.
  const round = (value) => Math.round(value * 100) / 100;

  const isEditing = editItem !== null;

  return (
    <div className="w-full max-w-[600px] rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-8 min-[900px]:max-w-[960px]">
      <header className="mb-6 flex items-start justify-between gap-4 border-b border-line pb-5">
        <div>
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-ink">
            Nutrition Meter
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Track the calories and macros in what you eat.
          </p>
        </div>
        <ThemeToggle mode={mode} onToggle={onToggleTheme} />
      </header>

      {showWarning && (
        // Status colour never travels alone: icon + wording carry it too.
        <div
          role="status"
          className="mb-6 flex items-center gap-3 rounded-lg border border-warning bg-warning-soft px-4 py-3 text-sm text-ink"
        >
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="text-warning"
            aria-hidden="true"
          />
          <span>
            Over the {CALORIE_LIMIT.toLocaleString()} calorie guideline for
            today.
          </span>
        </div>
      )}

      <div className="mb-6 rounded-xl border border-line bg-surface-muted p-4 sm:p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink">
          {isEditing ? "Edit food" : "Add food"}
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="text"
            aria-label="Item name"
            placeholder="Item name"
            className={`${fieldClass(inputError && !newItem.name)} sm:col-span-2`}
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="number"
            aria-label="Calories"
            placeholder="Calories"
            className={fieldClass(inputError && newItem.calories < 0)}
            value={newItem.calories}
            onChange={(e) => setNewItem({ ...newItem, calories: e.target.value })}
          />
          <input
            type="number"
            aria-label="Protein in grams"
            placeholder="Protein (g)"
            className={fieldClass(inputError && newItem.protein < 0)}
            value={newItem.protein}
            onChange={(e) => setNewItem({ ...newItem, protein: e.target.value })}
          />
          <input
            type="number"
            aria-label="Carbs in grams"
            placeholder="Carbs (g)"
            className={fieldClass(inputError && newItem.carbs < 0)}
            value={newItem.carbs}
            onChange={(e) => setNewItem({ ...newItem, carbs: e.target.value })}
          />
          <input
            type="number"
            aria-label="Fat in grams"
            placeholder="Fat (g)"
            className={fieldClass(inputError && newItem.fat < 0)}
            value={newItem.fat}
            onChange={(e) => setNewItem({ ...newItem, fat: e.target.value })}
          />
        </div>

        {inputError && (
          <p className="mt-3 text-sm text-critical">
            Give the item a name, and keep every macro at zero or above.
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={isEditing ? updateItemFunction : addNutritionItem}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-ink-inverse transition-colors hover:bg-accent-hover"
          >
            {isEditing ? "Update item" : "Add item"}
          </button>
          <button
            type="button"
            onClick={removeAllItems}
            className="rounded-lg border border-line-strong px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-critical hover:bg-critical-soft hover:text-critical"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 min-[900px]:grid-cols-3">
        {nutritionItems.map((item) => (
          <article
            key={item.id}
            className="flex flex-col rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong"
          >
            <h3 className="font-semibold text-ink">{item.name}</h3>

            <p className="mt-1 text-sm text-ink-muted">
              <span className="font-medium text-ink tabular-nums">
                {round(num(item.calories) * item.quantity)}
              </span>{" "}
              cal
            </p>

            <dl className="mt-3 space-y-1.5 text-sm">
              {MACROS.map((macro) => (
                <div key={macro.key} className="flex items-center gap-2">
                  <span
                    className={`size-2 shrink-0 rounded-full ${macro.dot}`}
                    aria-hidden="true"
                  />
                  <dt className="text-ink-muted">{macro.label}</dt>
                  <dd className="ml-auto tabular-nums text-ink">
                    {round(num(item[macro.key]) * item.quantity)}g
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
              <button
                type="button"
                onClick={() => updateItemQuantity(item.id, -1)}
                disabled={item.quantity <= 1}
                aria-label={`Decrease quantity of ${item.name}`}
                className="inline-flex size-7 items-center justify-center rounded-md border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-muted"
              >
                <FontAwesomeIcon icon={faMinus} className="text-xs" />
              </button>
              <span
                className="min-w-5 text-center text-sm tabular-nums text-ink"
                aria-label={`Quantity: ${item.quantity}`}
              >
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateItemQuantity(item.id, 1)}
                aria-label={`Increase quantity of ${item.name}`}
                className="inline-flex size-7 items-center justify-center rounded-md border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <FontAwesomeIcon icon={faPlus} className="text-xs" />
              </button>

              <button
                type="button"
                onClick={() => editItemFunction(item)}
                aria-label={`Edit ${item.name}`}
                className="ml-auto rounded-md px-2 py-1 text-sm text-ink-subtle transition-colors hover:bg-accent-soft hover:text-ink"
              >
                <FontAwesomeIcon icon={faEdit} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => deleteItemFunction(item.id)}
                aria-label={`Delete ${item.name}`}
                className="rounded-md px-2 py-1 text-sm text-ink-subtle transition-colors hover:bg-critical-soft hover:text-critical"
              >
                <FontAwesomeIcon icon={faTrashAlt} aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {nutritionItems.length === 0 && (
        <p className="rounded-xl border border-dashed border-line bg-surface-muted px-6 py-10 text-center text-sm text-ink-muted">
          Nothing logged yet. Add a food above to get started.
        </p>
      )}

      <div className="mt-8 border-t border-line pt-6">
        <div className="grid grid-cols-2 gap-3 min-[900px]:grid-cols-4">
          <div className="rounded-xl border border-line bg-surface-muted p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Calories
            </span>
            <span className="mt-1 block text-2xl font-bold leading-tight text-ink">
              {round(totalCalories)}
            </span>
          </div>

          {MACROS.map((macro) => (
            <div
              key={macro.key}
              className="rounded-xl border border-line bg-surface-muted p-4"
            >
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                <span
                  className={`size-2 shrink-0 rounded-full ${macro.dot}`}
                  aria-hidden="true"
                />
                {macro.label}
              </span>
              <span className="mt-1 block text-2xl font-bold leading-tight text-ink">
                {round(totalFor(macro.key))}
                <span className="text-base font-semibold text-ink-muted">g</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionMeter;
