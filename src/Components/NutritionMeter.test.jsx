import { render, screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NutritionMeter from "./NutritionMeter";

const STORAGE_KEY = "nutrition-meter:items";

const renderMeter = () =>
  render(<NutritionMeter mode="light" onToggleTheme={vi.fn()} />);

beforeEach(() => {
  window.localStorage.clear();
});

describe("first visit", () => {
  it("seeds the sample foods when no entries have ever been stored", () => {
    renderMeter();

    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Orange")).toBeInTheDocument();
  });
});

describe("persistence", () => {
  it("restores what was stored", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: "a", name: "Porridge", calories: 160, protein: 5, carbs: 27, fat: 3, quantity: 1 },
      ])
    );

    renderMeter();

    expect(screen.getByText("Porridge")).toBeInTheDocument();
    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
  });

  it("leaves a deliberately cleared list empty instead of reseeding it", async () => {
    const user = userEvent.setup();
    const { unmount } = renderMeter();

    await user.click(screen.getByRole("button", { name: /clear all/i }));

    // The rows stay mounted until their exit animation finishes collapsing
    // them, so this waits rather than asserting straight away.
    await waitForElementToBeRemoved(() => screen.queryByText("Apple"));

    // An empty array is a decision; only a missing key means "first visit".
    unmount();
    renderMeter();

    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
    expect(screen.getByText(/nothing logged yet/i)).toBeInTheDocument();
  });

  it("survives corrupt stored data rather than failing to render", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not json");

    expect(() => renderMeter()).not.toThrow();
    expect(screen.getByText(/nothing logged yet/i)).toBeInTheDocument();
  });
});

describe("adding food", () => {
  it("accepts an entry whose macros were left blank", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(STORAGE_KEY, "[]");
    renderMeter();

    await user.click(screen.getByRole("button", { name: /add food/i }));
    await user.type(screen.getByLabelText(/item name/i), "Black coffee");
    await user.type(screen.getByLabelText(/^calories$/i), "2");
    await user.click(screen.getByRole("button", { name: /add item/i }));

    expect(screen.getByText("Black coffee")).toBeInTheDocument();
  });

  it("refuses an entry with no name", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(STORAGE_KEY, "[]");
    renderMeter();

    await user.click(screen.getByRole("button", { name: /add food/i }));
    await user.type(screen.getByLabelText(/^calories$/i), "200");

    expect(screen.getByRole("button", { name: /add item/i })).toBeDisabled();
  });
});

describe("quantity", () => {
  it("scales the figures on the row", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: "a", name: "Toast", calories: 80, protein: 3, carbs: 14, fat: 1, quantity: 1 },
      ])
    );
    renderMeter();

    const row = screen.getByText("Toast").closest("article");
    expect(within(row).getByText("80")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /increase quantity of toast/i }));

    expect(within(row).getByText("160")).toBeInTheDocument();
  });

  it("cannot be taken below one", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: "a", name: "Toast", calories: 80, quantity: 1 }])
    );
    renderMeter();

    expect(
      screen.getByRole("button", { name: /decrease quantity of toast/i })
    ).toBeDisabled();
  });
});

describe("editing", () => {
  it("discards the draft when the edit is cancelled", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: "a", name: "Toast", calories: 80, quantity: 1 }])
    );
    renderMeter();

    await user.click(screen.getByRole("button", { name: /edit toast/i }));

    const nameField = screen.getByLabelText(/item name/i);
    await user.clear(nameField);
    await user.type(nameField, "Brioche");
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByText("Toast")).toBeInTheDocument();
    expect(screen.queryByText("Brioche")).not.toBeInTheDocument();
  });

  it("saves an edit back to the row", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: "a", name: "Toast", calories: 80, quantity: 1 }])
    );
    renderMeter();

    await user.click(screen.getByRole("button", { name: /edit toast/i }));

    const nameField = screen.getByLabelText(/item name/i);
    await user.clear(nameField);
    await user.type(nameField, "Brioche");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(screen.getByText("Brioche")).toBeInTheDocument();
  });
});
