import { useCallback, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../../App";

type ExperienceEntry = {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  mandate: string;
  achievements: string[];
};

type ToolsetGroup = {
  label: string;
  items: string[];
};

type Certification = {
  title: string;
  issuer: string;
  year: string;
};

const strengths: string[] = [
  "Systems-led storytelling",
  "Motion governance for scale",
  "Cross-discipline facilitation",
  "Evidence-driven prototyping",
];

const toolsets: ToolsetGroup[] = [
  {
    label: "Motion & Narrative",
    items: ["After Effects", "Cinema 4D", "Spline", "Glyphs"],
  },
  {
    label: "Product & Engineering",
    items: ["Figma", "React", "TypeScript", "GSAP", "Framer Motion"],
  },
  {
    label: "Ops & Insight",
    items: ["Notion", "Looker", "Amplitude", "Miro"],
  },
];

const certifications: Certification[] = [
  {
    title: "Certified Professional in Accessibility Core Competencies",
    issuer: "IAAP",
    year: "2024",
  },
  {
    title: "Design Systems: Governance & Maintenance",
    issuer: "NN/g",
    year: "2023",
  },
  {
    title: "Facilitation Masterclass",
    issuer: "LUMA Institute",
    year: "2022",
  },
];

const experienceTimeline: ExperienceEntry[] = [
  {
    company: "Lumen Systems",
    role: "Principal Motion Designer",
    start: "2022",
    end: "Present",
    location: "Remote / Hybrid",
    mandate: "Led the motion systems practice to unify six product surfaces under one interaction language.",
    achievements: [
      "Introduced timing tokens and QA automation, cutting regression-related fixes by 38%.",
      "Partnered with engineering on a shared prototype stack that trimmed time-to-proof from 12 days to 4.",
      "Launched governance playbooks that raised adoption of motion guidelines to 92% across product teams.",
    ],
  },
  {
    company: "Atlas Labs",
    role: "Senior Product Designer",
    start: "2019",
    end: "2022",
    location: "San Francisco, CA",
    mandate: "Stabilized onboarding journeys for multimodal platforms handling millions of weekly sessions.",
    achievements: [
      "Piloted motion-led tutorials that improved week-one activation by 27% in core markets.",
      "Shipped service blueprints translating behavioral data into roadmap bets with 3x faster validation.",
      "Codirected cross-org workshops, unlocking a 35% lift in design-dev satisfaction scores.",
    ],
  },
  {
    company: "Forge Collective",
    role: "Interaction Designer",
    start: "2016",
    end: "2019",
    location: "Amsterdam, NL",
    mandate: "Crafted live media installations and automotive clusters with synchronized motion narratives.",
    achievements: [
      "Delivered broadcast toolkits deployed at 40+ events with sub-50ms motion latency.",
      "Co-developed an adaptive lighting system that reduced on-site programming hours by 60%.",
      "Built rapid experimentation rigs enabling clients to greenlight concepts 2x faster.",
    ],
  },
];

export default function ResumeRoute() {
  const { setActiveSection } = useOutletContext<LayoutContext>();

  useEffect(() => {
    setActiveSection(null);
  }, [setActiveSection]);

  const handleExport = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }, []);

  return (
    <div className="resume-page flex flex-col gap-10 pb-24">
      <style>{`
        @page {
          size: auto;
          margin: 1in;
        }

        .resume-timeline summary::-webkit-details-marker {
          display: none;
        }

        @media print {
          :root {
            color-scheme: light;
          }

          body {
            background: #ffffff !important;
            color: #000000 !important;
          }

          .resume-page {
            gap: 1.5rem;
            background: transparent !important;
            color: #000000 !important;
          }

          .resume-page * {
            background: transparent !important;
            box-shadow: none !important;
            color: #000000 !important;
            border-color: rgba(0, 0, 0, 0.3) !important;
          }

          .resume-sticky {
            position: static !important;
            border: none !important;
            padding: 0 !important;
          }

          .resume-grid {
            display: block !important;
          }

          .resume-card {
            padding: 0 !important;
            border: none !important;
          }

          .resume-timeline > li {
            padding-left: 0 !important;
          }

          .resume-timeline-marker {
            display: none !important;
          }
        }
      `}</style>

      <header className="resume-sticky sticky top-24 z-20 flex flex-col gap-4 rounded-3xl border border-hairline/60 bg-ink/70 p-6 backdrop-blur print:bg-transparent print:text-black">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-haze/70 print:text-black">Resume</p>
            <h1 className="font-display text-3xl text-foam sm:text-4xl print:text-black">Operational motion design leadership</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="rounded-full bg-lavend px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-ink transition-colors duration-150 hover:bg-lavend-deep hover:text-foam focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavend focus-visible:ring-offset-2 focus-visible:ring-offset-ink print:hidden"
            >
              Download PDF
            </button>
            <a
              href="mailto:hello@aetherlab.studio"
              className="rounded-full border border-hairline/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-haze transition-colors duration-150 hover:text-lavend focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavend focus-visible:ring-offset-2 focus-visible:ring-offset-ink print:text-black print:border-black"
            >
              Email
            </a>
            <a
              href="https://cal.com/aetherlab/intro"
              className="rounded-full border border-hairline/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-haze transition-colors duration-150 hover:text-lavend focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavend focus-visible:ring-offset-2 focus-visible:ring-offset-ink print:text-black print:border-black"
            >
              Book intro call
            </a>
          </div>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-haze print:text-black">
          Guiding motion systems from first sketch to production governance. I help multidisciplinary teams pace interactions, codify choreography, and maintain performance budgets without losing narrative clarity.
        </p>
      </header>

      <main className="resume-grid grid gap-10 lg:grid-cols-[minmax(260px,320px)_1fr] xl:gap-16">
        <section aria-labelledby="resume-summary" className="flex flex-col gap-8">
          <section id="resume-summary" className="resume-card rounded-3xl border border-hairline/60 bg-ink/60 p-6 print:p-0 print:border-0">
            <h2 className="text-sm uppercase tracking-[0.3em] text-haze/70 print:text-black">Summary</h2>
            <p className="mt-4 text-sm leading-relaxed text-haze print:text-black">
              Two decades translating complex systems into expressive motion and interaction frameworks. I build the bridges between design, engineering, and operations so that behavioral intent, accessibility, and technical feasibility align from the outset.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-haze print:text-black">
              Recent engagements span aerospace telemetry suites, enterprise dashboards, and experiential installations-each delivered with measurable impact and enduring playbooks.
            </p>
          </section>

          <section aria-labelledby="resume-strengths" className="resume-card rounded-3xl border border-hairline/60 bg-ink/60 p-6 print:p-0 print:border-0">
            <h2 id="resume-strengths" className="text-sm uppercase tracking-[0.3em] text-haze/70 print:text-black">Core strengths</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-haze print:text-black">
              {strengths.map((strength) => (
                <li key={strength} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-lavend print:bg-black" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="resume-tools" className="resume-card rounded-3xl border border-hairline/60 bg-ink/60 p-6 print:p-0 print:border-0">
            <h2 id="resume-tools" className="text-sm uppercase tracking-[0.3em] text-haze/70 print:text-black">Tools</h2>
            <div className="mt-4 flex flex-col gap-5">
              {toolsets.map((group) => (
                <div key={group.label}>
                  <p className="text-xs uppercase tracking-[0.28em] text-haze/70 print:text-black">{group.label}</p>
                  <ul className="mt-2 flex flex-wrap gap-2 text-sm text-haze print:text-black">
                    {group.items.map((item) => (
                      <li key={item} className="rounded-full border border-hairline/50 bg-ink/50 px-3 py-1 text-xs uppercase tracking-[0.22em] text-lavend print:bg-transparent print:text-black print:border-black">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="resume-certifications" className="resume-card rounded-3xl border border-hairline/60 bg-ink/60 p-6 print:p-0 print:border-0">
            <h2 id="resume-certifications" className="text-sm uppercase tracking-[0.3em] text-haze/70 print:text-black">Certifications</h2>
            <ul className="mt-4 flex flex-col gap-4 text-sm text-haze print:text-black">
              {certifications.map((cert) => (
                <li key={`${cert.title}-${cert.year}`} className="flex justify-between gap-4">
                  <div>
                    <p className="font-medium text-foam print:text-black">{cert.title}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-haze/70 print:text-black">{cert.issuer}</p>
                  </div>
                  <time dateTime={cert.year} className="text-xs uppercase tracking-[0.25em] text-haze/70 print:text-black">
                    {cert.year}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        </section>

        <section aria-labelledby="resume-experience" className="resume-card rounded-3xl border border-hairline/60 bg-ink/60 p-6 print:p-0 print:border-0">
          <div className="flex flex-col gap-2">
            <h2 id="resume-experience" className="text-sm uppercase tracking-[0.3em] text-haze/70 print:text-black">Experience</h2>
            <p className="text-sm leading-relaxed text-haze print:text-black">
              A timeline of shipping-led roles. Expand each engagement for quantified outcomes and collaboration models.
            </p>
          </div>
          <ol className="resume-timeline mt-6 flex flex-col gap-6">
            {experienceTimeline.map((entry, index) => (
              <li key={`${entry.company}-${entry.start}`} className="relative pl-10">
                <span className="resume-timeline-marker absolute left-1 top-3 h-full w-px bg-gradient-to-b from-lavend via-lavend/20 to-transparent print:hidden" aria-hidden="true" />
                <span className="absolute left-0 top-3 flex h-3 w-3 items-center justify-center rounded-full border-2 border-ink bg-lavend print:hidden" aria-hidden="true">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                </span>
                <article className="rounded-2xl border border-hairline/50 bg-ink/50 p-5 transition-colors duration-200 hover:border-lavend/60 print:bg-transparent print:border-0">
                  <details className="group" open={index === 0}>
                    <summary className="list-none cursor-pointer">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.28em] text-haze/70 print:text-black">{entry.company}</p>
                            <h3 className="font-display text-2xl text-foam print:text-black">{entry.role}</h3>
                          </div>
                          <div className="flex flex-col items-end text-xs uppercase tracking-[0.25em] text-haze/70 print:text-black">
                            <span className="flex items-center gap-1">
                              <time dateTime={entry.start}>{entry.start}</time>
                              <span aria-hidden="true">-</span>
                              <time dateTime={entry.end === "Present" ? new Date().getFullYear().toString() : entry.end}>
                                {entry.end}
                              </time>
                            </span>
                            <span>{entry.location}</span>
                          </div>
                        </div>
                        <p className="max-w-2xl text-sm leading-relaxed text-haze print:text-black">{entry.mandate}</p>
                        <div className="flex items-center gap-2 pt-2 text-xs uppercase tracking-[0.28em] text-haze/60 transition-colors duration-150 group-open:text-lavend print:hidden">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-hairline/40 text-lavend">
                            <span className="group-open:hidden">+</span>
                            <span className="hidden group-open:inline">-</span>
                          </span>
                          <span className="group-open:hidden">View highlights</span>
                          <span className="hidden group-open:inline">Hide highlights</span>
                        </div>
                      </div>
                    </summary>
                    <div className="mt-4 border-t border-hairline/30 pt-4 text-sm text-haze print:border-black print:text-black">
                      <h4 className="text-xs uppercase tracking-[0.28em] text-haze/60 print:text-black">Highlights</h4>
                      <ul className="mt-3 flex flex-col gap-3 leading-relaxed">
                        {entry.achievements.map((achievement) => (
                          <li key={achievement} className="flex gap-3">
                            <span aria-hidden="true" className="mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-lavend print:bg-black" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </article>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}

