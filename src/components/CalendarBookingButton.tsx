import React, { useEffect, useRef } from "react";

const SCHEDULING_SCRIPT_URL =
  "https://calendar.google.com/calendar/scheduling-button-script.js";
const SCHEDULING_STYLE_URL =
  "https://calendar.google.com/calendar/scheduling-button-script.css";
const SCHEDULING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3kbFh9U_DXKIKKO9_Ktcfd2VyoQmCRmp5p1DF0YWFcUqNCisOfCSSvGRSiN91aT6Ay60eLhGyN?gv=true";
const LOADED_ATTR = "data-gcal-booking-mounted";
const BRAND_CHANGE_EVENT = "portfolio:brand-change";

declare global {
  interface Window {
    calendar?: {
      schedulingButton?: {
        load: (options: {
          url: string;
          color?: string;
          label?: string;
          target: HTMLElement;
        }) => void;
      };
    };
  }
}

export const CalendarBookingButton: React.FC = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const lastColorRef = useRef<string>("");

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    if (!document.querySelector(`link[href="${SCHEDULING_STYLE_URL}"]`)) {
      const styleTag = document.createElement("link");
      styleTag.rel = "stylesheet";
      styleTag.href = SCHEDULING_STYLE_URL;
      document.head.appendChild(styleTag);
    }

    const resolveBrandColor = () => {
      const cssBrand = getComputedStyle(document.documentElement)
        .getPropertyValue("--brand")
        .trim();

      return cssBrand || "#039BE5";
    };

    const applyColorToRenderedButtons = (color: string) => {
      const currentTarget = targetRef.current;
      if (!currentTarget) return;

      const clickableNodes = currentTarget.querySelectorAll<HTMLElement>(
        "button, a, [role='button']"
      );

      clickableNodes.forEach((node) => {
        node.style.backgroundColor = color;
        node.style.borderColor = color;
      });
    };

    const mountButton = (color: string) => {
      const currentTarget = targetRef.current;
      if (!window.calendar?.schedulingButton?.load || !currentTarget) return;

      currentTarget.setAttribute(LOADED_ATTR, "true");
      currentTarget.innerHTML = "";
      lastColorRef.current = color;
      window.calendar.schedulingButton.load({
        url: SCHEDULING_URL,
        color,
        label: "Book an appointment",
        target: currentTarget,
      });
    };

    const loadButton = () => {
      const currentTarget = targetRef.current;
      if (!window.calendar?.schedulingButton?.load || !currentTarget) return;
      const brandColor = resolveBrandColor();
      const alreadyMounted = currentTarget.getAttribute(LOADED_ATTR) === "true";

      if (alreadyMounted) {
        if (lastColorRef.current !== brandColor) {
          mountButton(brandColor);
        }
        return;
      }

      mountButton(brandColor);
    };

    const ensureScriptLoaded = async () => {
      if (window.calendar?.schedulingButton?.load) {
        loadButton();
        return;
      }

      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src="${SCHEDULING_SCRIPT_URL}"]`
      );

      if (existingScript) {
        await new Promise<void>((resolve) => {
          existingScript.addEventListener("load", () => resolve(), { once: true });
        });
        loadButton();
        return;
      }

      await new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = SCHEDULING_SCRIPT_URL;
        script.async = true;
        script.addEventListener("load", () => resolve(), { once: true });
        document.body.appendChild(script);
      });

      loadButton();
    };

    void ensureScriptLoaded();

    const observer = new MutationObserver(() => {
      const currentColor = resolveBrandColor();
      if (currentColor === lastColorRef.current) return;
      lastColorRef.current = currentColor;
      applyColorToRenderedButtons(currentColor);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    const onBrandChange = () => {
      // Wait one frame so CSS variable updates are committed.
      requestAnimationFrame(() => {
        const currentColor = resolveBrandColor();
        if (currentColor === lastColorRef.current) return;
        loadButton();
        // Keep best-effort inline styling for implementations that expose normal DOM buttons.
        applyColorToRenderedButtons(currentColor);
      });
    };

    window.addEventListener(BRAND_CHANGE_EVENT, onBrandChange);

    return () => {
      observer.disconnect();
      window.removeEventListener(BRAND_CHANGE_EVENT, onBrandChange);
    };
  }, []);

  return <div ref={targetRef} aria-label="Book a calendar appointment" />;
};
