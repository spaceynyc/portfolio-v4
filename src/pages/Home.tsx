import { motion } from "framer-motion";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../App";
import { PortfolioHero } from "../sections/PortfolioHero";

const cards = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.4, 0, 0.2, 1], delay: i * 0.06 },
  }),
};

const capabilities = [
  {
    title: "Interface systems",
    copy: "Design languages and adaptive component libraries that hold their rhythm across products and platforms.",
  },
  {
    title: "Motion strategy",
    copy: "Precision-tuned animations that communicate intent, clarify flows, and keep attention anchored without theatrics.",
  },
  {
    title: "Prototype labs",
    copy: "High-fidelity sandboxes that let teams feel interactions before they commit to code or production roadmaps.",
  },
];

const caseStudies = [
  {
    name: "Nebula Control",
    description: "Motion-led command center for a climate intelligence platform, blending orbit telemetry with city-scale data.",
    year: "2024",
  },
  {
    name: "Pulse Array",
    description: "Responsive audio diagnostics for an adaptive headset lineup, aligning sensors, gestures, and voice cues.",
    year: "2023",
  },
  {
    name: "Orion Index",
    description: "Immersive investing surface where complex models become legible through layered depth and guided focus.",
    year: "2022",
  },
];

export default function Home() {
  const { setActiveSection } = useOutletContext<LayoutContext>();
  useEffect(() => {
    setActiveSection("work");
    return () => setActiveSection(null);
  }, [setActiveSection]);

  return (
    <div className="relative flex min-h-screen flex-col gap-24 pb-32">
      <PortfolioHero />

      <section id="approach" className="scroll-mt-28">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr] lg:gap-12">
            <motion.div
              className="rounded-[32px] border border-hairline/70 bg-ink/60 p-8 backdrop-blur"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
            >
              <h2 className="font-display text-2xl text-foam sm:text-3xl">How we modulate momentum</h2>
              <p className="mt-4 text-base leading-relaxed text-haze">
                Every engagement starts with a motion score&mdash;a map of how light, depth, and time should behave across product touchpoints. We then codify it into accessible systems your teams can ship without guesswork.
              </p>
              <div className="mt-6 grid gap-4 text-sm text-haze">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-lavend" />
                  Research sprints, brand tune-ups, motion guidelines
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-lavend" />
                  Prototype rigs, developer handoff, performance audits
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-lavend" />
                  Embedded collaborations from seed to scale
                </div>
              </div>
            </motion.div>
            <div className="grid gap-4">
              {capabilities.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="rounded-3xl border border-hairline/60 bg-ink/40 p-6"
                  variants={cards}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={index}
                >
                  <h3 className="font-display text-xl text-foam">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-haze">{item.copy}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="lab" className="scroll-mt-28">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 sm:px-10">
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="font-display text-sm uppercase tracking-[0.3em] text-haze">Case signals</p>
            <h2 className="font-display text-3xl text-foam sm:text-4xl">Selected investigations</h2>
          </motion.div>
          <div className="grid gap-4">
            {caseStudies.map((project, index) => (
              <motion.article
                key={project.name}
                className="group grid gap-4 rounded-[32px] border border-hairline/70 bg-ink/50 p-6 transition-colors duration-150 hover:border-lavend"
                variants={cards}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={index}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-2xl text-foam">{project.name}</h3>
                  <span className="rounded-full border border-hairline/50 px-3 py-1 text-xs uppercase tracking-[0.3em] text-haze">
                    {project.year}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-haze group-hover:text-foam">{project.description}</p>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-lavend">
                  <span className="h-px w-8 bg-lavend/70" />
                  Inquire for release notes
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}






