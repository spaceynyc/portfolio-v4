import {
  motion,
  type MotionValue,
  type Variants,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  type MouseEvent as ReactMouseEvent,
} from "react";

type Cta = {
  label: string;
  href: string;
  ariaLabel?: string;
  onClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
};

type Tile = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

export type HeroSectionProps = {
  kicker: string;
  title: string;
  blurb: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
  tiles: Tile[];
  id?: string;
};

const EASE = [0.4, 0, 0.2, 1] as const;
const TILE_DEPTH_PATTERN = [1, -0.7, 0.55, -0.4];
const MAX_OFFSET = 14;
const SPRING_CONFIG = { stiffness: 140, damping: 22, mass: 0.6 };

type HeroTileProps = {
  tile: Tile;
  depth: number;
  prefersReducedMotion: boolean;
  variants: Variants;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
  index: number;
  gridClass: string;
  offsetClass?: string;
};

function HeroTile({ tile, depth, prefersReducedMotion, variants, parallaxX, parallaxY, index, gridClass, offsetClass }: HeroTileProps) {
  const x = useTransform(parallaxX, (value) => value * depth);
  const y = useTransform(parallaxY, (value) => value * depth);
  const loading = "lazy";
  const fetchPriority = tile.priority ? "high" : undefined;
  const containerClasses = [
    "group relative h-full w-full overflow-hidden rounded-2xl ring-1 ring-white/8 bg-white/[0.03]",
    "shadow-[0_10px_40px_rgba(0,0,0,0.45),0_0_80px_rgba(182,156,255,0.22)]",
    gridClass,
    offsetClass,
    tile.className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.li
      className={containerClasses}
      variants={variants}
      custom={index}
      style={prefersReducedMotion ? undefined : { x, y }}
    >
      <img
        src={tile.src}
        alt={tile.alt}
        loading={loading}
        fetchPriority={fetchPriority}
        className="h-full w-full object-cover transition duration-500 ease-out will-change-transform group-hover:scale-[1.02]"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
    </motion.li>
  );
}

export default function HeroSection({
  kicker,
  title,
  blurb,
  primaryCta,
  secondaryCta,
  tiles,
  id,
}: HeroSectionProps) {
  const reducedMotionPreference = useReducedMotion();
  const prefersReducedMotion = reducedMotionPreference ?? false;

  const gridVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 28 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: prefersReducedMotion ? 0.18 : 0.32,
          ease: EASE,
          when: "beforeChildren",
          staggerChildren: prefersReducedMotion ? 0 : 0.08,
        },
      },
    }),
    [prefersReducedMotion],
  );

  const columnVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: prefersReducedMotion ? 0.2 : 0.3, ease: EASE },
      },
    }),
    [prefersReducedMotion],
  );

  const copyContainerVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: prefersReducedMotion ? 0.2 : 0.32,
          ease: EASE,
          staggerChildren: prefersReducedMotion ? 0 : 0.08,
        },
      },
    }),
    [prefersReducedMotion],
  );

  const copyItemVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: prefersReducedMotion ? 0.2 : 0.28, ease: EASE },
      },
    }),
    [prefersReducedMotion],
  );

  const tileContainerVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: prefersReducedMotion ? 0.24 : 0.36,
          ease: EASE,
          staggerChildren: prefersReducedMotion ? 0 : 0.08,
        },
      },
    }),
    [prefersReducedMotion],
  );

  const tileVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
      show: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          duration: prefersReducedMotion ? 0.22 : 0.38,
          ease: EASE,
          delay: prefersReducedMotion ? 0 : index * 0.05,
        },
      }),
    }),
    [prefersReducedMotion],
  );

  const rawParallaxX = useMotionValue(0);
  const rawParallaxY = useMotionValue(0);
  const parallaxX = useSpring(rawParallaxX, SPRING_CONFIG);
  const parallaxY = useSpring(rawParallaxY, SPRING_CONFIG);

  useEffect(() => {
    if (prefersReducedMotion) {
      rawParallaxX.stop();
      rawParallaxY.stop();
      rawParallaxX.set(0);
      rawParallaxY.set(0);
    }
  }, [prefersReducedMotion, rawParallaxX, rawParallaxY]);

  const handlePointerMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) {
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();
      const relativeX = (event.clientX - bounds.left) / bounds.width;
      const relativeY = (event.clientY - bounds.top) / bounds.height;
      const clampedX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, (relativeX - 0.5) * 2 * MAX_OFFSET));
      const clampedY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, (relativeY - 0.5) * 2 * MAX_OFFSET));

      rawParallaxX.set(Number.isFinite(clampedX) ? clampedX : 0);
      rawParallaxY.set(Number.isFinite(clampedY) ? clampedY : 0);
    },
    [prefersReducedMotion, rawParallaxX, rawParallaxY],
  );

  const resetPointer = useCallback(() => {
    rawParallaxX.set(0);
    rawParallaxY.set(0);
  }, [rawParallaxX, rawParallaxY]);

  const tileDepths = useMemo(
    () => tiles.map((_, index) => TILE_DEPTH_PATTERN[index % TILE_DEPTH_PATTERN.length]),
    [tiles],
  );

  const tileLayouts = useMemo(
    () => [
      { grid: "col-span-1 row-span-2", offset: "translate-y-6" },
      { grid: "col-span-2 row-span-1", offset: undefined },
      { grid: "col-span-1 row-span-1", offset: "-translate-y-4" },
      { grid: "col-span-1 row-span-2", offset: "translate-y-10" },
    ],
    [],
  );

  return (
    <section id={id} className="relative z-10 overflow-hidden py-24 sm:py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid gap-16 md:grid-cols-12 md:gap-12 lg:grid-cols-12 lg:items-center"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
        >
          <motion.div className="flex flex-col gap-6 md:col-span-6 lg:col-span-6 xl:col-span-7" variants={copyContainerVariants}>
            <motion.span
              className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-neutral-400"
              variants={copyItemVariants}
            >
              {kicker}
            </motion.span>
            <motion.h1
              className="mt-3 max-w-[16ch] font-display text-[40px] font-semibold tracking-tight text-foam sm:text-6xl lg:text-[72px]"
              variants={copyItemVariants}
            >
              {title}
            </motion.h1>
            <motion.p
              className="mt-6 max-w-[55ch] text-base text-neutral-300 sm:text-lg"
              variants={copyItemVariants}
            >
              {blurb}
            </motion.p>
            <motion.div className="mt-10 flex flex-wrap items-center gap-4" variants={copyItemVariants}>
              <a
                href={primaryCta.href}
                aria-label={primaryCta.ariaLabel ?? primaryCta.label}
                onClick={primaryCta.onClick}
                className="rounded-full px-5 py-2 text-sm font-medium bg-[var(--lavender-500,#b69cff)] text-black shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_12px_40px_rgba(182,156,255,0.35)] transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lavender-400,#cbb7ff)]"
              >
                {primaryCta.label}
              </a>
              {secondaryCta ? (
                <a
                  href={secondaryCta.href}
                  aria-label={secondaryCta.ariaLabel ?? secondaryCta.label}
                  onClick={secondaryCta.onClick}
                  className="rounded-full px-5 py-2 text-sm font-medium border border-white/15 text-white transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lavender-400,#cbb7ff)]"
                >
                  {secondaryCta.label}
                </a>
              ) : null}
            </motion.div>
          </motion.div>

          <motion.div className="relative mt-10 md:col-span-6 lg:col-span-6 xl:col-span-5 md:mt-0" variants={columnVariants}>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[56vh] w-[56vw] -translate-y-1/2 blur-3xl opacity-35"
              style={{
                background:
                  "radial-gradient(40% 55% at 75% 50%, rgba(182,156,255,0.55), rgba(182,156,255,0.1) 45%, transparent 70%)",
              }}
            />
            <div className="mx-auto w-full max-w-[520px] pt-6 lg:max-w-[600px] lg:pt-0">
              <motion.div
                className="group/tile relative overflow-hidden rounded-[32px] border border-white/12 bg-white/5 p-6 backdrop-blur-xl"
                onMouseMove={handlePointerMove}
                onMouseLeave={resetPointer}
                onMouseEnter={prefersReducedMotion ? undefined : handlePointerMove}
                variants={tileContainerVariants}
              >
                <div className="relative -mx-2 flex gap-4 overflow-x-auto pb-4 sm:mx-0 sm:block sm:overflow-visible sm:p-0">
                  <ul className="relative grid min-w-[420px] grid-cols-3 auto-rows-[120px] gap-4 sm:min-w-0 sm:auto-rows-[160px] lg:gap-6">
                    {tiles.slice(0, 4).map((tile, index) => {
                      const layout = tileLayouts[index] ?? { grid: "col-span-1 row-span-1", offset: undefined };
                      return (
                        <HeroTile
                          key={`${tile.src}-${index}`}
                          tile={tile}
                          depth={tileDepths[index] ?? 0}
                          prefersReducedMotion={prefersReducedMotion}
                          variants={tileVariants}
                          parallaxX={parallaxX}
                          parallaxY={parallaxY}
                          index={index}
                          gridClass={layout.grid}
                          offsetClass={layout.offset}
                        />
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


