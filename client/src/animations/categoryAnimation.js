import { getGsap, prefersReducedMotion } from "./gsapConfig";

/**
 * Shared one-time ScrollTrigger reveal. Reuse this for future card, product,
 * or editorial sections by supplying a trigger, targets, and transform-only
 * start state.
 */
export const createScrollReveal = ({
  trigger,
  targets,
  from,
  duration = 0.65,
  stagger = 0.1,
  start = "top 82%",
}) => {
  const gsap = getGsap();
  const validTargets = targets.filter(Boolean);

  if (!trigger || validTargets.length === 0) return null;

  if (prefersReducedMotion()) {
    gsap.set(validTargets, { autoAlpha: 1, clearProps: "transform" });
    return null;
  }

  return gsap.fromTo(validTargets, from, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration,
    stagger,
    ease: "power3.out",
    scrollTrigger: {
      trigger,
      start,
      once: true,
    },
  });
};

/** Reusable category-card preset built on createScrollReveal. */
export const createCategoryReveal = ({ section, cards }) =>
  createScrollReveal({
    trigger: section,
    targets: cards,
    from: { autoAlpha: 0, y: 60, scale: 0.95 },
  });
