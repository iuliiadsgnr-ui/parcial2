/* =====================================================================
   BENTO NOIR — Process page
   01 Timeline rail that fills with scroll + active step
   02 Sprint chart (tabs switch between tier schedules)
   ===================================================================== */
(() => {
  'use strict';
  const { clamp, onScroll } = window.BN;

  /* ---------- 01 · Timeline ---------- */
  const timeline = document.querySelector('[data-timeline]');
  if (timeline) {
    const steps = Array.from(timeline.querySelectorAll('[data-step]'));
    onScroll(() => {
      const r = timeline.getBoundingClientRect();
      const mark = window.innerHeight * 0.55; // reading line
      timeline.style.setProperty('--rail-p', clamp((mark - r.top) / r.height).toFixed(4));
      steps.forEach((s) => s.classList.toggle('is-active', s.getBoundingClientRect().top < mark));
    });
  }

  /* ---------- 02 · Sprint chart ---------- */
  // Working days. Segments are [startDay, endDay] inclusive.
  const PLANS = {
    essential: {
      days: 10,
      rows: [
        ['Discovery & Brief', 'Days 1–2', [[1, 2]], [[2, 2]]],
        ['Art Direction', 'Days 3–4', [[3, 4]], [[4, 4]]],
        ['Hero Core Concept', 'Days 5–6', [[5, 6]], [[6, 6]]],
        ['Full Build & Handover', 'Days 7–10', [[7, 10]], [[9, 9]]],
      ],
    },
    boutique: {
      days: 15,
      rows: [
        ['Discovery & Brief', 'Days 1–3', [[1, 3]], [[3, 3]]],
        ['Art Direction', 'Days 4–6', [[4, 6]], [[6, 6]]],
        ['Hero Core Concept', 'Days 7–9', [[7, 9]], [[9, 9]]],
        ['Full Build & Handover', 'Days 10–15', [[10, 15]], [[13, 13]]],
      ],
    },
    custom: {
      days: 20,
      rows: [
        ['Discovery & Brief', 'Days 1–3', [[1, 3]], [[3, 3]]],
        ['Art Direction', 'Days 4–7', [[4, 7]], [[7, 7]]],
        ['Hero Core Concept', 'Days 8–11', [[8, 11]], [[11, 11]]],
        ['Full Build & Handover', 'Days 12–20 · sprints', [[12, 20]], [[15, 15], [18, 18]]],
      ],
    },
  };

  const sprint = document.querySelector('[data-sprint]');
  if (!sprint) return;
  const chart = sprint.querySelector('[data-sprint-chart]');
  const tabs = Array.from(sprint.querySelectorAll('[data-plan]'));

  const build = (key) => {
    const plan = PLANS[key];
    const cols = plan.days;
    const weeks = Math.ceil(cols / 5);
    let html = `<div class="sprint__scale" style="--cols:${cols}"><span>Phase</span>`;
    for (let w = 0; w < weeks; w++) {
      html += `<span style="grid-column:${2 + w * 5} / span ${Math.min(5, cols - w * 5)}">Week ${w + 1}</span>`;
    }
    html += '</div>';

    plan.rows.forEach(([label, when, work, reviews]) => {
      html += `<div class="sprint__row" style="--cols:${cols}"><span class="sprint__label">${label}<small>${when}</small></span>`;
      work.forEach(([a, b]) => {
        // the studio bar runs up to (not over) the review day
        const end = reviews.some(([r]) => r === b) && b > a ? b - 1 : b;
        html += `<span class="sprint__seg" style="grid-column:${a + 1} / ${end + 2}">${end - a >= 1 ? 'Sprint' : ''}</span>`;
      });
      reviews.forEach(([a, b]) => {
        html += `<span class="sprint__seg is-review" style="grid-column:${a + 1} / ${b + 2}" title="Client review">R</span>`;
      });
      html += '</div>';
    });
    chart.innerHTML = html;
  };

  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (focus) tab.focus();
    sprint.classList.add('is-switching');
    build(tab.dataset.plan);
    // next frame: let the bars grow back in
    requestAnimationFrame(() => requestAnimationFrame(() => sprint.classList.remove('is-switching')));
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      select(tabs[(i + dir + tabs.length) % tabs.length], true);
    });
  });

  select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0]);
})();
