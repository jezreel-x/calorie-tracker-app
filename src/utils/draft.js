import { MACROS } from "../constants/nutrition";
import makeId from "./makeId";
import { toNumber } from "./num";

const NUMERIC_KEYS = ["calories", ...MACROS.map((macro) => macro.key)];

// A blank macro is a legitimate "I don't know" and stores as 0; a negative one
// is not. Only the name is genuinely required — the old form rejected the whole
// entry unless every macro was filled in.
export const draftErrors = (draft) => {
  const errors = {};

  if (!String(draft.name).trim()) errors.name = true;

  NUMERIC_KEYS.forEach((key) => {
    const raw = String(draft[key] ?? "").trim();
    if (raw === "") return;

    const parsed = parseFloat(raw);
    if (!Number.isFinite(parsed) || parsed < 0) errors[key] = true;
  });

  return errors;
};

export const draftToItem = (draft, id = makeId(), quantity = 1) => ({
  id,
  name: String(draft.name).trim(),
  calories: toNumber(draft.calories),
  protein: toNumber(draft.protein),
  carbs: toNumber(draft.carbs),
  fat: toNumber(draft.fat),
  quantity,
});

export const itemToDraft = (item) => ({
  name: item.name,
  calories: String(item.calories),
  protein: String(item.protein),
  carbs: String(item.carbs),
  fat: String(item.fat),
});
