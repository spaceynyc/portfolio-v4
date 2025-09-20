import { useEffect, useMemo, useState } from "react";
import type p5 from "p5";
import { ReactP5Wrapper } from "@p5-wrapper/react";

type Star = {
  x: number;
  y: number;
  size: number;
  baseBrightness: number;
  phase: number;
  twinkleSpeed: number;
};

type SketchProps = {
  prefersReducedMotion: boolean;
};

const LAVENDER_RGB = { r: 198, g: 183, b: 255 };

const createSketch = () => {
  let stars: Star[] = [];
  let prefersReducedMotion = false;

  const generateStars = (p: p5) => {
    const area = p.width * p.height;
    const targetCount = Math.min(600, Math.max(400, Math.floor(area / 3000)));

    stars = Array.from({ length: targetCount }, () => ({
      x: p.random(p.width),
      y: p.random(p.height),
      size: p.random(0.5, 2.5),
      baseBrightness: p.random(120, 200),
      phase: p.random(0, p.TWO_PI),
      twinkleSpeed: p.random(0.5, 1.5),
    }));
  };

  const ensureLoopState = (p: p5) => {
    if (prefersReducedMotion) {
      if (p.isLooping()) {
        console.debug("[Starfield] Switching to noLoop");
        p.noLoop();
      }
      p.redraw();
    } else {
      if (!p.isLooping()) {
        console.debug("[Starfield] Switching to loop");
      }
      p.loop();
    }
  };

  return (p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      if (typeof window !== "undefined") {
        p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
      }
      p.noStroke();
      p.frameRate(45);
      console.debug("[Starfield] p5 setup, prefersReducedMotion:", prefersReducedMotion);
      generateStars(p);
      ensureLoopState(p);
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      generateStars(p);
      if (prefersReducedMotion) {
        p.redraw();
      }
    };

    p.draw = () => {
      p.background(11, 11, 11);

      const centerX = p.width / 2;
      const centerY = p.height / 2;
      const safeCenterX = centerX || 1;
      const safeCenterY = centerY || 1;
      const rawMouseX = Number.isFinite(p.mouseX) ? p.mouseX : safeCenterX;
      const rawMouseY = Number.isFinite(p.mouseY) ? p.mouseY : safeCenterY;
      const pointerX = rawMouseX === 0 && rawMouseY === 0 ? safeCenterX : rawMouseX;
      const pointerY = rawMouseX === 0 && rawMouseY === 0 ? safeCenterY : rawMouseY;
      const normalizedMouseX = p.constrain((pointerX - safeCenterX) / safeCenterX, -1, 1);
      const normalizedMouseY = p.constrain((pointerY - safeCenterY) / safeCenterY, -1, 1);
      const parallaxStrength = 6;

      const shouldAnimate = !prefersReducedMotion;
      const animatedFrame = shouldAnimate ? p.frameCount : 0;

      if (shouldAnimate && p.frameCount <= 60) {
        console.debug("[Starfield] frameCount", p.frameCount);
      }

      for (const star of stars) {
        const phaseProgress = animatedFrame * 0.02 * star.twinkleSpeed + star.phase;
        const twinkleOffset = shouldAnimate ? Math.sin(phaseProgress) * 55 : 0;
        const brightness = star.baseBrightness + twinkleOffset;
        const alpha = p.constrain(brightness, 0, 255);
        const offsetX = normalizedMouseX * parallaxStrength;
        const offsetY = normalizedMouseY * parallaxStrength;

        p.fill(LAVENDER_RGB.r, LAVENDER_RGB.g, LAVENDER_RGB.b, alpha);
        p.ellipse(star.x + offsetX, star.y + offsetY, star.size, star.size);
      }

      if (shouldAnimate && p.frameCount <= 180) {
        p.push();
        p.fill(255, 255, 255, 140);
        p.textSize(12);
        p.text(`${Math.round(p.frameRate())} fps`, 10, 20);
        p.pop();
      }
    };

    (p as unknown as { updateWithProps: (props: SketchProps) => void }).updateWithProps = (
      props: SketchProps,
    ) => {
      if (
        typeof props.prefersReducedMotion === "boolean" &&
        props.prefersReducedMotion !== prefersReducedMotion
      ) {
        prefersReducedMotion = props.prefersReducedMotion;
        console.debug("[Starfield] updateWithProps prefersReducedMotion:", prefersReducedMotion);
        generateStars(p);
        ensureLoopState(p);
      }
    };
  };
};

export function Starfield() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sketch = useMemo(() => createSketch(), []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    console.debug("[Starfield] React mount prefersReducedMotion:", motionQuery.matches);
    const updatePreference = (event: MediaQueryList | MediaQueryListEvent) => {
      const nextValue = "matches" in event ? event.matches : false;
      console.debug("[Starfield] media query change:", nextValue);
      setPrefersReducedMotion(nextValue);
    };

    updatePreference(motionQuery);

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", updatePreference);
    } else {
      motionQuery.addListener(updatePreference);
    }

    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener("change", updatePreference);
      } else {
        motionQuery.removeListener(updatePreference);
      }
    };
  }, []);

  useEffect(() => {
    console.debug("[Starfield] React prefersReducedMotion state:", prefersReducedMotion);
  }, [prefersReducedMotion]);

  return (
    <div className="pointer-events-none absolute inset-0">
      <ReactP5Wrapper sketch={sketch} prefersReducedMotion={prefersReducedMotion} />
    </div>
  );
}
