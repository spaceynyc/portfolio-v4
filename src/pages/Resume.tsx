import { motion } from "framer-motion";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../App";

const experience = [
  {
    role: "Principal Motion Designer",
    company: "Lumen Systems",
    period: "2022 — Present",
    bullets: [
      "Scaled a motion design system that ships across six product lines with shared timing tokens and performance budgets.",
      "Partnered with engineering to build a real-time QA rig, reducing interaction regressions by 34%.",
    ],
  },
  {
    role: "Senior Product Designer",
    company: "Atlas Labs",
    period: "2019 — 2022",
    bullets: [
      "Led interface prototyping for AR and desktop surfaces with an emphasis on motion-led onboarding.",
      "Delivered developer-spec tooling that cut handoff friction across distributed teams.",
    ],
  },
  {
    role: "Interaction Designer",
    company: "Forge Collective",
    period: "2016 — 2019",
    bullets: [
      "Designed experimental interfaces spanning automotive clusters, museum installations, and broadcast graphics.",
      "Set up motion language foundations adopted by partner agencies across Europe and APAC.",
    ],
  },
];

const skills = [
  "Motion systems", "Design engineering", "Rapid prototyping", "Accessibility auditing", "Workshop facilitation", "Narrative decks"
];

const tools = [
  "After Effects", "Figma", "Spline", "TouchDesigner", "React", "TypeScript", "Framer", "GSAP"
];

const recognition = [
  { title: "IxDA Awards", note: "Shortlist — Responsive Environments (2023)" },
  { title: "Webby", note: "Nominee — Experimental & Innovation (2022)" },
  { title: "Creative Review", note: "Featured — Motion Systems for Product (2021)" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.24, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function Resume() {
  const { openContact, setActiveSection } = useOutletContext<LayoutContext>();

  useEffect(() => {
    setActiveSection(null);
  }, [setActiveSection]);

  return (
    <div className="flex flex-col gap-16 pb-24">
      <header className="flex flex-col gap-6 rounded-[32px] border border-hairline/70 bg-ink/70 p-10 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.32em] text-haze">Résumé</p>
        <h1 className="font-display text-4xl text-foam sm:text-5xl">Experience and skills tuned for momentum</h1>
        <p className="max-w-3xl text-base leading-relaxed text-haze">
          I help teams articulate, prototype, and ship motion systems that stay elegant under load. Here&apos;s the recent trajectory along with the skills and tools that keep engagements moving.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={openContact}
            className="rounded-full bg-lavend px-5 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-ink transition-colors duration-150 hover:bg-lavend-deep hover:text-foam focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavend focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Hire Me
          </button>
          <span className="text-sm text-haze">Portfolio + references on request.</span>
        </div>
      </header>

      <section className="grid gap-6">
        {experience.map((item, index) => (
          <motion.article
            key={item.role}
            className="rounded-[28px] border border-hairline/60 bg-ink/60 p-8"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={index}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="font-display text-2xl text-foam">{item.role}</h2>
                <p className="text-sm uppercase tracking-[0.28em] text-haze">{item.company}</p>
              </div>
              <span className="rounded-full border border-hairline/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-haze">{item.period}</span>
            </div>
            <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-haze">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span aria-hidden="true" className="mt-1 block h-1 w-1 rounded-full bg-lavend" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <motion.div
          className="rounded-[28px] border border-hairline/60 bg-ink/60 p-8"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          custom={experience.length + 1}
        >
          <h3 className="font-display text-xl text-foam">Core capabilities</h3>
          <ul className="mt-4 grid gap-3 text-sm text-haze">
            {skills.map((skill) => (
              <li key={skill} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-lavend" />
                {skill}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="rounded-[28px] border border-hairline/60 bg-ink/60 p-8"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          custom={experience.length + 2}
        >
          <h3 className="font-display text-xl text-foam">Tools in regular rotation</h3>
          <ul className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-lavend">
            {tools.map((tool) => (
              <li key={tool} className="rounded-full border border-lavend/40 px-3 py-1">
                {tool}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      <motion.section
        className="rounded-[28px] border border-hairline/60 bg-ink/60 p-8"
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        custom={experience.length + 3}
      >
        <h3 className="font-display text-xl text-foam">Recognition</h3>
        <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-haze">
          {recognition.map((item) => (
            <li key={item.title} className="flex flex-wrap items-baseline justify-between gap-2">
              <span>{item.title}</span>
              <span className="text-xs uppercase tracking-[0.24em] text-haze/80">{item.note}</span>
            </li>
          ))}
        </ul>
      </motion.section>
    </div>
  );
}
