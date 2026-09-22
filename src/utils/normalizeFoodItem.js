import makeId from "./makeId";
import { toNumber } from "./num";

// Fills in fields added after an entry was stored, and drops anything that no
// longer reads as a food item. Returning null rather than a blank item means a
// corrupted entry disappears instead of rendering as an empty row.
const normalizeFoodItem = (item) => {
  if (!item || typeof item !== "object") return null;

  const name = typeof item.name === "string" ? item.name.trim() : "";
  if (!name) return null;

  const quantity = Math.round(toNumber(item.quantity));

  return {
    id: item.id ?? makeId(),
    name,
    calories: toNumber(item.calories),
    protein: toNumber(item.protein),
    carbs: toNumber(item.carbs),
    fat: toNumber(item.fat),
    quantity: Math.max(1, quantity || 1),
  };
};

export default normalizeFoodItem;
