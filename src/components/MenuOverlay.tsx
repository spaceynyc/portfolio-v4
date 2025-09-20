import FocusTrap from "focus-trap-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { NavLink } from "react-router-dom";
import { MotionDurations, MotionEasings } from "../styles/motion";

type NavTarget = "home" | "work" | "resume" | "about" | "contact";

type MenuOverlayProps = {
  open: boolean;
  maskStyle: CSSProperties;
  onClose: () => void;
  onNavigate: (target: NavTarget) => void;
};

const NAV_ITEMS: Array<{ id: NavTarget; label: string; href: string }> = [
  { id: "home", label: "home", href: "/" },
  { id: "work", label: "work", href: "/work" },
  { id: "resume", label: "résumé", href: "/resume" },
  { id: "about", label: "about", href: "/about" },
  { id: "contact", label: "contact", href: "/contact" },
];

export function MenuOverlay({ open, maskStyle, onClose, onNavigate }: MenuOverlayProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    } else if (previouslyFocusedRef.current) {
      previouslyFocusedRef.current.focus();
      previouslyFocusedRef.current = null;
    }
  }, [open]);

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

  const trapInitialFocus = useCallback(() => {
    const firstLink = itemRefs.current.find((ref): ref is HTMLAnchorElement => Boolean(ref));
    return firstLink ?? closeButtonRef.current ?? document.body;
  }, []);

  const trapFallbackFocus = useCallback(() => closeButtonRef.current ?? document.body, []);

  const handleLinkClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, target: NavTarget) => {
      event.preventDefault();
      onNavigate(target);
      onClose();
    },
    [onClose, onNavigate]
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
          <motion.nav
            key="overlay"
            id="main-menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            style={maskStyle}
            className="fixed inset-0 z-50 bg-lavender text-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: MotionDurations.duration160, ease: MotionEasings.calm } }}
            exit={{ opacity: 0, transition: { duration: MotionDurations.duration160, ease: MotionEasings.calm } }}
          >
            <div className="mx-auto flex h-full max-w-3xl flex-col justify-between px-6 py-8 sm:px-10">
              <div className="flex items-center justify-end">
                <motion.button
                  ref={closeButtonRef}
                  type="button"
                  data-cursor="hover"
                  onClick={onClose}
                  className="rounded-full border border-ink/20 px-3 py-1 text-xs tracking-[0.24em] text-ink transition-colors duration-150 hover:bg-lavender-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-lavender"
                  whileTap={{ scale: 0.94 }}
                >
                  Close
                </motion.button>
              </div>

              <motion.div
                className="flex flex-1 flex-col justify-center"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { duration: MotionDurations.duration240, ease: MotionEasings.calm } }}
                exit={{ opacity: 0, y: 6, transition: { duration: MotionDurations.duration160, ease: MotionEasings.calm } }}
              >
                <nav aria-label="Primary overlay navigation">
                  <ul className="flex flex-col gap-2 sm:gap-3">
                    {NAV_ITEMS.map((item, index) => (
                      <li key={item.id}>
                        <NavLink
                          ref={(element) => {
                            itemRefs.current[index] = element;
                          }}
                          to={item.href}
                          onClick={(event) => handleLinkClick(event, item.id)}
                          className="block rounded-2xl px-5 py-4 font-display font-extrabold lowercase leading-none text-ink text-4xl transition-colors duration-150 hover:bg-lavender-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/60 sm:py-5 sm:text-5xl md:py-6 md:text-6xl"
                          data-cursor="hover"
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              </motion.div>

              <div aria-hidden="true" />
            </div>
          </motion.nav>
        </FocusTrap>
      ) : null}
    </AnimatePresence>
  );
}
