import React from "react";

/** Center point of the element that “throws” the flying file icon (px, viewport). */
export function triggerDownloadFlyFromPoint(centerX: number, centerY: number) {
  const startX = centerX;
  const startY = centerY;

  // Create an SVG file icon
  const icon = document.createElement("div");
  icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--brand, #3b82f6);"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  
  icon.style.position = "fixed";
  icon.style.left = `${startX - 16}px`;
  icon.style.top = `${startY - 16}px`;
  icon.style.zIndex = "99999";
  icon.style.pointerEvents = "none";
  icon.style.filter = "drop-shadow(0 4px 12px rgba(0,0,0,0.15))";
  
  document.body.appendChild(icon);

  // Browsers usually display downloads in top-right (Safari, newer Chrome)
  // or top-bottom if we just sweep it down on mobile.
  // We'll sweep it to top-right corner on desktop, bottom center on mobile to simulate "going into downloads"
  const isMobile = window.innerWidth < 768;
  const endX = isMobile ? window.innerWidth / 2 : window.innerWidth - 40;
  const endY = isMobile ? window.innerHeight - 40 : 40;
  
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  // Web Animations API
  const animation = icon.animate([
    { transform: 'translate(0, 0) scale(0.5)', opacity: 0 },
    { transform: 'translate(0, -30px) scale(1.1)', opacity: 1, offset: 0.2 },
    { transform: `translate(${deltaX}px, ${deltaY}px) scale(0.2)`, opacity: 0 }
  ], {
    duration: 800,
    easing: 'cubic-bezier(0.5, 0, 0.2, 1)' 
  });

  animation.onfinish = () => {
    icon.remove();
  };
}

export const triggerDownloadAnimation = (e: React.MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  triggerDownloadFlyFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
};
