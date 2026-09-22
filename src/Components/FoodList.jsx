import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import FoodItem from "./FoodItem";
import { secondaryButtonClass } from "./ui/fields";

const FoodList = ({ items, onUpdate, onRemove, onQuantityChange, onClearAll }) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, search]);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-ink">
          Logged
          {items.length > 0 && (
            <span className="ml-2 text-sm font-normal text-ink-muted">
              {items.length}
            </span>
          )}
        </h2>
        {items.length > 0 && (
          <button type="button" onClick={onClearAll} className={secondaryButtonClass}>
            Clear all
          </button>
        )}
      </div>

      {/* Search only earns its space once there is enough to search through. */}
      {items.length > 3 && (
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search food"
          aria-label="Search logged food"
          className="mb-4 w-full rounded-lg border border-line bg-surface-muted px-3 py-2 text-ink transition-colors placeholder:text-ink-subtle focus:border-accent focus:bg-surface focus:outline-none focus:ring-3 focus:ring-[var(--app-focus)]"
        />
      )}

      {/* AnimatePresence stays mounted even when the list empties: unmounting
          it with the last row would skip that row's exit animation and make it
          snap away instead of collapsing. */}
      <AnimatePresence initial={false}>
        {filtered.map((item) => (
          <FoodItem
            key={item.id}
            item={item}
            onUpdate={onUpdate}
            onRemove={onRemove}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </AnimatePresence>

      {filtered.length === 0 && (
        <p className="rounded-xl border border-dashed border-line bg-surface-muted px-6 py-10 text-center text-sm text-ink-muted">
          {search.trim()
            ? `Nothing logged matches “${search.trim()}”.`
            : "Nothing logged yet. Add a food to get started."}
        </p>
      )}
    </section>
  );
};

export default FoodList;
