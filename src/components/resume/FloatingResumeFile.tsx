import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { triggerDownloadFlyFromPoint } from "../../utils/animations";

const DRAG_THRESHOLD_PX = 8;
const WIDGET_W = 132;
const WIDGET_H = 112;
const MOBILE_WIDGET_W = 86;
/** Slightly generous so clamping doesn’t pin the widget too high on short viewports. */
const MOBILE_WIDGET_H = 92;
const MOBILE_BREAKPOINT_PX = 640;
/** Flush to right on small screens. */
const MOBILE_RIGHT_INSET = 10;
/** Top-right on viewports ≥ sm (Tailwind 640px). */
const DESKTOP_RIGHT_INSET = 18;
const DESKTOP_TOP_INSET = 300;

function isMobileViewport(width: number) {
  return width > 0 && width < MOBILE_BREAKPOINT_PX;
}

function clampToViewport(x: number, y: number) {
  const isMobile = isMobileViewport(window.innerWidth);
  const widgetW = isMobile ? MOBILE_WIDGET_W : WIDGET_W;
  const widgetH = isMobile ? MOBILE_WIDGET_H : WIDGET_H;
  const maxX = Math.max(8, window.innerWidth - widgetW - 8);
  const maxY = Math.max(8, window.innerHeight - widgetH - 8);
  return {
    x: Math.min(Math.max(8, x), maxX),
    y: Math.min(Math.max(8, y), maxY),
  };
}

function filenameFromHref(href: string): string {
  try {
    const path = href.split("?")[0] ?? href;
    const base = path.split("/").pop();
    return base && base.length > 0 ? base : "resume.pdf";
  } catch {
    return "resume.pdf";
  }
}

export const FloatingResumeFile: React.FC<{
  pdfHref: string;
  label?: string;
}> = ({ pdfHref, label = "Resume.pdf" }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const userPinnedRef = useRef(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const dragRef = useRef({
    pointerId: -1,
    startClientX: 0,
    startClientY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });

  useLayoutEffect(() => {
    const applyDefaultPosition = () => {
      if (userPinnedRef.current) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (isMobileViewport(vw)) {
        const x = vw - MOBILE_WIDGET_W - MOBILE_RIGHT_INSET;
        // Right of contact block; slightly higher than mid-viewport so it clears Summary text.
        const desiredY = Math.round(vh * 0.28 + 32);
        setPos(clampToViewport(x, desiredY));
      } else {
        const x = vw - WIDGET_W - DESKTOP_RIGHT_INSET;
        setPos(clampToViewport(x, DESKTOP_TOP_INSET));
      }
    };

    applyDefaultPosition();

    const onOrientationChange = () => {
      window.setTimeout(applyDefaultPosition, 200);
    };

    window.addEventListener("resize", applyDefaultPosition);
    window.addEventListener("orientationchange", onOrientationChange);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", applyDefaultPosition);

    return () => {
      window.removeEventListener("resize", applyDefaultPosition);
      window.removeEventListener("orientationchange", onOrientationChange);
      vv?.removeEventListener("resize", applyDefaultPosition);
    };
  }, []);

  const triggerDownload = useCallback(() => {
    const el = rootRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      triggerDownloadFlyFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    }
    const a = document.createElement("a");
    a.href = pdfHref;
    a.download = filenameFromHref(pdfHref);
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [pdfHref]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (pos === null) return;
      if (e.button !== 0) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        originX: pos.x,
        originY: pos.y,
        moved: false,
      };
    },
    [pos]
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== e.pointerId) return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - dragRef.current.startClientX;
    const dy = e.clientY - dragRef.current.startClientY;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
      dragRef.current.moved = true;
    }
    setPos(
      clampToViewport(dragRef.current.originX + dx, dragRef.current.originY + dy)
    );
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragRef.current.pointerId !== e.pointerId) return;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      dragRef.current.pointerId = -1;
      if (dragRef.current.moved) {
        userPinnedRef.current = true;
      } else {
        triggerDownload();
      }
    },
    [triggerDownload]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerDownload();
      }
    },
    [triggerDownload]
  );

  if (pos === null) return null;

  return (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-label={`Download resume (${label}). Drag to move.`}
      className="fixed z-[100] w-[86px] sm:w-[132px] select-none touch-none cursor-grab active:cursor-grabbing rounded-lg sm:rounded-xl border border-[color-mix(in_srgb,var(--brand)_35%,transparent)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-2 py-1.5 sm:px-3 sm:py-3 shadow-[0_8px_28px_-10px_color-mix(in_srgb,var(--brand)_40%,transparent)] sm:shadow-[0_12px_40px_-12px_color-mix(in_srgb,var(--brand)_40%,transparent)] backdrop-blur-sm transition-[box-shadow] hover:shadow-[0_16px_48px_-10px_color-mix(in_srgb,var(--brand)_45%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
      style={{
        left: pos.x,
        top: pos.y,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
        <div
          className="relative flex h-9 w-[1.85rem] sm:h-14 sm:w-11 items-end justify-center rounded-[3px] sm:rounded-sm border border-red-200/50 bg-gradient-to-b from-red-50 to-white dark:border-red-900/40 dark:from-red-950/80 dark:to-[color-mix(in_srgb,var(--surface)_95%,#450a0a)]"
          aria-hidden
        >
          <span className="absolute right-0 top-0 h-2 w-2 sm:h-3 sm:w-3 rounded-bl-sm bg-red-500/90 dark:bg-red-600" />
          <span className="mb-1 sm:mb-1.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-tight text-red-600 dark:text-red-400">
            PDF
          </span>
        </div>
        <span className="max-w-full truncate text-[9px] sm:text-xs font-medium leading-tight text-[var(--muted)]">
          <span className="sm:hidden">Resume</span>
          <span className="hidden sm:inline">{label}</span>
        </span>
        <span className="hidden sm:block text-[10px] leading-tight text-[var(--muted)] opacity-80">
          Drag · Click to download
        </span>
      </div>
    </div>
  );
};
