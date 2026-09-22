import { describe, expect, it } from "vitest";
import { caloriesFromMacros, energyMismatch } from "./energy";
import { SEED_ITEMS } from "../Components/NutritionMeter";

describe("caloriesFromMacros", () => {
  it("weighs fat at 9 cal a gram and the rest at 4", () => {
    expect(caloriesFromMacros({ protein: 10, carbs: 10, fat: 10 })).toBe(170);
  });

  it("treats blank macros as zero", () => {
    expect(caloriesFromMacros({ protein: "", carbs: "", fat: "" })).toBe(0);
  });
});

describe("energyMismatch", () => {
  it("catches the kind of entry the old sample data contained", () => {
    // 25g of carbs is 100 cal on its own, so 35 cal cannot be right.
    const mismatch = energyMismatch({ calories: 35, protein: 0.15, carbs: 25, fat: 4 });

    expect(mismatch).not.toBeNull();
    expect(mismatch.logged).toBe(35);
    expect(Math.round(mismatch.derived)).toBe(137);
  });

  it("stays quiet about the fibre gap on a real entry", () => {
    // A banana's macros imply ~117 cal against a labelled 105; that gap is
    // fibre, not a mistake.
    expect(energyMismatch({ calories: 105, protein: 1.3, carbs: 27, fat: 0.4 })).toBeNull();
  });

  it("says nothing when the calorie figure was deliberately left blank", () => {
    expect(energyMismatch({ calories: "", protein: 10, carbs: 10, fat: 10 })).toBeNull();
  });

  it("says nothing when there are no macros to check against", () => {
    expect(energyMismatch({ calories: 200, protein: "", carbs: "", fat: "" })).toBeNull();
  });

  it("flags a figure that is too high as well as too low", () => {
    expect(energyMismatch({ calories: 900, protein: 5, carbs: 5, fat: 5 })).not.toBeNull();
  });
});

describe("the sample day", () => {
  it("is nutritionally self-consistent, so it never trips its own warning", () => {
    SEED_ITEMS.forEach((item) => {
      expect(energyMismatch(item), `${item.name} does not reconcile`).toBeNull();
    });
  });
});
