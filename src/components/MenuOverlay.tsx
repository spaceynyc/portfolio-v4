import FocusTrap from "focus-trap-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from "react";
import { MotionDurations, MotionEasings } from "../styles/motion";

const panelVariants = {
  closed: {
    clipPath: "inset(var(--mask-top, 50%) var(--mask-right, 50%) var(--mask-bottom, 50%) var(--mask-left, 50%) round var(--mask-radius, 24px))",
    transition: { duration: MotionDurations.transitionOut, ease: MotionEasings.tIn },
  },
  open: {
    clipPath: "inset(0% 0% 0% 0% round 0px)",
    transition: { duration: MotionDurations.transitionOut, ease: MotionEasings.tOut },
  },
};

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MotionDurations.duration320, ease: MotionEasings.calm },
  },
};

type NavTarget = "work" | "resume" | "about" | "contact";

type MenuOverlayProps = {
  open: boolean;
  maskStyle: CSSProperties;
  onClose: () => void;
  onNavigate: (target: NavTarget) => void;
};

const NAV_ITEMS: Array<{ id: NavTarget; label: string; description: string }> = [
  { id: "work", label: "Work", description: "Selected case studies" },
  { id: "resume", label: "Résumé", description: "Experience & skills" },
  { id: "about", label: "About", description: "Studio background" },
  { id: "contact", label: "Contact", description: "Start a collaboration" },
];

export function MenuOverlay({ open, maskStyle, onClose, onNavigate }: MenuOverlayProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleArrowNavigation = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      return;
    }

    const focusable = itemRefs.current.filter((ref): ref is HTMLButtonElement => Boolean(ref));
    if (focusable.length === 0) {
      return;
    }

    event.preventDefault();

    const currentIndex = focusable.findIndex((element) => element === document.activeElement);
    const direction = event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + direction + focusable.length) % focusable.length;

    focusable[nextIndex].focus();
  }, []);

  const trapInitialFocus = useCallback(() => {
    const firstButton = itemRefs.current.find((ref): ref is HTMLButtonElement => Boolean(ref));
    return firstButton ?? closeButtonRef.current ?? document.body;
  }, []);

  const trapFallbackFocus = useCallback(() => closeButtonRef.current ?? document.body, []);

  const backgroundStyle = useMemo(
    () => ({
      background: "radial-gradient(140% 100% at 50% 40%, rgba(255,255,255,0.22), rgba(255,255,255,0.06) 45%, rgba(182,156,255,0.08) 80%)",
    }),
    []
  );

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <FocusTrap
          active
          focusTrapOptions={{
            fallbackFocus: trapFallbackFocus,
            initialFocus: trapInitialFocus,
            escapeDeactivates: false,
          }}
        >
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 flex items-stretch justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: MotionDurations.duration160 } }}
          >
            <motion.div
              id="main-menu-overlay"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              style={{ ...maskStyle, ...backgroundStyle }}
              className="relative flex h-full w-full items-center justify-center bg-lavend text-ink"
              variants={panelVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.button
                ref={closeButtonRef}
                type="button"
                data-cursor="hover"
                onClick={onClose}
                className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-xs font-medium uppercase tracking-[0.24em] text-ink transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-lavend"
                whileHover={{ backgroundColor: "rgba(11, 11, 11, 0.08)" }}
                whileTap={{ scale: 0.94 }}
              >
                Close
              </motion.button>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex w-full max-w-3xl flex-col items-center gap-10 px-6 py-16 text-center sm:px-10"
                onKeyDown={handleArrowNavigation}
              >
                <p className="text-xs uppercase tracking-[0.32em] text-ink/60">Navigate</p>
                <nav aria-label="Primary overlay">
                  <ul className="flex flex-col items-center gap-8">
                    {NAV_ITEMS.map((item, index) => (
                      <li key={item.id} className="flex flex-col items-center gap-2">
                        <motion.button
                          ref={(element) => {
                            itemRefs.current[index] = element;
                          }}
                          type="button"
                          data-cursor="hover"
                          className="font-display text-5xl font-semibold tracking-tight text-ink transition-colors duration-150 hover:text-lavend-deep focus-visible:text-lavend-deep sm:text-6xl"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            onNavigate(item.id);
                            onClose();
                          }}
                        >
                          {item.label}
                        </motion.button>
                        <span className="text-sm uppercase tracking-[0.28em] text-ink/60">
                          {item.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </nav>
                <p className="max-w-xl text-sm leading-relaxed text-ink/70">
                  Motion-first human interfaces for founders and teams shipping products that deserve a calmer sense of speed.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </FocusTrap>
      ) : null}
    </AnimatePresence>
  );
}
