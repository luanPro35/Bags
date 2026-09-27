"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Clean exponential ease — never overshoots, plays well with ScrollTrigger scrub
    const easeExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const lenis = new Lenis({
      duration: 1.6,
      easing: easeExpo,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.75,
      touchMultiplier: 1.8,
      infinite: false,
    });

    // Sync Lenis scroll position to GSAP ScrollTrigger on every frame
    lenis.on("scroll", () => ScrollTrigger.update());

    const gsapTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(gsapTicker);
    gsap.ticker.lagSmoothing(0); // disable lag compensation for butter-smooth frames

    return () => {
      gsap.ticker.remove(gsapTicker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
