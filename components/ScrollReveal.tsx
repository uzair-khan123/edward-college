"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Handles scroll reveal animations across page transitions.
 * Includes a safety timeout fallback so content is NEVER trapped invisible.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));

    // Safety fallback: reveal all elements after 400ms so content is never hidden if observer stalls
    const fallbackTimer = setTimeout(() => {
      elements.forEach((el) => el.classList.add("is-visible"));
    }, 400);

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
