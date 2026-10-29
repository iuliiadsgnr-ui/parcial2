/* =====================================================================
   BENTO NOIR — Home page: Selected Works stacking cards
   Cards are position:sticky (CSS does the pinning, no scroll-jacking).
   JS only reads positions to scale/dim covered cards and drive the
   counter, progress bar and project list in the pinned left column.
   ===================================================================== */
(() => {
  'use strict';
  const { clamp, onScroll, reduceMotion } = window.BN;

  const cards = Array.from(document.querySelectorAll('[data-stack-card]'));
  if (!cards.length) return;
  const inners = cards.map((c) => c.querySelector('.stack-card__inner'));
  const items = Array.from(document.querySelectorAll('[data-works-item]'));
  const now = document.querySelector('[data-works-now]');
  const aside = document.querySelector('.works-home__aside');
  let lastActive = -1;

  onScroll(() => {
    let active = 0;
    for (let i = 0; i < cards.length; i++) {
      const cur = cards[i].getBoundingClientRect();
      const next = cards[i + 1] ? cards[i + 1].getBoundingClientRect() : null;
      // 0 → next card is far below · 1 → next card fully stacked on top
      const cover = next ? clamp(1 - (next.top - cur.top) / cur.height) : 0;
      if (!reduceMotion) {
        inners[i].style.transform = cover > 0 ? `scale(${(1 - cover * 0.06).toFixed(4)})` : '';
        inners[i].style.setProperty('--veil', (cover * 0.32).toFixed(3));
      }
      if (cover > 0.55) active = i + 1;
    }
    active = Math.min(active, cards.length - 1);

    if (active !== lastActive) {
      lastActive = active;
      items.forEach((li, i) => li.classList.toggle('is-active', i === active));
      if (now) now.textContent = String(active + 1).padStart(2, '0');
      if (aside) aside.style.setProperty('--works-p', ((active + 1) / cards.length).toFixed(3));
    }
  });
})();
