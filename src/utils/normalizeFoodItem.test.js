import { describe, expect, it } from "vitest";
import normalizeFoodItem from "./normalizeFoodItem";

describe("normalizeFoodItem", () => {
  it("drops entries that no longer read as food", () => {
    expect(normalizeFoodItem(null)).toBeNull();
    expect(normalizeFoodItem("Apple")).toBeNull();
    expect(normalizeFoodItem({ name: "   " })).toBeNull();
  });

  it("repairs a corrupt stored entry rather than rendering it blank", () => {
    const item = normalizeFoodItem({ name: " Rice ", calories: "x", quantity: 0 });

    expect(item.name).toBe("Rice");
    expect(item.calories).toBe(0);
    expect(item.quantity).toBe(1);
  });

  it("backfills an id for entries saved before ids existed", () => {
    expect(normalizeFoodItem({ name: "Rice" }).id).toBeTruthy();
  });

  it("keeps an id of 0 instead of replacing it", () => {
    expect(normalizeFoodItem({ name: "Rice", id: 0 }).id).toBe(0);
  });

  it("never returns a fractional quantity", () => {
    expect(normalizeFoodItem({ name: "Rice", quantity: 2.6 }).quantity).toBe(3);
    expect(normalizeFoodItem({ name: "Rice", quantity: -5 }).quantity).toBe(1);
  });
});
