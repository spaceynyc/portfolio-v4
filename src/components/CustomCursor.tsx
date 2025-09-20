import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type CursorVariant = "default" | "hover" | "drag" | "hidden" | "reduced";

const HOVERABLE_TAGS = new Set(["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT", "LABEL"]);

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(true);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = useMemo(() => ({ stiffness: 320, damping: 28, mass: 0.4 }), []);
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const updateEnabled = () => setEnabled(!coarsePointer.matches);
    updateEnabled();
    coarsePointer.addEventListener("change", updateEnabled);
    return () => coarsePointer.removeEventListener("change", updateEnabled);
  }, []);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    const resolveVariant = (target: EventTarget | null): CursorVariant => {
      if (prefersReducedMotion) return "reduced";
      const el = target instanceof Element ? target : null;
      if (!el) return "default";
      if (el.closest('[data-cursor="drag"]')) return "drag";
      if (el.closest('[data-cursor="hover"]')) return "hover";
      if (HOVERABLE_TAGS.has(el.tagName)) return "hover";
      return "default";
    };

    const handlePointerMove = (event: PointerEvent) => {
      setVisible(true);
      x.set(event.clientX);
      y.set(event.clientY);
    };

    const handlePointerOver = (event: PointerEvent) => {
      setVariant(resolveVariant(event.target));
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (prefersReducedMotion) return;
      const el = event.target instanceof Element ? event.target : null;
      if (el?.closest('[data-cursor="drag"]')) {
        setVariant("drag");
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      setVariant(resolveVariant(event.target));
    };

    const handleLeave = () => setVisible(false);

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointerleave", handleLeave);
    window.addEventListener("blur", handleLeave);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
    };
  }, [enabled, prefersReducedMotion, x, y]);

  if (!enabled) {
    return null;
  }

  const activeVariant: CursorVariant = visible
    ? prefersReducedMotion
      ? "reduced"
      : variant
    : "hidden";

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-50 hidden transform-gpu md:block -translate-x-1/2 -translate-y-1/2"
      style={{ x: xSpring, y: ySpring }}
      initial="hidden"
      animate={activeVariant}
      variants={{
        hidden: { opacity: 0 },
        reduced: {
          opacity: 1,
          width: 12,
          height: 12,
          borderRadius: "9999px",
          border: "1px solid rgba(245,245,247,0.35)",
          backgroundColor: "rgba(245,245,247,0.1)",
        },
        default: {
          opacity: 1,
          width: 12,
          height: 12,
          borderRadius: "9999px",
          border: "1px solid rgba(245,245,247,0.28)",
          backgroundColor: "rgba(245,245,247,0.12)",
        },
        hover: {
          opacity: 1,
          width: 28,
          height: 28,
          borderRadius: "9999px",
          border: "1px solid rgba(245,245,247,0.38)",
          backgroundColor: "rgba(245,245,247,0.08)",
        },
        drag: {
          opacity: 1,
          width: 36,
          height: 36,
          borderRadius: "12px",
          border: "1px solid rgba(245,245,247,0.3)",
          backgroundColor: "rgba(245,245,247,0.1)",
        },
      }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex h-full w-full items-center justify-center">
        {!prefersReducedMotion && activeVariant === "hover" ? (
          <span className="text-[0.55rem] text-foam/70">""</span>
        ) : null}
      </div>
    </motion.div>
  );
}
