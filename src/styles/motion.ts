export const calmMotion = {
  easeOutQuart: [0.215, 0.61, 0.355, 1],
  easeInOutQuint: [0.86, 0, 0.07, 1],
  spring: {
    type: "spring" as const,
    stiffness: 90,
    damping: 22,
    mass: 1,
    restDelta: 0.002,
    restSpeed: 0.01
  }
} as const;

export type CalmMotionKey = keyof typeof calmMotion;

export const easeCalm = "cubic-bezier(0.215, 0.61, 0.355, 1)";
