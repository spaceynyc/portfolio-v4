import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { LayoutGroup, motion, useInView } from "framer-motion";

type WorkCategory = "product-ui" | "motion-systems" | "prototyping";

type WorkProject = {
  id: string;
  title: string;
  year: string;
  role: string;
  tags: [string, string, string?];
  summary: string;
  categories: WorkCategory[];
  cover: {
    poster: string;
    image: string;
    sources: { src: string; type: string }[];
  };
};

type FilterConfig = {
  label: string;
  value: "all" | WorkCategory;
};

const filters: FilterConfig[] = [
  { label: "All", value: "all" },
  { label: "Product UI", value: "product-ui" },
  { label: "Motion Systems", value: "motion-systems" },
  { label: "Prototyping", value: "prototyping" },
];

const projects: WorkProject[] = [
  {
    id: "nebula-horizon",
    title: "Nebula Horizon",
    year: "2024",
    role: "Motion + Systems Lead",
    tags: ["Kinetic UI", "Telemetry", "Spatial Audio"],
    summary: "Commanding orbital data flows into an adaptive control tier for mixed crews.",
    categories: ["product-ui", "motion-systems"],
    cover: {
      poster: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=70",
      sources: [
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", type: "video/webm" },
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", type: "video/mp4" },
      ],
    },
  },
  {
    id: "ionia-array",
    title: "Ionia Array",
    year: "2023",
    role: "Interface Systems",
    tags: ["Design Ops", "Realtime", "Elastic Tokens"],
    summary: "Scaling a product UI kit that syncs motion curves with manufacturing telemetry.",
    categories: ["product-ui"],
    cover: {
      poster: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=70",
      sources: [
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", type: "video/webm" },
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", type: "video/mp4" },
      ],
    },
  },
  {
    id: "tempo-channels",
    title: "Tempo Channels",
    year: "2024",
    role: "Motion Strategy",
    tags: ["Behavioral", "Crossfade", "A11y"],
    summary: "Layering voice, touch, and gesture feedback into one responsive choreography.",
    categories: ["motion-systems"],
    cover: {
      poster: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80",
      image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=70",
      sources: [
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", type: "video/webm" },
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", type: "video/mp4" },
      ],
    },
  },
  {
    id: "flux-vanguard",
    title: "Flux Vanguard",
    year: "2022",
    role: "Prototype Director",
    tags: ["Research Lab", "Hardware", "XR"],
    summary: "Immersive prototyping rig translating haptics into cinematic motion cues.",
    categories: ["prototyping", "motion-systems"],
    cover: {
      poster: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=70",
      sources: [
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", type: "video/webm" },
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", type: "video/mp4" },
      ],
    },
  },
  {
    id: "lyra-signal",
    title: "Lyra Signal",
    year: "2023",
    role: "Principal Prototype Engineer",
    tags: ["Figma Tokens", "Native", "Hand-Off"],
    summary: "Bridging design ops and firmware teams with physics-ready interaction specs.",
    categories: ["prototyping", "product-ui"],
    cover: {
      poster: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1600&q=80",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=70",
      sources: [
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", type: "video/webm" },
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", type: "video/mp4" },
      ],
    },
  },
  {
    id: "selene-grid",
    title: "Selene Grid",
    year: "2022",
    role: "Prototype Systems",
    tags: ["Sandbox", "Realtime", "Hardware Handoff"],
    summary: "A prototyping playground letting teams co-simulate robotics and UI states in sync.",
    categories: ["prototyping"],
    cover: {
      poster: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80",
      image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=70",
      sources: [
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", type: "video/webm" },
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", type: "video/mp4" },
      ],
    },
  },
];

const easing = [0.4, 0, 0.2, 1];
const MAX_TILT = 6;

export default function WorkCollection() {
  const [activeFilter, setActiveFilter] = useState<FilterConfig>(filters[0]);

  const filteredProjects = useMemo(() => {
    if (activeFilter.value === "all") {
      return projects;
    }
    return projects.filter((project) => project.categories.includes(activeFilter.value as WorkCategory));
  }, [activeFilter]);

  return (
    <div className="flex flex-col gap-10 pb-24">
      <header className="flex flex-col gap-4">
        <p className="font-display text-sm uppercase tracking-[0.32em] text-haze">Studio workgrid</p>
        <h1 className="font-display text-4xl text-foam sm:text-5xl">Prime collaborations</h1>
        <p className="max-w-3xl text-base leading-relaxed text-haze">
          Sensorial systems, motion architectures, and prototypes that let teams feel the interface months before release.
        </p>
      </header>

      <LayoutGroup>
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((filter) => {
            const isActive = filter.value === activeFilter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className="relative overflow-hidden rounded-full border border-hairline/50 bg-ink/40 px-5 py-2 text-sm font-medium text-haze transition-all duration-200 hover:text-foam focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender/60"
                data-cursor="hover"
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-lavender/20"
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: easing, delay: index * 0.04 }}
            className="h-full"
          >
            <WorkCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function WorkCard({ project }: { project: WorkProject }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isCoarsePointer = useCoarsePointer();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(cardRef, { once: true, margin: "200px" });
  const [transform, setTransform] = useState("perspective(1100px) rotateX(0deg) rotateY(0deg)");

  useEffect(() => {
    if (prefersReducedMotion) {
      setTransform("perspective(1100px) rotateX(0deg) rotateY(0deg)");
    }
  }, [prefersReducedMotion]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || isCoarsePointer || !cardRef.current) return;

    const bounds = cardRef.current.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left;
    const offsetY = event.clientY - bounds.top;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const rotateX = ((offsetY - centerY) / centerY) * -MAX_TILT;
    const rotateY = ((offsetX - centerX) / centerX) * MAX_TILT;

    setTransform(
      `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`
    );
  };

  const handlePointerLeave = () => {
    setTransform("perspective(1100px) rotateX(0deg) rotateY(0deg)");
  };

  const shouldShowVideo = isInView && !prefersReducedMotion && !isCoarsePointer;

  return (
    <motion.article
      ref={cardRef}
      className="group relative h-full rounded-2xl bg-[linear-gradient(130deg,rgba(146,120,255,0.35),rgba(57,189,145,0.08))] p-[1px]"
      style={{ transform, transition: "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: "0 22px 48px -18px rgba(148, 121, 255, 0.38), inset 0 1px 0 rgba(245, 245, 247, 0.06)",
        }}
      />
      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1rem-1px)] surface-glass-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {shouldShowVideo ? (
            <video
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={project.cover.poster}
            >
              {project.cover.sources.map((source) => (
                <source key={source.type} src={source.src} type={source.type} />
              ))}
            </video>
          ) : (
            <img
              src={project.cover.image}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-display text-2xl text-foam">{project.title}</h3>
              <p className="text-sm uppercase tracking-[0.3em] text-haze/80">{project.role}</p>
            </div>
            <span className="rounded-full border border-hairline/40 px-3 py-1 text-xs uppercase tracking-[0.28em] text-haze">
              {project.year}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-haze">{project.summary}</p>
          <div className="mt-auto flex flex-wrap items-center gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-hairline/40 bg-ink/50 px-3 py-1 text-xs uppercase tracking-[0.28em] text-lavender"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => setPrefers(event.matches);

    setPrefers(query.matches);

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handleChange);
      return () => query.removeEventListener("change", handleChange);
    }

    query.addListener(handleChange);
    return () => query.removeListener(handleChange);
  }, []);

  return prefers;
}

function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(pointer: coarse)");
    const handleChange = (event: MediaQueryListEvent) => setCoarse(event.matches);

    setCoarse(query.matches);

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handleChange);
      return () => query.removeEventListener("change", handleChange);
    }

    query.addListener(handleChange);
    return () => query.removeListener(handleChange);
  }, []);

  return coarse;
}

