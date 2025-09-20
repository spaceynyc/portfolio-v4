import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Point = { x: number; y: number };

type MaskOptions = {
  width?: number;
  height?: number;
  radius?: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function useMaskReveal(options: MaskOptions = {}) {
  const { width = 260, height = 180, radius = 48 } = options;
  const isClient = typeof window !== "undefined";

  const [viewport, setViewport] = useState(() => ({
    width: isClient ? window.innerWidth : 0,
    height: isClient ? window.innerHeight : 0,
  }));

  const [origin, setOrigin] = useState<Point>(() => ({
    x: viewport.width / 2,
    y: viewport.height / 2,
  }));

  useEffect(() => {
    if (!isClient) return;
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient]);

  useEffect(() => {
    setOrigin((prev) => ({
      x: clamp(prev.x, 0, viewport.width),
      y: clamp(prev.y, 0, viewport.height),
    }));
  }, [viewport.width, viewport.height]);

  const style = useMemo(() => {
    const halfW = width / 2;
    const halfH = height / 2;

    const left = clamp(origin.x - halfW, 0, viewport.width);
    const right = clamp(viewport.width - (origin.x + halfW), 0, viewport.width);
    const top = clamp(origin.y - halfH, 0, viewport.height);
    const bottom = clamp(viewport.height - (origin.y + halfH), 0, viewport.height);

    return {
      "--mask-top": `${top}px`,
      "--mask-right": `${right}px`,
      "--mask-bottom": `${bottom}px`,
      "--mask-left": `${left}px`,
      "--mask-radius": `${radius}px`,
    } as CSSProperties;
  }, [origin.x, origin.y, viewport.width, viewport.height, width, height, radius]);

  const updateFromPoint = useCallback(
    (point: Point) => {
      setOrigin({
        x: clamp(point.x, 0, viewport.width),
        y: clamp(point.y, 0, viewport.height),
      });
    },
    [viewport.width, viewport.height]
  );

  return {
    style,
    update: updateFromPoint,
  };
}
