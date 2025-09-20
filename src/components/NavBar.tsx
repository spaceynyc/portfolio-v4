import { LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { MotionDurations, MotionEasings } from "../styles/motion";

const NAV_LINKS = [
  { id: "work" as const, label: "Work" },
  { id: "resume" as const, label: "Résumé" },
  { id: "about" as const, label: "About" },
  { id: "contact" as const, label: "Contact" },
];

type NavTarget = "work" | "resume" | "about" | "contact";

type NavBarProps = {
  menuOpen: boolean;
  onToggleMenu: (event: MouseEvent<HTMLButtonElement>) => void;
  onStartProject: () => void;
  onNavigate: (target: NavTarget) => void;
  activeSection: string | null;
  pathname: string;
};

const HREF_MAP: Record<NavTarget, string> = {
  work: "/work",
  resume: "/resume",
  about: "/about",
  contact: "/contact",
};

export function NavBar({
  menuOpen,
  onToggleMenu,
  onStartProject,
  onNavigate,
  activeSection,
  pathname,
}: NavBarProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const sentinelVisible = useRef(true);
  const lastY = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  const currentActive = useMemo<NavTarget>(() => {
    if (pathname.startsWith("/resume")) return "resume";
    if (pathname.startsWith("/about")) return "about";
    if (pathname.startsWith("/contact")) return "contact";
    if (pathname.startsWith("/work")) return "work";
    return (activeSection as NavTarget | null) ?? "work";
  }, [activeSection, pathname]);

  const highlightId = hovered ?? currentActive;

  useEffect(() => {
    const sentinel = document.querySelector<HTMLDivElement>("[data-nav-sentinel]");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        sentinelVisible.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setHidden(false);
        }
      },
      { rootMargin: "-8px 0px 0px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY.current;
      const scrollingDown = delta > 8;
      const scrollingUp = delta < -6;

      if (scrollingDown && !sentinelVisible.current && currentY > 120) {
        setHidden(true);
      } else if (scrollingUp || currentY < 80) {
        setHidden(false);
      }

      lastY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      setHidden(false);
    }
  }, [menuOpen]);

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, target: NavTarget) => {
    event.preventDefault();
    onNavigate(target);
  };

  const renderLink = (linkId: NavTarget, label: string) => {
    const isActive = highlightId === linkId;

    return (
      <motion.li key={linkId} className="relative">
        {isActive ? (
          <motion.span
            layoutId="nav-pill"
            className="absolute inset-0 rounded-full bg-foam/10"
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          />
        ) : null}
        <a
          href={HREF_MAP[linkId]}
          data-cursor="hover"
          className="relative z-10 inline-flex items-center justify-center px-4 py-2 text-sm font-medium uppercase tracking-[0.28em] text-foam transition-colors duration-150 hover:text-lavend focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavend/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          onMouseEnter={() => setHovered(linkId)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered(linkId)}
          onBlur={() => setHovered(null)}
          onClick={(event) => handleLinkClick(event, linkId)}
        >
          {label}
        </a>
      </motion.li>
    );
  };

  return (
    <motion.div
      className="pointer-events-none fixed left-0 right-0 top-0 z-40 flex justify-center"
      initial={false}
      animate={{ y: hidden ? "-110%" : 0 }}
      transition={{ duration: MotionDurations.transitionOut, ease: MotionEasings.tOut }}
    >
      <nav
        aria-label="Primary"
        className="pointer-events-auto glass mt-4 flex w-[min(96%,1100px)] items-center justify-between gap-4 rounded-full border border-hairline/30 px-5 py-3 shadow-[0_12px_40px_-30px_rgba(198,183,255,0.45)]"
      >
        <div className="flex items-center gap-3">
          <span className="font-display text-base font-semibold tracking-[0.14em] text-foam sm:text-lg">
            AetherLab
          </span>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="button"
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-hairline/30 text-foam transition-colors duration-150 hover:border-lavend hover:text-lavend focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavend/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            aria-label="Open navigation menu"
            data-cursor="hover"
            onClick={(event) => onToggleMenu(event)}
          >
            <span className="flex h-4 w-4 flex-col justify-between">
              <span className="block h-[2px] w-full bg-current" />
              <span className="block h-[2px] w-full bg-current" />
              <span className="block h-[2px] w-full bg-current" />
            </span>
          </button>
          <LayoutGroup id="primary-nav">
            <motion.ul className="hidden items-center gap-2 lg:flex">
              {NAV_LINKS.map((link) => renderLink(link.id, link.label))}
            </motion.ul>
          </LayoutGroup>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-cursor="hover"
            onClick={onStartProject}
            className="inline-flex whitespace-nowrap rounded-full bg-lavend px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ink transition-transform transition-colors duration-150 hover:bg-lavend-deep hover:text-foam focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavend focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Hire Me
          </button>
          <motion.button
            type="button"
            data-cursor="hover"
            onClick={onToggleMenu}
            aria-expanded={menuOpen}
            aria-controls="main-menu-overlay"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-foam transition-colors duration-150 hover:border-lavend hover:text-lavend focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavend/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            whileTap={{ scale: 0.94 }}
          >
            Menu
          </motion.button>
        </div>
      </nav>
    </motion.div>
  );
}
