/* =====================================================================
   BENTO NOIR — Services page: live scope estimator
   Tier + add-ons → running total, timeline and a pre-filled link to the
   onboarding form on works.html (?tier=…&addons=…#start).
   ===================================================================== */
(() => {
  'use strict';

  const TIERS = {
    essential: { name: 'Essential', price: 4800, weeks: 2 },
    boutique:  { name: 'Boutique',  price: 9500, weeks: 3 },
    custom:    { name: 'Custom',    price: 16000, weeks: 4 },
  };

  const addons = Array.from(document.querySelectorAll('[data-addon]'));
  const radios = Array.from(document.querySelectorAll('[data-tier]'));
  const lines = document.querySelector('[data-summary-lines]');
  const total = document.querySelector('[data-summary-total]');
  const weeksEl = document.querySelector('[data-summary-weeks]');
  const cta = document.querySelector('[data-summary-cta]');
  if (!addons.length || !radios.length) return;

  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  let tier = 'boutique';
  let shown = TIERS[tier].price;

  // Count-up animation for the total
  let raf = 0;
  const animateTo = (target) => {
    cancelAnimationFrame(raf);
    const from = shown;
    const start = performance.now();
    const dur = window.BN.reduceMotion ? 0 : 600;
    const step = (now) => {
      const t = dur ? Math.min(1, (now - start) / dur) : 1;
      const e = 1 - Math.pow(1 - t, 4);
      shown = from + (target - from) * e;
      total.textContent = money(shown);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };

  const render = () => {
    const base = TIERS[tier];
    const picked = addons.filter((b) => b.getAttribute('aria-pressed') === 'true');
    let sum = base.price;
    let weeks = base.weeks;

    const rows = [`<li><span>${base.name} tier</span><span>${money(base.price)}</span></li>`];
    picked.forEach((b) => {
      const price = Number(b.dataset.price);
      sum += price;
      weeks += Number(b.dataset.weeks || 0);
      const name = b.querySelector('.h4').textContent;
      rows.push(`<li><span>+ ${name}</span><span>${money(price)}</span></li>`);
    });
    lines.innerHTML = rows.join('');
    animateTo(sum);

    const w = Math.ceil(weeks * 2) / 2;
    weeksEl.textContent = `Estimated timeline · ${w % 1 ? w.toFixed(1) : w}${tier === 'custom' ? '+' : ''} weeks`;

    const params = new URLSearchParams({ tier });
    if (picked.length) params.set('addons', picked.map((b) => b.dataset.addon).join(','));
    cta.href = `works.html?${params.toString()}#start`;
  };

  addons.forEach((b) => b.addEventListener('click', () => {
    b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
    render();
  }));

  const selectTier = (btn, focus) => {
    tier = btn.dataset.tier;
    radios.forEach((r) => {
      const on = r === btn;
      r.setAttribute('aria-checked', String(on));
      r.tabIndex = on ? 0 : -1;
    });
    if (focus) btn.focus();
    render();
  };
  radios.forEach((r, i) => {
    r.tabIndex = r.getAttribute('aria-checked') === 'true' ? 0 : -1;
    r.addEventListener('click', () => selectTier(r));
    r.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      selectTier(radios[(i + dir + radios.length) % radios.length], true);
    });
  });

  render();
})();
