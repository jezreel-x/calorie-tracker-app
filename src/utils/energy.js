import { CALORIES_PER_GRAM, MACROS } from "../constants/nutrition";
import { toNumber } from "./num";

// How much energy the macros on an entry actually account for.
export const caloriesFromMacros = (item) =>
  MACROS.reduce(
    (sum, macro) => sum + toNumber(item[macro.key]) * CALORIES_PER_GRAM[macro.key],
    0
  );

// Fibre is not fully metabolised and rounding on a label is common, so a
// logged figure sitting somewhat under the macro arithmetic is normal — real
// entries land within about 10%. Only a gap wide enough to look like a slipped
// decimal or a wrong serving size is worth raising.
export const ENERGY_TOLERANCE = 0.25;

export const energyMismatch = (item) => {
  const logged = toNumber(item.calories);
  const derived = caloriesFromMacros(item);

  // A blank calorie figure is a deliberate "I don't know", not a typo, and
  // an entry with no macros has nothing to check against.
  if (logged <= 0 || derived <= 0) return null;

  if (Math.abs(logged - derived) / derived <= ENERGY_TOLERANCE) return null;

  return { logged, derived };
};
