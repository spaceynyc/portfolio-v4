import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCharCount } from "./useCharCount";

describe("useCharCount", () => {
  it("truncates values at the limit, reports remaining characters, and resets", () => {
    const limit = 5;
    const { result } = renderHook(() => useCharCount(limit));

    expect(result.current.value).toBe("");
    expect(result.current.count).toBe(0);
    expect(result.current.remaining).toBe(limit);

    act(() => result.current.setValue("characters"));

    expect(result.current.value).toBe("chara");
    expect(result.current.count).toBe(limit);
    expect(result.current.remaining).toBe(0);

    act(() => result.current.setValue("hey"));

    expect(result.current.value).toBe("hey");
    expect(result.current.count).toBe(3);
    expect(result.current.remaining).toBe(2);

    act(() => result.current.reset());

    expect(result.current.value).toBe("");
    expect(result.current.count).toBe(0);
    expect(result.current.remaining).toBe(limit);
  });
});
