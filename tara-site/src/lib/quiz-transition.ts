/** Scroll all scrollable ancestors (including embedded containers), then unlock. */
export function focusQuizHeading(target: HTMLElement, onComplete: () => void) {
  let frame = 0;
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(frame);
    clearTimeout(watchdog);
    onComplete();
  };

  // CSS on the document uses smooth scrolling, so "auto" would still animate.
  // "instant" explicitly respects reduced motion, including nested scroll owners.
  const scroll = (behavior: ScrollBehavior) => {
    try {
      target.scrollIntoView({ behavior, block: "start", inline: "nearest" });
    } catch {
      // Older browsers may not support the options dictionary.
      target.scrollIntoView(true);
    }
  };

  // This runs after React's committed render, not from the selection handler.
  frame = requestAnimationFrame(() => {
    target.focus({ preventScroll: true });
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroll(reducedMotion ? "instant" : "smooth");
    let previousTop = target.getBoundingClientRect().top;
    let previousLeft = target.getBoundingClientRect().left;
    let stableSince = performance.now();

    const observe = (now: number) => {
      const { top, left } = target.getBoundingClientRect();
      if (Math.abs(top - previousTop) > 0.5 || Math.abs(left - previousLeft) > 0.5) {
        stableSince = now;
      }
      previousTop = top;
      previousLeft = left;
      // A brief quiet period covers deferred scroll starts and touch momentum.
      // Geometry, rather than scrollend, also works on older iOS Safari.
      if (now - stableSince >= 120) finish();
      else frame = requestAnimationFrame(observe);
    };
    frame = requestAnimationFrame(observe);
  });

  // Safety only: interrupted animations/background tabs must never strand the lock.
  // Finish alignment without animation before releasing it if settlement stalls.
  const watchdog = setTimeout(() => {
    try {
      scroll("instant");
    } finally {
      finish();
    }
  }, 1500);

  return () => {
    finished = true;
    cancelAnimationFrame(frame);
    clearTimeout(watchdog);
  };
}
