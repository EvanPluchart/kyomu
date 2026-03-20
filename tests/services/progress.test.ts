import { describe, it, expect } from "vitest";
import { getProgress, saveProgress, markAs } from "@/lib/services/progress";

describe("progress service", () => {
  it("exporte getProgress", () => {
    expect(getProgress).toBeDefined();
  });

  it("exporte saveProgress", () => {
    expect(saveProgress).toBeDefined();
  });

  it("exporte markAs", () => {
    expect(markAs).toBeDefined();
  });
});
