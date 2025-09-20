import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useMemo } from "react";
import type { MouseEvent } from "react";
import type { MotionValue } from "framer-motion";

const CALM_EASE = [0.32, 0.16, 0.16, 1] as const;
const PARALLAX_LIMIT = 10;
const SPRING_CONFIG = { stiffness: 180, damping: 26, mass: 0.8 };

const CAPABILITIES = [
  "Motion Systems",
  "Prototyping",
  "Interface Languages",
  "Strategy",
  "Labs",
  "Emergent Research",
] as const;

const TILE_DEPTHS = [12, -9, 7, -6, 5, -4];

const capabilityTileVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.52,
      ease: CALM_EASE,
      delay: index * 0.06,
    },
  }),
};

type CapabilityTileProps = {
  label: string;
  index: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  prefersReducedMotion: boolean;
};

function CapabilityTile({ label, index, pointerX, pointerY, prefersReducedMotion }: CapabilityTileProps) {
  const depth = TILE_DEPTHS[index % TILE_DEPTHS.length] ?? 6;
  const x = useTransform(pointerX, (value) => value * depth);
  const y = useTransform(pointerY, (value) => value * depth);

  return (
    <motion.li
      className="group relative overflow-hidden rounded-2xl border border-white/14 bg-white/[0.04] p-5 text-sm text-haze shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_18px_40px_-24px_rgba(61,65,128,0.55)] backdrop-blur"
      variants={capabilityTileVariants}
      custom={index}
      style={prefersReducedMotion ? undefined : { x, y }}
    >
      <span className="font-display text-base text-foam">{label}</span>
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-white/6 via-transparent to-white/3 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
    </motion.li>
  );
}

export function PortfolioHero() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, SPRING_CONFIG);
  const pointerY = useSpring(rawY, SPRING_CONFIG);

  const identityVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 28 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: prefersReducedMotion ? 0.32 : 0.54,
          ease: CALM_EASE,
          when: "beforeChildren",
          staggerChildren: prefersReducedMotion ? 0 : 0.08,
        },
      },
    }),
    [prefersReducedMotion],
  );

  const identityItemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: prefersReducedMotion ? 0.28 : 0.48,
          ease: CALM_EASE,
        },
      },
    }),
    [prefersReducedMotion],
  );

  const boardVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 36 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: prefersReducedMotion ? 0.28 : 0.56,
          ease: CALM_EASE,
        },
      },
    }),
    [prefersReducedMotion],
  );

  const listVariants = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: prefersReducedMotion ? 0 : 0.08,
        },
      },
    }),
    [prefersReducedMotion],
  );

  const handlePointerMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
      rawX.set(Math.max(-1, Math.min(1, offsetX)) * PARALLAX_LIMIT);
      rawY.set(Math.max(-1, Math.min(1, offsetY)) * PARALLAX_LIMIT);
    },
    [prefersReducedMotion, rawX, rawY],
  );

  const resetPointer = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <section id="work" className="relative mx-auto w-full max-w-6xl isolate overflow-hidden rounded-[36px] border border-hairline/50 bg-ink/70 px-6 py-24 shadow-[0_60px_120px_-80px_rgba(22,16,64,0.8)] backdrop-blur-xl sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(198,183,255,0.35),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(126,150,255,0.18),transparent_65%)]" />
      <motion.div
        className="relative z-10 grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center"
        variants={identityVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
      >
        <motion.div className="flex max-w-xl flex-col gap-6" variants={identityItemVariants}>
          <motion.span className="text-xs uppercase tracking-[0.32em] text-haze" variants={identityItemVariants}>
            Portfolio Signal
          </motion.span>
          <motion.h1 className="font-display text-[48px] leading-[1.05] text-foam sm:text-[56px]" variants={identityItemVariants}>
            Rowan Sato
          </motion.h1>
          <motion.p className="text-lg text-haze" variants={identityItemVariants}>
            Kinetic interface designer prototyping motion-first systems for emerging products and calm tools.
          </motion.p>
          <motion.p className="text-sm text-neutral-300" variants={identityItemVariants}>
            Currently embedded with early-stage teams crafting spatial feedback loops and advanced prototyping labs.
          </motion.p>
          <motion.div className="flex flex-wrap items-center gap-3 text-sm text-haze" variants={identityItemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-foam">
              <span className="h-2 w-2 rounded-full bg-lavend" />
              Portland, OR
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-lavend/40 bg-lavend/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-lavend">
              Open for Q3 collaborations
            </span>
          </motion.div>
          <motion.div className="mt-4 flex flex-wrap gap-4" variants={identityItemVariants}>
            <a
              href="#work"
              aria-label="View selected work"
              className="inline-flex items-center justify-center rounded-full bg-lavend px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-ink transition-colors duration-200 hover:bg-lavend-deep hover:text-foam focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavend focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              View Work
            </a>
            <a
              href="/resume"
              aria-label="Download Rowan Sato resume"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-foam transition-colors duration-200 hover:border-lavend hover:text-lavend focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavend/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Download Resume
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative rounded-[32px] border border-white/12 bg-white/[0.06] p-8 shadow-[0_24px_80px_-40px_rgba(124,144,255,0.65)] backdrop-blur-2xl"
          variants={boardVariants}
          onMouseMove={handlePointerMove}
          onMouseLeave={resetPointer}
          onMouseEnter={prefersReducedMotion ? undefined : handlePointerMove}
        >
          <div className="pointer-events-none absolute inset-px rounded-[30px] border border-white/6" />
          <motion.h2 className="text-sm uppercase tracking-[0.32em] text-haze" variants={identityItemVariants}>
            Capabilities Board
          </motion.h2>
          <motion.ul
            className="mt-6 grid gap-4 sm:grid-cols-2"
            variants={listVariants}
            initial="hidden"
            animate="show"
          >
            {CAPABILITIES.map((label, index) => (
              <CapabilityTile
                key={label}
                label={label}
                index={index}
                prefersReducedMotion={prefersReducedMotion}
                pointerX={pointerX}
                pointerY={pointerY}
              />
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>
    </section>
  );
}





