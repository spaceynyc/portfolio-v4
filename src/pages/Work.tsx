import { motion } from "framer-motion";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../App";
import { MotionDurations, MotionEasings } from "../styles/motion";

const projects = [
  {
    title: "Nebula Control",
    summary: "Command surfaces for climate intelligence, harmonising orbital telemetry with civic indicators in real time.",
    focus: ["Design system", "Motion language", "Prototype lab"],
    year: "2024",
  },
  {
    title: "Pulse Array",
    summary: "Adaptive audio diagnostics that connect gestures, sensors, and voice cues for custom-fit listening experiences.",
    focus: ["Spatial audio", "Sensor choreography", "Handoff"],
    year: "2023",
  },
  {
    title: "Orion Index",
    summary: "Layered investment interface translating dense models into navigable depth and controlled momentum.",
    focus: ["Interaction model", "Data visualisation", "Performance"],
    year: "2022",
  },
  {
    title: "Aurora Stage",
    summary: "Show control suite where lighting, audio, and kinetic rigs align through a single responsive timeline.",
    focus: ["Realtime UX", "Hardware integration", "Motion spec"],
    year: "2021",
  },
];

const listVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: MotionDurations.duration240,
      ease: MotionEasings.calm,
    },
  }),
};

export default function Work() {
  const { openContact, setActiveSection } = useOutletContext<LayoutContext>();

  useEffect(() => {
    setActiveSection(null);
  }, [setActiveSection]);

  return (
    <div className="flex flex-col gap-16 pb-24">
      <header className="flex flex-col gap-6 rounded-[32px] border border-hairline/70 bg-ink/70 p-10 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.32em] text-haze">Work</p>
        <h1 className="font-display text-4xl text-foam sm:text-5xl">Motion-led case studies built for shipping teams</h1>
        <p className="max-w-2xl text-base leading-relaxed text-haze">
          Each engagement pairs a motion strategy with the systems required to scale it&mdash;component libraries, prototyping rigs, and performance guardrails. Here are a few recent collaborations.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={openContact}
            className="rounded-full bg-lavender px-5 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-ink transition-colors duration-150 hover:bg-lavender-deep hover:text-foam focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Hire Me
          </button>
          <p className="text-sm text-haze">Available for late Q4 starts.</p>
        </div>
      </header>

      <section className="grid gap-6">
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            className="rounded-[32px] border border-hairline/60 bg-ink/60 p-8 transition-colors duration-150 hover:border-lavender"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={index}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-3xl text-foam sm:text-4xl">{project.title}</h2>
              <span className="rounded-full border border-hairline/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-haze">
                {project.year}
              </span>
            </div>
            <p className="mt-4 text-base leading-relaxed text-haze">{project.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.28em] text-lavender">
              {project.focus.map((item) => (
                <li key={item} className="rounded-full border border-lavender/40 px-3 py-1 text-lavender">
                  {item}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </section>
    </div>
  );
}
