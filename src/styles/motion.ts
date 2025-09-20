const duration120 = 0.12;
const duration160 = 0.16;
const duration180 = 0.18;
const duration240 = 0.24;
const duration320 = 0.32;
const duration400 = 0.4;

export const MotionDurations = {
  duration120,
  duration160,
  duration180,
  duration240,
  duration320,
  duration400,
  transitionIn: duration180,
  transitionOut: duration240,
  transitionSnap: duration320,
} as const;

export const MotionEasings = {
  tIn: [0.32, 0, 0.67, 0] as const,
  tOut: [0.33, 1, 0.68, 1] as const,
  tSnap: [0.16, 1, 0.3, 1] as const,
  calm: [0.215, 0.61, 0.355, 1] as const,
  calmInOut: [0.86, 0, 0.07, 1] as const,
} as const;

export function sumDurations(...durations: number[]): number {
  return durations.reduce((total, value) => total + value, 0);
}

export const calmMotion = {
  easeOutQuart: MotionEasings.calm,
  easeInOutQuint: MotionEasings.calmInOut,
  spring: {
    type: "spring" as const,
    stiffness: 90,
    damping: 22,
    mass: 1,
    restDelta: 0.002,
    restSpeed: 0.01,
  },
} as const;

export type CalmMotionKey = keyof typeof calmMotion;

export const easeCalm = "cubic-bezier(0.215, 0.61, 0.355, 1)";
