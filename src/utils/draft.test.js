import { describe, expect, it } from "vitest";
import { draftErrors, draftToItem, itemToDraft } from "./draft";

describe("draftErrors", () => {
  it("accepts an entry whose macros were left blank", () => {
    expect(
      draftErrors({ name: "Egg", calories: "", protein: "", carbs: "", fat: "" })
    ).toEqual({});
  });

  it("requires a name that is more than whitespace", () => {
    expect(draftErrors({ name: "   " }).name).toBe(true);
  });

  it("rejects a negative macro", () => {
    expect(draftErrors({ name: "Egg", protein: "-1" }).protein).toBe(true);
  });

  it("accepts zero, which is a real measurement", () => {
    expect(draftErrors({ name: "Water", calories: "0", fat: "0" })).toEqual({});
  });

  it("rejects text typed into a numeric field", () => {
    expect(draftErrors({ name: "Egg", carbs: "lots" }).carbs).toBe(true);
  });
});

describe("draftToItem", () => {
  it("trims the name and coerces blanks to zero", () => {
    const item = draftToItem({ name: "  Rice  ", calories: "130", protein: "" });

    expect(item.name).toBe("Rice");
    expect(item.calories).toBe(130);
    expect(item.protein).toBe(0);
  });

  it("preserves an id of 0 rather than generating a new one", () => {
    // The old editor branched on truthiness, so an id of 0 was unreachable.
    expect(draftToItem({ name: "Zero" }, 0, 4).id).toBe(0);
  });

  it("carries the quantity through unchanged", () => {
    expect(draftToItem({ name: "Egg" }, "abc", 7).quantity).toBe(7);
  });
});

describe("itemToDraft", () => {
  it("round-trips an item through the editor", () => {
    const item = draftToItem({ name: "Oats", calories: "150", carbs: "27" }, "id-1", 2);
    const reSaved = draftToItem(itemToDraft(item), item.id, item.quantity);

    expect(reSaved).toEqual(item);
  });
});
