import FocusTrap from "focus-trap-react";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useCharCount } from "../hooks/useCharCount";
import { MotionDurations, MotionEasings } from "../styles/motion";

const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const MESSAGE_LIMIT = 500;

type ContactDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function ContactDrawer({ open, onClose }: ContactDrawerProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const sheetRef = useRef<HTMLDivElement>(null);
  const { value: message, setValue: setMessage, count, remaining, reset } = useCharCount(MESSAGE_LIMIT);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setError(null);
      setStatus("idle");
      return;
    }
    const timeout = status === "sent" ? setTimeout(() => setStatus("idle"), 2400) : undefined;
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [open, status]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!message.trim()) {
      setError("Drop us a few lines so we can respond contextually.");
      return;
    }

    setError(null);
    console.log({ email, message });
    setStatus("sent");
    setEmail("");
    reset();
  };

  const hintTone = useMemo(() => {
    if (error) return "text-lavender-deep";
    if (remaining < 50) return "text-lavender-deep";
    return "text-haze";
  }, [error, remaining]);

  return (
    <AnimatePresence>
      {open ? (
        <FocusTrap
          active
          focusTrapOptions={{
            clickOutsideDeactivates: true,
            fallbackFocus: () => sheetRef.current ?? document.body,
            initialFocus: () => sheetRef.current ?? document.body,
          }}
        >
          <motion.div
            className="fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: MotionDurations.duration160 } }}
          >
            <motion.div
              role="presentation"
              className="absolute inset-0 bg-black/40"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: MotionDurations.duration160 } }}
            />
            <motion.div
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-label="Contact AetherLab"
              className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl rounded-t-[32px] border border-hairline border-b-0 bg-ink/96 backdrop-blur-lg"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%", transition: { duration: MotionDurations.transitionIn, ease: MotionEasings.tIn } }}
              transition={{ duration: MotionDurations.transitionOut, ease: MotionEasings.tOut }}
            >
              <div className="flex flex-col gap-6 px-6 pb-10 pt-8 sm:px-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-haze">Contact</p>
                    <h2 className="font-display text-3xl text-foam sm:text-4xl">Start a resonance check-in</h2>
                  </div>
                  <motion.button
                    type="button"
                    data-cursor="hover"
                    onClick={onClose}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-xs uppercase tracking-[0.24em] text-foam"
                    whileHover={{ backgroundColor: "rgba(198,183,255,0.12)" }}
                    whileTap={{ scale: 0.94 }}
                  >
                    Close
                  </motion.button>
                </div>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                  <label className="flex flex-col gap-2 text-sm text-haze">
                    Email
                    <input
                      type="email"
                      data-cursor="hover"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="rounded-2xl border border-hairline bg-transparent px-4 py-3 text-base text-foam focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/40"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-haze">
                    Message
                    <textarea
                      data-cursor="hover"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      maxLength={MESSAGE_LIMIT}
                      rows={5}
                      className="scroll-area rounded-2xl border border-hairline bg-transparent px-4 py-3 text-base text-foam focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/40"
                    />
                  </label>
                  <div className="flex items-center justify-between text-xs">
                    <p className={`${hintTone} transition-colors duration-150`}>
                      {error ? error : "We reply within two business days."}
                    </p>
                    <span className="text-haze">{count}/{MESSAGE_LIMIT}</span>
                  </div>
                  <motion.button
                    type="submit"
                    data-cursor="hover"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-lavender px-6 py-3 font-display text-sm uppercase tracking-[0.3em] text-ink transition-colors duration-150 hover:bg-lavender-deep hover:text-foam focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Send Brief
                  </motion.button>
                  <AnimatePresence>
                    {status === "sent" ? (
                      <motion.div
                        key="sent"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                   <motion.div
  exit={{ opacity: 0, y: -6, transition: { duration: MotionDurations.duration120 } }}
  className="rounded-full border border-lavender/50 bg-lavender/10 px-4 py-2 text-center text-xs text-lavender"
>

                      >
                        Sent (stub)
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </FocusTrap>
      ) : null}
    </AnimatePresence>
  );
}
