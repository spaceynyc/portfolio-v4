import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../App";
import { MotionDurations, MotionEasings } from "../styles/motion";

export default function About() {
  const { openContact } = useOutletContext<LayoutContext>();

  return (
    <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col gap-12 px-6 py-28 sm:px-10 lg:py-36">
      <motion.h1
        className="font-display text-4xl text-foam sm:text-5xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: MotionDurations.duration240, ease: MotionEasings.calm }}
      >
        About AetherLab
      </motion.h1>
      <motion.p
        className="max-w-3xl text-lg leading-relaxed text-haze"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: MotionDurations.duration240, ease: MotionEasings.calm, delay: 0.08 }}
      >
        We are a compact team of interaction designers, prototypers, and technical artists applying research-led motion thinking to digital products. Our practice lives where product detail meets brand atmosphere&mdash;where invisible systems require a visual voice.
      </motion.p>
      <motion.div
        className="grid gap-6 text-sm text-haze"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: MotionDurations.duration240, ease: MotionEasings.calm, delay: 0.14 }}
      >
        <div className="rounded-3xl border border-hairline/60 bg-ink/50 p-6">
          <h2 className="font-display text-xl text-foam">Lab principles</h2>
          <ul className="mt-4 space-y-2 list-disc pl-5">
            <li>Translate complex systems into calm, legible interactions.</li>
            <li>Prototype in motion first&mdash;code is our sketchbook.</li>
            <li>Operate as embedded partners, not distant vendors.</li>
            <li>Measure delight by clarity: fewer steps, sharper focus.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-hairline/60 bg-ink/50 p-6">
          <h2 className="font-display text-xl text-foam">Open collaboration windows</h2>
          <p className="mt-3 leading-relaxed">
            We book 6–8 week interface labs quarterly. Upcoming availability begins mid-Q2. Share your challenge and we will respond with a tailored motion plan.
          </p>
          <motion.button
            type="button"
            data-cursor="hover"
            onClick={openContact}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-lavend px-5 py-3 font-display text-xs uppercase tracking-[0.3em] text-ink transition-colors duration-150 hover:bg-lavend-deep hover:text-foam"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Contact the lab
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
