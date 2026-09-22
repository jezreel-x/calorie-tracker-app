export const CALORIE_LIMIT = 1000;

// Atwater factors — the energy each macro carries per gram. The breakdown bar
// splits the plate by energy rather than by raw grams, because a gram of fat
// carries more than twice the energy of a gram of carbs and a grams-based bar
// would understate it.
export const CALORIES_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9,
};

// The only chromatic identity in the app. `dot` is for the chip that rides
// beside a figure; `fill` is for the mark itself. The figure stays in ink.
export const MACROS = [
  { key: "protein", label: "Protein", dot: "bg-protein", fill: "var(--app-protein)" },
  { key: "carbs", label: "Carbs", dot: "bg-carbs", fill: "var(--app-carbs)" },
  { key: "fat", label: "Fat", dot: "bg-fat", fill: "var(--app-fat)" },
];

export const EMPTY_DRAFT = {
  name: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
};
