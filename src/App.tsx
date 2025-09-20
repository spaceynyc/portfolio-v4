import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";
import { NavBar } from "./components/NavBar";
import { MenuOverlay } from "./components/MenuOverlay";
import { ContactDrawer } from "./components/ContactDrawer";
import { CustomCursor } from "./components/CustomCursor";
import { Starfield } from "./components/Starfield";
import { useMaskReveal } from "./hooks/useMaskReveal";

export type LayoutContext = {
  openContact: () => void;
  closeContact: () => void;
  setActiveSection: (id: string | null) => void;
  activeSection: string | null;
};

type NavTarget = "work" | "resume" | "about" | "contact";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(location.pathname === "/contact");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const lastRouteRef = useRef(location.pathname === "/contact" ? "/" : location.pathname || "/");
  const { style: maskStyle, update: updateMask } = useMaskReveal();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (location.pathname === "/contact") {
      setContactOpen(true);
    } else {
      setContactOpen(false);
      lastRouteRef.current = location.pathname || "/";
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (menuOpen || contactOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen, contactOpen]);

  useEffect(() => {
    if (!menuOpen || prefersReducedMotion) {
      return;
    }
    const handleMove = (event: PointerEvent) => {
      updateMask({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [menuOpen, prefersReducedMotion, updateMask]);

  const openContact = useCallback(() => {
    if (location.pathname !== "/contact") {
      lastRouteRef.current = location.pathname || "/";
      setContactOpen(true);
      navigate("/contact");
    } else {
      setContactOpen(true);
    }
  }, [location.pathname, navigate]);

  const closeContact = useCallback(() => {
    setContactOpen(false);
    if (location.pathname === "/contact") {
      navigate(lastRouteRef.current || "/", { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleMenuToggle = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      updateMask({ x: event.clientX, y: event.clientY });
      setMenuOpen((prev) => !prev);
    },
    [updateMask]
  );

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  const handleNavigate = useCallback(
    (target: NavTarget) => {
      switch (target) {
        case "work":
          navigate("/work");
          break;
        case "resume":
          navigate("/resume");
          break;
        case "about":
          navigate("/about");
          break;
        case "contact":
          openContact();
          break;
      }
    },
    [navigate, openContact]
  );

  const layoutContext = useMemo<LayoutContext>(
    () => ({ openContact, closeContact, setActiveSection, activeSection }),
    [openContact, closeContact, setActiveSection, activeSection]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink text-foam">
      <Starfield />
      <CustomCursor />
      <div className="relative z-10">
        <NavBar
          menuOpen={menuOpen}
          onToggleMenu={handleMenuToggle}
          onStartProject={openContact}
          onNavigate={handleNavigate}
          activeSection={activeSection}
          pathname={location.pathname}
        />
        <div data-nav-sentinel aria-hidden="true" className="h-1 w-full" />
        <main className="mx-auto flex w-full max-w-6xl flex-col px-6 pt-28 sm:px-10 sm:pt-32">
          <Outlet context={layoutContext} />
        </main>
        <footer className="mx-auto mt-24 w-full max-w-6xl px-6 pb-12 sm:px-10">
          <div className="flex flex-col gap-4 rounded-[28px] border border-hairline/70 bg-ink/60 px-6 py-6 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-haze">&copy; {new Date().getFullYear()} AetherLab. All composites original.</p>
            <div className="flex flex-wrap items-center gap-4 text-sm uppercase tracking-[0.24em] text-haze">
              <Link to="/about" className="transition-colors duration-150 hover:text-lavend" data-cursor="hover">
                About
              </Link>
              <button
                type="button"
                className="text-left transition-colors duration-150 hover:text-lavend"
                data-cursor="hover"
                onClick={openContact}
              >
                Contact
              </button>
            </div>
          </div>
        </footer>
      </div>
      <MenuOverlay open={menuOpen} maskStyle={maskStyle} onClose={closeMenu} onNavigate={handleNavigate} />
      <ContactDrawer open={contactOpen} onClose={closeContact} />
    </div>
  );
}
