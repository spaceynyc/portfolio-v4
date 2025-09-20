import { useCallback, useMemo, useState } from "react";

export function useCharCount(limit: number) {
  const [value, setValue] = useState("");

  const handleChange = useCallback((next: string) => {
    setValue(next.slice(0, limit));
  }, [limit]);

  const count = value.length;

  return useMemo(
    () => ({
      value,
      setValue: handleChange,
      count,
      remaining: Math.max(limit - count, 0),
      limit,
      reset: () => setValue(""),
    }),
    [value, handleChange, count, limit]
  );
}
