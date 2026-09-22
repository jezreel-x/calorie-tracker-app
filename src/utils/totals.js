import { CALORIES_PER_GRAM, MACROS } from "../constants/nutrition";
import { toNumber } from "./num";

export const totalsFor = (items) =>
  items.reduce(
    (totals, item) => {
      const quantity = item.quantity;
      totals.calories += toNumber(item.calories) * quantity;
      MACROS.forEach(({ key }) => {
        totals[key] += toNumber(item[key]) * quantity;
      });
      return totals;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

// Where the day's energy actually comes from. Shares are computed against the
// energy the macros themselves account for, not the logged calorie figure —
// those two disagree whenever the macros are estimated, and dividing by the
// logged number would leave the bar failing to fill (or overflowing).
export const macroEnergySplit = (totals) => {
  const parts = MACROS.map((macro) => ({
    ...macro,
    grams: totals[macro.key],
    calories: totals[macro.key] * CALORIES_PER_GRAM[macro.key],
  }));

  const energy = parts.reduce((sum, part) => sum + part.calories, 0);

  return parts.map((part) => ({
    ...part,
    share: energy > 0 ? part.calories / energy : 0,
  }));
};
