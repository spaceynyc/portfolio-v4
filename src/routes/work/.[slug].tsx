import { useEffect, useMemo, useRef, useState, useId } from "react";
import type { ComponentType, ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

type MediaSource = {
  src: string;
  type: string;
};

type ProcessClip = {
  id?: string;
  src: string;
  type?: "image" | "video";
  poster?: string;
  sources?: MediaSource[];
  alt: string;
  caption: string;
};

type OutcomeMetric = {
  label: string;
  value: string;
};

type MotionTokenSpec = {
  durationMs: number;
  easing: string;
  distancePx: number;
  notes?: string;
  extras?: OutcomeMetric[];
};

type Credit = {
  label: string;
  person: string;
  contribution?: string;
};

type NextCase = {
  slug: string;
  title: string;
  client?: string;
  year?: string;
  thumbnail?: string;
  alt?: string;
};

type HeroMedia = {
  mediaType: "video" | "image";
  src?: string;
  sources?: MediaSource[];
  poster?: string;
  alt: string;
  caption: string;
};

export type WorkCaseStudyFrontmatter = {
  title: string;
  year: string;
  client: string;
  role: string;
  summary?: string;
  hero: HeroMedia;
  outcomes: OutcomeMetric[];
  motionTokens: MotionTokenSpec;
  processReel?: {
    label?: string;
    clips: ProcessClip[];
  };
  credits: Credit[];
  nextCase?: NextCase;
};

type MDXContentComponent = (props: { components?: Record<string, ComponentType<any>> }) => JSX.Element;

type CaseStudyModule = {
  default: MDXContentComponent;
  frontmatter: WorkCaseStudyFrontmatter;
};

// Case studies live alongside this route under ./cases
const caseStudyModules = import.meta.glob<CaseStudyModule>("./cases/**/*.{md,mdx}");

type CaseStudyLoadState =
  | {
      status: "idle" | "loading";
      frontmatter: null;
      Component: null;
      error: null;
    }
  | {
      status: "ready";
      frontmatter: WorkCaseStudyFrontmatter;
      Component: MDXContentComponent;
      error: null;
    }
  | {
      status: "error";
      frontmatter: null;
      Component: null;
      error: Error;
    };

export default function WorkCaseStudyTemplate() {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const slug = rawSlug?.toLowerCase() ?? "";
  const [caseStudy, setCaseStudy] = useState<CaseStudyLoadState>({
    status: "idle",
    frontmatter: null,
    Component: null,
    error: null,
  });
  const creditsMountedRef = useRef(false);

  useEffect(() => {
    creditsMountedRef.current = false;
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    setCaseStudy({ status: "loading", frontmatter: null, Component: null, error: null });

    const candidates = [
      `./cases/${slug}.mdx`,
      `./cases/${slug}.md`,
      `./cases/${slug}/index.mdx`,
      `./cases/${slug}/index.md`,
    ];

    const importer = candidates
      .map((key) => caseStudyModules[key])
      .find((value): value is () => Promise<CaseStudyModule> => Boolean(value));

    if (!importer) {
      setCaseStudy({
        status: "error",
        frontmatter: null,
        Component: null,
        error: new Error("CASE_NOT_FOUND"),
      });
      return;
    }

    importer()
      .then((mod) => {
        if (cancelled) return;
        setCaseStudy({
          status: "ready",
          frontmatter: mod.frontmatter,
          Component: mod.default,
          error: null,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setCaseStudy({
          status: "error",
          frontmatter: null,
          Component: null,
          error: err instanceof Error ? err : new Error(String(err)),
        });
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (caseStudy.status !== "ready") return;
    if (typeof document === "undefined") return;
    const previousTitle = document.title;
    document.title = `${caseStudy.frontmatter.title}  -  ${caseStudy.frontmatter.client}`;
    return () => {
      document.title = previousTitle;
    };
  }, [caseStudy]);

  if (!slug) {
    return (
      <EmptyState
        heading="Case study not specified"
        description="Pick a case from the index to view the full breakdown."
        actionLabel="Back to work index"
        onAction={() => navigate("/work")}
      />
    );
  }

  if (caseStudy.status === "loading") {
    return <CaseStudySkeleton />;
  }

  if (caseStudy.status === "error") {
    const message =
      caseStudy.error?.message === "CASE_NOT_FOUND"
        ? "We couldn't find that case study."
        : "Something went sideways while loading this case.";
    return (
      <EmptyState
        heading="Unable to load case"
        description={message}
        actionLabel="Return to work index"
        onAction={() => navigate("/work")}
      />
    );
  }

  const { Component, frontmatter } = caseStudy;
  const mdxComponents = useMemo(() => {
    return createMdxComponents(frontmatter, {
      onCreditsMount: () => {
        creditsMountedRef.current = true;
      },
    });
  }, [frontmatter]);

  return (
    <article className="flex flex-col gap-14 pb-32">
      <HeroSection frontmatter={frontmatter} />
      <OutcomesBar outcomes={frontmatter.outcomes} />
      <div className="flex flex-col gap-12">
        {Component ? <Component components={mdxComponents} /> : null}
        {!creditsMountedRef.current && frontmatter.credits?.length ? (
          <CreditsSection
            frontmatter={frontmatter}
            kicker="Collaborators"
            title="Credits"
          />
        ) : null}
      </div>
      <NextCaseCard nextCase={frontmatter.nextCase} />
    </article>
  );
}

type SectionComponentProps = {
  children?: ReactNode;
  kicker?: string;
  title?: string;
  className?: string;
  bodyClassName?: string;
};

type CreditsSectionProps = SectionComponentProps & {
  frontmatter: WorkCaseStudyFrontmatter;
  onMount?: () => void;
};

type MotionSystemSectionProps = SectionComponentProps & {
  frontmatter: WorkCaseStudyFrontmatter;
  onMount?: () => void;
};

type MotionScoreProps = {
  tokens?: MotionTokenSpec;
  className?: string;
};

type ProcessReelProps = {
  clips: ProcessClip[];
  className?: string;
  ariaLabel?: string;
};

type ComponentDemoProps = {
  title: string;
  description: string;
  media: {
    type: "image" | "video";
    src?: string;
    sources?: MediaSource[];
    poster?: string;
    alt: string;
  };
  children?: ReactNode;
  className?: string;
};

function createMdxComponents(
  frontmatter: WorkCaseStudyFrontmatter,
  hooks: {
    onCreditsMount?: () => void;
  }
): Record<string, ComponentType<any>> {
  return {
    Challenge: createSectionComponent("challenge", "Challenge"),
    Approach: createSectionComponent("approach", "Approach"),
    MotionSystem: (props: MotionSystemSectionProps) => (
      <MotionSystemSection {...props} frontmatter={frontmatter} />
    ),
    Results: createSectionComponent("results", "Results"),
    Credits: (props: CreditsSectionProps) => (
      <CreditsSection {...props} frontmatter={frontmatter} onMount={hooks.onCreditsMount} />
    ),
    MotionScore: (props: MotionScoreProps) => (
      <MotionScore {...props} tokens={frontmatter.motionTokens} />
    ),
    ComponentDemo,
    ProcessReel: (props: ProcessReelProps) => (
      <ProcessReel
        {...props}
        clips={props.clips?.length ? props.clips : frontmatter.processReel?.clips ?? []}
      />
    ),
  };
}

function createSectionComponent(id: string, defaultTitle: string) {
  return (props: SectionComponentProps) => (
    <SectionShell
      id={id}
      title={props.title ?? defaultTitle}
      kicker={props.kicker}
      className={props.className}
      bodyClassName={props.bodyClassName}
    >
      {props.children}
    </SectionShell>
  );
}

type SectionShellProps = {
  id: string;
  title: string;
  kicker?: string;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
};

function SectionShell({
  id,
  title,
  kicker,
  children,
  className,
  bodyClassName,
}: SectionShellProps) {
  const containerClass = [
    "rounded-[32px] border border-hairline/60 bg-ink/60 p-10 backdrop-blur",
    className ?? "",
  ]
    .join(" ")
    .trim();

  const bodyClass = [
    "mt-6 flex flex-col gap-6 text-base leading-relaxed text-haze",
    bodyClassName ?? "",
  ]
    .join(" ")
    .trim();

  return (
    <section id={id} className={containerClass}>
      <header className="flex flex-col gap-3">
        {kicker ? (
          <p className="text-xs uppercase tracking-[0.32em] text-haze">{kicker}</p>
        ) : null}
        <h2 className="font-display text-3xl text-foam sm:text-[2.5rem]">{title}</h2>
      </header>
      <div className={bodyClass}>{children}</div>
    </section>
  );
}

function MotionSystemSection({
  frontmatter,
  kicker,
  title,
  children,
  className,
  bodyClassName,
  onMount,
}: MotionSystemSectionProps) {
  useEffect(() => {
    onMount?.();
  }, [onMount]);

  const clips = frontmatter.processReel?.clips ?? [];
  const sectionClass = [
    "rounded-[32px] border border-hairline/60 bg-ink/60 p-10 backdrop-blur",
    className ?? "",
  ]
    .join(" ")
    .trim();

  const bodyClasses = [
    "mt-8 flex flex-col gap-10",
    bodyClassName ?? "",
  ]
    .join(" ")
    .trim();

  return (
    <section id="motion-system" className={sectionClass}>
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.32em] text-haze">
          {kicker ?? "Sequence Design"}
        </p>
        <h2 className="font-display text-3xl text-foam sm:text-[2.5rem]">
          {title ?? "Motion System"}
        </h2>
      </header>
      <div className={bodyClasses}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="space-y-6 text-base leading-relaxed text-haze">{children}</div>
          <MotionScore tokens={frontmatter.motionTokens} />
        </div>
        {clips.length ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-[0.28em] text-haze">
                {frontmatter.processReel?.label ?? "Process Reel"}
              </h3>
              <span className="text-xs text-haze/80">
                Loops automatically. Hover or focus to pause.
              </span>
            </div>
            <ProcessReel clips={clips} ariaLabel="Process reel clips" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function MotionScore({ tokens, className }: MotionScoreProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!tokens) {
    return null;
  }

  const durationMs = Number.isFinite(tokens.durationMs) ? tokens.durationMs : 320;
  const distancePx = Number.isFinite(tokens.distancePx) ? tokens.distancePx : 48;
  const ease = parseEasing(tokens.easing);
  const chips: OutcomeMetric[] = [
    { label: "Duration", value: `${Math.round(durationMs)} ms` },
    { label: "Easing", value: tokens.easing },
    { label: "Distance", value: `${Math.round(distancePx)} px` },
    ...(tokens.extras ?? []),
  ];

  const containerClass = [
    "relative flex flex-col gap-4 rounded-[24px] border border-hairline/40 bg-ink/50 p-6",
    className ?? "",
  ]
    .join(" ")
    .trim();

  return (
    <aside className={containerClass}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.28em] text-haze">Motion Score</p>
        <span className="text-xs text-haze/80">
          {tokens.notes ?? "Token preview mirrors system defaults."}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={`${chip.label}-${chip.value}`}
            className="rounded-full border border-hairline/40 bg-ink/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-lavend"
          >
            {chip.label}: {chip.value}
          </span>
        ))}
      </div>
      <div className="relative mt-4 h-24 overflow-hidden rounded-2xl border border-hairline/30 bg-ink/70">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-ink via-ink/60 to-transparent" />
        <motion.div
          className="absolute left-6 top-1/2 h-2 w-[calc(100%-48px)] -translate-y-1/2 rounded-full bg-hairline/30"
          aria-hidden="true"
        />
        <motion.div
          className="absolute left-6 top-1/2 h-10 w-10 -translate-y-1/2 rounded-2xl bg-lavend shadow-[0_12px_28px_rgba(142,124,255,0.35)]"
          aria-label="Motion token preview"
          initial={{ x: 0 }}
          animate={
            prefersReducedMotion
              ? { x: 0 }
              : {
                  x: distancePx,
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: durationMs / 1000,
                  ease,
                  repeat: Infinity,
                  repeatType: "reverse",
                }
          }
        />
      </div>
    </aside>
  );
}

function ProcessReel({ clips, className, ariaLabel }: ProcessReelProps) {
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setPaused] = useState(false);
  const duplicatedClips = useMemo(() => {
    if (!clips.length) return [];
    return [...clips, ...clips];
  }, [clips]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let frameId: number;
    let previous: number | null = null;

    const step = (time: number) => {
      const container = trackRef.current;
      if (!container) return;
      if (previous === null) {
        previous = time;
      }
      const delta = (time - previous) / 1000;
      previous = time;

      if (!isPaused) {
        const speed = 48;
        const scrollable = container.scrollWidth - container.clientWidth;
        if (scrollable > 0) {
          const next = container.scrollLeft + speed * delta;
          if (next >= scrollable - 1) {
            container.scrollLeft = 0;
          } else {
            container.scrollLeft = next;
          }
        }
      }

      frameId = window.requestAnimationFrame(step);
    };

    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [isPaused, prefersReducedMotion]);

  if (!clips.length) {
    return null;
  }

  const containerClass = [
    "relative overflow-hidden rounded-[24px] border border-hairline/40 bg-ink/40",
    className ?? "",
  ]
    .join(" ")
    .trim();

  const handlePrev = () => {
    const container = trackRef.current;
    if (!container) return;
    const delta = Math.max(container.clientWidth * 0.8, 200);
    container.scrollBy({
      left: -delta,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const handleNext = () => {
    const container = trackRef.current;
    if (!container) return;
    const delta = Math.max(container.clientWidth * 0.8, 200);
    container.scrollBy({
      left: delta,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className={containerClass}>
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth p-4"
        role="region"
        aria-label={ariaLabel ?? "Process reel"}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {duplicatedClips.map((clip, index) => {
          const captionId = `process-clip-${index}`;
          return (
            <figure
              key={`${clip.id ?? clip.src}-${index}`}
              className="flex w-52 shrink-0 flex-col gap-3"
              aria-labelledby={captionId}
            >
              <MediaFrame clip={clip} captionId={captionId} />
              <figcaption id={captionId} className="text-xs leading-relaxed text-haze">
                {clip.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink via-ink/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-3 flex justify-between px-4">
        <button
          type="button"
          onClick={handlePrev}
          className="pointer-events-auto rounded-full border border-hairline/50 bg-ink/70 px-3 py-1 text-xs uppercase tracking-[0.28em] text-haze transition-colors duration-150 hover:border-lavend hover:text-lavend focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavend focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="pointer-events-auto rounded-full border border-hairline/50 bg-ink/70 px-3 py-1 text-xs uppercase tracking-[0.28em] text-haze transition-colors duration-150 hover:border-lavend hover:text-lavend focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavend focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function CreditsSection({
  frontmatter,
  kicker,
  title,
  children,
  className,
  bodyClassName,
  onMount,
}: CreditsSectionProps) {
  useEffect(() => {
    onMount?.();
  }, [onMount]);

  const credits = frontmatter.credits ?? [];
  if (!credits.length) {
    return null;
  }

  const containerClass = [
    "rounded-[32px] border border-hairline/60 bg-ink/60 p-10 backdrop-blur",
    className ?? "",
  ]
    .join(" ")
    .trim();

  const bodyClasses = [
    "mt-6 flex flex-col gap-6",
    bodyClassName ?? "",
  ]
    .join(" ")
    .trim();

  return (
    <section id="credits" className={containerClass}>
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.32em] text-haze">
          {kicker ?? "Collaborators"}
        </p>
        <h2 className="font-display text-3xl text-foam sm:text-[2.5rem]">
          {title ?? "Credits"}
        </h2>
      </header>
      <div className={bodyClasses}>
        {children ? (
          <div className="text-base leading-relaxed text-haze">{children}</div>
        ) : null}
        <dl className="grid gap-4 sm:grid-cols-2">
          {credits.map((credit) => (
            <div
              key={`${credit.label}-${credit.person}`}
              className="rounded-3xl border border-hairline/40 bg-ink/50 p-4"
            >
              <dt className="text-xs uppercase tracking-[0.28em] text-haze">
                {credit.label}
              </dt>
              <dd className="mt-2 text-base text-foam">{credit.person}</dd>
              {credit.contribution ? (
                <p className="mt-1 text-sm text-haze">{credit.contribution}</p>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function ComponentDemo({ title, description, media, children, className }: ComponentDemoProps) {
  const captionId = useId();
  const containerClass = [
    "flex flex-col gap-4 rounded-[24px] border border-hairline/50 bg-ink/50 p-6",
    className ?? "",
  ]
    .join(" ")
    .trim();

  return (
    <figure className={containerClass} aria-labelledby={captionId}>
      <div className="overflow-hidden rounded-2xl border border-hairline/30 bg-ink/60">
        {media.type === "video" ? (
          <video
            className="h-full w-full object-cover"
            aria-label={media.alt}
            aria-describedby={captionId}
            poster={media.poster}
            autoPlay
            loop
            muted
            playsInline
          >
            {media.sources?.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
            {media.src ? <source src={media.src} /> : null}
            Your browser does not support the video tag.
          </video>
        ) : media.src ? (
          <img
            src={media.src}
            alt={media.alt}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
      <figcaption id={captionId} className="flex flex-col gap-2 text-sm leading-relaxed text-haze">
        <span className="text-xs uppercase tracking-[0.28em] text-haze/80">{title}</span>
        <span>{description}</span>
        {children}
      </figcaption>
    </figure>
  );
}

type HeroSectionProps = { frontmatter: WorkCaseStudyFrontmatter; };

function HeroSection({ frontmatter }: HeroSectionProps) {
  const captionId = useId();
  const media = frontmatter.hero;
  const isVideo = media.mediaType === "video" && ((media.sources && media.sources.length > 0) || media.src);

  return (
    <section className="flex flex-col gap-10 rounded-[32px] border border-hairline/70 bg-ink/70 p-10 backdrop-blur">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <figure
          className="relative overflow-hidden rounded-[28px] border border-hairline/40 bg-ink/60"
          aria-labelledby={captionId}
        >
          {isVideo ? (
            <video
              className="h-full w-full object-cover"
              poster={media.poster ?? media.src}
              autoPlay
              loop
              muted
              playsInline
              aria-label={media.alt}
              aria-describedby={captionId}
            >
              {media.sources?.map((source) => (
                <source key={source.src} src={source.src} type={source.type} />
              ))}
              {media.src ? <source src={media.src} /> : null}
              Your browser does not support the video tag.
            </video>
          ) : media.src ? (
            <img
              src={media.src}
              alt={media.alt}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full min-h-[320px] items-center justify-center bg-ink text-haze">
              Media placeholder
            </div>
          )}
          <figcaption
            id={captionId}
            className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-gradient-to-t from-ink via-ink/70 to-transparent p-4 text-xs text-haze"
          >
            <span className="rounded-full border border-hairline/40 px-2 py-0.5 uppercase tracking-[0.28em] text-haze/80">
              Hero
            </span>
            <span>{media.caption}</span>
          </figcaption>
        </figure>
        <div className="flex flex-col gap-6">
          <p className="text-xs uppercase tracking-[0.32em] text-haze">{frontmatter.client}</p>
          <h1 className="font-display text-4xl text-foam sm:text-5xl">{frontmatter.title}</h1>
          <dl className="flex flex-wrap items-center gap-5 text-sm uppercase tracking-[0.28em] text-haze/80">
            <div className="flex items-center gap-2">
              <dt className="sr-only">Year</dt>
              <dd className="rounded-full border border-hairline/40 px-3 py-1 text-xs text-haze">
                {frontmatter.year}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="text-xs uppercase tracking-[0.28em] text-haze/60">Role</dt>
              <dd className="text-sm text-haze">{frontmatter.role}</dd>
            </div>
          </dl>
          {frontmatter.summary ? (
            <p className="text-base leading-relaxed text-haze/90">{frontmatter.summary}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function OutcomesBar({ outcomes }: OutcomesBarProps) {
  if (!outcomes || !outcomes.length) {
    return null;
  }

  return (
    <dl className="grid gap-4 rounded-[28px] border border-hairline/60 bg-ink/60 p-6 sm:grid-cols-2 lg:grid-cols-4">
      {outcomes.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="rounded-2xl border border-hairline/30 bg-ink/40 p-4"
        >
          <dt className="text-xs uppercase tracking-[0.3em] text-haze">{item.label}</dt>
          <dd className="mt-2 text-lg font-semibold text-foam">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function NextCaseCard({ nextCase }: NextCaseCardProps) {
  if (!nextCase) {
    return null;
  }

  return (
    <aside className="sticky bottom-6 mt-16 self-end">
      <Link
        to={`/work/${nextCase.slug}`}
        className="group flex w-[20rem] items-center gap-4 rounded-[24px] border border-hairline/70 bg-ink/70 p-4 text-left transition-colors duration-150 hover:border-lavend focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavend focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        {nextCase.thumbnail ? (
          <img
            src={nextCase.thumbnail}
            alt={nextCase.alt ?? `Preview frame for ${nextCase.title}`}
            className="h-16 w-16 rounded-2xl object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline/40 bg-ink/60 text-xs uppercase tracking-[0.3em] text-haze">
            Next
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.3em] text-haze/80">Next case</span>
          <p className="font-semibold text-foam">{nextCase.title}</p>
          <span className="text-xs text-haze">
            {[nextCase.client, nextCase.year].filter(Boolean).join(" - ")}
          </span>
        </div>
      </Link>
    </aside>
  );
}

function EmptyState({ heading, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-6 rounded-[32px] border border-hairline/70 bg-ink/70 p-12 text-left">
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-3xl text-foam sm:text-4xl">{heading}</h1>
        <p className="max-w-xl text-base leading-relaxed text-haze">{description}</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="rounded-full border border-lavend bg-lavend px-5 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-ink transition-colors duration-150 hover:bg-lavend-deep hover:text-foam focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavend focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function CaseStudySkeleton() {
  return (
    <div className="flex flex-col gap-10 rounded-[32px] border border-hairline/70 bg-ink/70 p-10 backdrop-blur">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="h-80 animate-pulse rounded-[28px] bg-hairline/20" />
        <div className="flex flex-col gap-5">
          <div className="h-4 w-32 animate-pulse rounded-full bg-hairline/20" />
          <div className="h-10 w-3/4 animate-pulse rounded-full bg-hairline/20" />
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded-full bg-hairline/20" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-hairline/20" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-hairline/20" />
          </div>
        </div>
      </div>
      <div className="h-24 animate-pulse rounded-[24px] bg-hairline/10" />
      <div className="h-80 animate-pulse rounded-[24px] bg-hairline/10" />
    </div>
  );
}

function parseEasing(value: string | undefined) {
  if (!value) {
    return [0.42, 0, 0.58, 1] as [number, number, number, number];
  }

  const bezierMatch = value.match(/cubic-bezier\(([^)]+)\)/i);
  if (bezierMatch) {
    const parts = bezierMatch[1]
      .split(",")
      .map((piece) => Number.parseFloat(piece.trim()));
    if (parts.length === 4 && parts.every((num) => Number.isFinite(num))) {
      return parts as [number, number, number, number];
    }
  }

  switch (value) {
    case "linear":
    case "easeIn":
    case "easeOut":
    case "easeInOut":
    case "circIn":
    case "circOut":
    case "circInOut":
    case "anticipate":
    case "backIn":
    case "backOut":
    case "backInOut":
      return value;
    default:
      return [0.42, 0, 0.58, 1] as [number, number, number, number];
  }
}

type MediaFrameProps = {
  clip: ProcessClip;
  captionId?: string;
};

function MediaFrame({ clip, captionId }: MediaFrameProps) {
  if (clip.type === "video" || (clip.sources && clip.sources.length)) {
    return (
      <div className="overflow-hidden rounded-2xl border border-hairline/40 bg-ink/60">
        <video
          className="h-full w-full object-cover"
          poster={clip.poster}
          autoPlay
          loop
          muted
          playsInline
          aria-label={clip.alt}
          aria-describedby={captionId}
        >
          {clip.sources?.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
          <source src={clip.src} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline/40 bg-ink/60">
      <img
        src={clip.src}
        alt={clip.alt}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}



