"use client";

import { useEffect } from "react";

/**
 * Renders nothing - just attaches an IntersectionObserver on mount that
 * adds `.is-visible` to any `.reveal` element as it scrolls into view.
 * Ported from the original site's js/main.js scroll-reveal behaviour.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
