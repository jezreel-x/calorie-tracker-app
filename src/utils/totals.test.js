import { describe, expect, it } from "vitest";
import { macroEnergySplit, totalsFor } from "./totals";
import { round } from "./num";

describe("totalsFor", () => {
  it("never produces NaN from blank macro fields", () => {
    const totals = totalsFor([
      { calories: "", protein: "", carbs: "", fat: "", quantity: 2 },
    ]);

    Object.values(totals).forEach((value) => {
      expect(Number.isFinite(value)).toBe(true);
    });
  });

  it("multiplies every figure by the quantity", () => {
    const totals = totalsFor([
      { calories: 50, protein: 2, carbs: 10, fat: 1, quantity: 3 },
    ]);

    expect(totals).toEqual({ calories: 150, protein: 6, carbs: 30, fat: 3 });
  });

  it("is zero for an empty day", () => {
    expect(totalsFor([])).toEqual({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  });
});

describe("macroEnergySplit", () => {
  it("weighs by energy rather than grams", () => {
    // Equal grams of protein and fat are NOT an equal split: 10g protein is
    // 40 cal against 10g fat at 90 cal.
    const split = macroEnergySplit({ protein: 10, carbs: 0, fat: 10 });
    const byKey = Object.fromEntries(split.map((part) => [part.key, part]));

    expect(round(byKey.protein.share)).toBe(0.31);
    expect(round(byKey.fat.share)).toBe(0.69);
  });

  it("returns zero shares rather than NaN when nothing is logged", () => {
    macroEnergySplit({ protein: 0, carbs: 0, fat: 0 }).forEach((part) => {
      expect(part.share).toBe(0);
    });
  });

  it("always sums to 1 once anything is logged", () => {
    const sum = macroEnergySplit({ protein: 3, carbs: 27, fat: 11 }).reduce(
      (total, part) => total + part.share,
      0
    );

    expect(sum).toBeCloseTo(1, 10);
  });

  it("divides by the macros' own energy, not the logged calorie figure", () => {
    // The logged calories disagree with the macros here, as they do whenever
    // macros are estimated. The bar must still fill exactly once.
    const split = macroEnergySplit({ calories: 10, protein: 20, carbs: 20, fat: 20 });
    const sum = split.reduce((total, part) => total + part.share, 0);

    expect(sum).toBeCloseTo(1, 10);
  });

  it("keeps the macro order stable so the legend matches the bar", () => {
    expect(macroEnergySplit({ protein: 1, carbs: 1, fat: 1 }).map((p) => p.key)).toEqual([
      "protein",
      "carbs",
      "fat",
    ]);
  });
});
