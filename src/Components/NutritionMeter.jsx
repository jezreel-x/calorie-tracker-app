import { useEffect, useMemo, useState } from "react";
import AddFoodForm from "./AddFoodForm";
import FoodList from "./FoodList";
import Summary from "./Summary";
import ThemeToggle from "./ThemeToggle";
import { primaryButtonClass } from "./ui/fields";
import normalizeFoodItem from "../utils/normalizeFoodItem";
import { macroEnergySplit, totalsFor } from "../utils/totals";

const STORAGE_KEY = "nutrition-meter:items";

const SEED_ITEMS = [
  { id: "seed-apple", name: "Apple", calories: 52, protein: 0.26, carbs: 14, fat: 1, quantity: 1 },
  { id: "seed-banana", name: "Banana", calories: 89, protein: 1.09, carbs: 23, fat: 5, quantity: 1 },
  { id: "seed-grapes", name: "Grapes", calories: 40, protein: 0.2, carbs: 20, fat: 2, quantity: 1 },
  { id: "seed-orange", name: "Orange", calories: 35, protein: 0.15, carbs: 25, fat: 4, quantity: 1 },
];

const loadItems = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    // No key at all means a first visit, which gets the sample foods. An
    // empty array means the list was deliberately cleared, and reseeding it
    // would undo that.
    if (stored === null) return SEED_ITEMS.map(normalizeFoodItem).filter(Boolean);

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.map(normalizeFoodItem).filter(Boolean);
  } catch {
    return [];
  }
};

const NutritionMeter = ({ mode, onToggleTheme }) => {
  const [items, setItems] = useState(loadItems);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private mode, quota) — the app still works in
      // memory for this session.
    }
  }, [items]);

  const addItem = (item) => setItems((current) => [...current, item]);

  const updateItem = (id, changes) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );

  const removeItem = (id) =>
    setItems((current) => current.filter((item) => item.id !== id));

  const changeQuantity = (id, delta) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );

  const clearAll = () => setItems([]);

  const totals = useMemo(() => totalsFor(items), [items]);
  const split = useMemo(() => macroEnergySplit(totals), [totals]);

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

      <div className="min-[900px]:grid min-[900px]:grid-cols-[340px_1fr] min-[900px]:items-start min-[900px]:gap-8">
        {/* Sticky so the day's totals stay visible while a long list scrolls —
            which is rather the point of a tracker. */}
        <div className="mb-8 min-[900px]:sticky min-[900px]:top-4 min-[900px]:mb-0">
          <Summary totals={totals} split={split} itemCount={items.length} />

          {isAdding ? (
            <AddFoodForm onAdd={addItem} onClose={() => setIsAdding(false)} />
          ) : (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className={`mt-4 w-full ${primaryButtonClass}`}
            >
              Add food
            </button>
          )}
        </div>

        <FoodList
          items={items}
          onUpdate={updateItem}
          onRemove={removeItem}
          onQuantityChange={changeQuantity}
          onClearAll={clearAll}
        />
      </div>
    </div>
  );
};

export default NutritionMeter;
