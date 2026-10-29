/* =====================================================================
   BENTO NOIR — Works & Contact page
   01 Case-study data       04 Deep links (works.html#slug)
   02 Gallery + filters     05 FAQ accordion
   03 Modal (native dialog) 06 Guided onboarding form
   ===================================================================== */
(() => {
  'use strict';
  const { STUDIO, observeReveal, bindMagnetic, reduceMotion } = window.BN;

  /* ---------------------------------------------------------------
     01 · Case studies — placeholder content; swap copy, specs and
     the CSS art for real projects and media when they're ready.
     --------------------------------------------------------------- */
  const CASES = [
    {
      slug: 'noir-commerce', name: 'Noir commerce', cat: 'ecommerce', catLabel: 'E-commerce', year: 2026,
      client: 'Ready-to-wear fashion label', tier: 'Custom', timeline: '4 weeks',
      tags: ['Art direction', 'Headless commerce', 'Motion'],
      summary: 'A monochrome storefront where the product does all the talking. We stripped the catalogue back to three-up grids, gave every garment an arched frame and cut checkout down to a single, distraction-free step.',
      detail: 'Product pages load the hero image first and everything else later, so the site feels instant even on mobile networks. Motion is reserved for one moment: the garment rising into its frame as you arrive.',
      stack: 'HTML · CSS · JS · Storefront API · Netlify', type: 'Satoshi / Geist Mono',
      palette: ['#0F1110', '#ECE7DC', '#7D8B7F', '#F4F1EA'],
      metrics: [['0.9s', 'Largest paint'], ['98', 'Lighthouse'], ['410 KB', 'Page weight'], ['9', 'Templates']],
      art: 'noir',
    },
    {
      slug: 'brutal-portfolio', name: 'Brutal portfolio', cat: 'portfolio', catLabel: 'Portfolio', year: 2026,
      client: 'Independent architecture practice', tier: 'Boutique', timeline: '3 weeks',
      tags: ['Brutalist grid', 'Typography', 'Static'],
      summary: 'A portfolio built like a set of drawings. The 8-column grid is left exposed, projects read as plans and sections, and oversized type does the work that photography usually does.',
      detail: 'Every project page follows the same sheet structure, so the architect can add new work by duplicating one file. No CMS, no plugins, nothing to update.',
      stack: 'HTML · CSS · JS · Cloudflare Pages', type: 'Satoshi Bold / Geist Mono',
      palette: ['#ECE8DF', '#161817', '#7D8B7F', '#FDFBF7'],
      metrics: [['0.7s', 'Largest paint'], ['100', 'Lighthouse'], ['290 KB', 'Page weight'], ['14', 'Projects']],
      art: 'brutal',
    },
    {
      slug: 'editorial-journal', name: 'Editorial journal', cat: 'editorial', catLabel: 'Editorial', year: 2025,
      client: 'Independent publisher', tier: 'Custom', timeline: '4 weeks',
      tags: ['Type system', 'Long-form', 'Reading UX'],
      summary: 'A typographic monograph series where long-form reading sets the pace. Generous margins, a strict baseline grid and drop caps borrowed from print.',
      detail: 'A fluid type scale keeps line length between 60 and 72 characters on every screen. Motion only marks the turn of a chapter, never the reading itself.',
      stack: 'HTML · CSS · JS · Git-based CMS', type: 'Satoshi / Geist Mono',
      palette: ['#FDFBF7', '#161817', '#586B5A', '#E9E4D8'],
      metrics: [['66', 'Chars / line'], ['99', 'Lighthouse'], ['AA', 'WCAG 2.2'], ['7', 'Issues live']],
      art: 'editorial',
    },
    {
      slug: 'studio-index', name: 'Studio index', cat: 'product', catLabel: 'Product', year: 2025,
      client: 'Design collective', tier: 'Custom', timeline: '4 weeks',
      tags: ['Product UI', 'Dark mode', 'Data'],
      summary: 'A dark-mode operations index for a design collective: projects, invoices and capacity, readable at a glance and fast enough to keep open all day.',
      detail: 'A monospaced table system, keyboard-first navigation and a command prompt for filters. Built as a static front end on top of the collective\'s existing spreadsheet data.',
      stack: 'HTML · CSS · JS · Sheets API', type: 'Geist Mono / Satoshi',
      palette: ['#101211', '#F4F1EA', '#8FA391', '#7D8B7F'],
      metrics: [['< 50ms', 'Filter time'], ['100%', 'Keyboard'], ['3', 'Views'], ['12', 'Active users']],
      art: 'index',
    },
    {
      slug: 'quiet-room', name: 'Quiet Room', cat: 'landing', catLabel: 'Landing', year: 2026,
      client: 'Wellness DTC brand', tier: 'Essential', timeline: '2 weeks',
      tags: ['Launch page', 'Waitlist', 'Calm motion'],
      summary: 'A launch landing for a sleep-ritual product. One soft object, one sentence and one action: join the waitlist.',
      detail: 'The orb breathes at a resting heart rate. The page is under 200 KB and ships with a static fallback for reduced-motion users.',
      stack: 'HTML · CSS · JS · Netlify Forms', type: 'Satoshi / Geist Mono',
      palette: ['#E9E4D8', '#FDFBF7', '#B9B19F', '#161817'],
      metrics: [['0.6s', 'Largest paint'], ['100', 'Lighthouse'], ['180 KB', 'Page weight'], ['1', 'Action']],
      art: 'quiet',
    },
    {
      slug: 'field-notes', name: 'Field Notes', cat: 'product', catLabel: 'Product', year: 2026,
      client: 'Early-stage SaaS startup', tier: 'Custom', timeline: '4 weeks',
      tags: ['UI system', 'Tokens', 'Documentation'],
      summary: 'A UI system for a startup that needed to ship marketing pages weekly without a designer in the loop.',
      detail: 'Forty-two components, a token file shared between Figma and CSS, and a living style guide that doubles as the team\'s onboarding doc.',
      stack: 'Figma · CSS custom properties · JS', type: 'Satoshi / Geist Mono',
      palette: ['#121413', '#F4F1EA', '#586B5A', '#7D8B7F'],
      metrics: [['42', 'Components'], ['1', 'Token source'], ['AA', 'WCAG 2.2'], ['Weekly', 'Ship cadence']],
      art: 'field',
    },
  ];

  const ART = {
    noir: () => `<div class="art art--noir" aria-hidden="true"><span class="art__word">NOIR</span><div class="art__products"><i data-price="€ 380"></i><i data-price="€ 620"></i><i data-price="€ 240"></i></div><span class="art__meta">SS27 — 03 / 48</span><span class="art__meta art__meta--r">Checkout · 1 step</span></div>`,
    brutal: () => `<div class="art art--brutal" aria-hidden="true"><span class="art__grid"></span><span class="art__plan"></span><span class="art__word">BRVT</span><span class="art__meta">Plan 1:200 · Concrete</span></div>`,
    editorial: () => `<div class="art art--editorial" aria-hidden="true"><span class="art__cap">E</span><span class="art__head">On silence, margins and the weight of a single line.</span><span class="art__rule"></span><div class="art__cols"><i></i><i></i><i></i></div><span class="art__meta">Issue 07 — Typography</span></div>`,
    index: () => `<div class="art art--index" aria-hidden="true"><div class="art__bar"><span>Studio index — v2.4</span><span>12 active</span></div><div class="art__rows"><span><b>ID</b><b>Client</b><b>Stage</b><b>Status</b></span><span><b>BN-041</b><b>Maison Arlet</b><b>Build</b><b class="live">Live</b></span><span><b>BN-040</b><b>Atelier Ruiz</b><b>Handover</b><b>Done</b></span><span><b>BN-039</b><b>Kiln &amp; Co.</b><b>Concept</b><b class="live">Live</b></span><span><b>BN-038</b><b>Ostra Labs</b><b>Discovery</b><b>Queued</b></span></div><span class="art__prompt">&gt; index --filter=active <span class="cursor"></span></span></div>`,
    quiet: () => `<div class="art art--quiet" aria-hidden="true"><span class="art__orb"></span><span class="art__word">Rest is a ritual.</span><span class="art__meta">Waitlist · 01</span></div>`,
    field: () => `<div class="art art--field" aria-hidden="true"><div class="art__tiles"><i class="t-btn"></i><i class="t-toggle"></i><i class="t-type"></i><i class="t-swatch"></i><i class="t-input"></i><i class="t-grid"></i></div><span class="art__meta">Tokens · 42 components</span></div>`,
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');

  /* ---------------------------------------------------------------
     02 · Gallery + filters
     --------------------------------------------------------------- */
  const gallery = document.querySelector('[data-gallery]');
  const filtersEl = document.querySelector('[data-filters]');
  const countEl = document.querySelector('[data-filter-count]');

  if (gallery) {
    gallery.innerHTML = CASES.map((c, i) => `
      <article class="case" data-cat="${c.cat}" data-reveal style="--d:${(i % 2) * 120}ms" id="case-${c.slug}">
        <button class="case__open" type="button" data-open="${c.slug}" aria-label="Open case study: ${esc(c.name)}">
          ${ART[c.art]()}
          <span class="case__hint">View case <span aria-hidden="true">↗</span></span>
        </button>
        <div class="case__meta">
          <span class="case__n">${pad(i + 1)}</span>
          <h3 class="h3">${esc(c.name)}</h3>
          <span class="tag">${esc(c.catLabel)} · ${c.year}</span>
          <div class="case__tags">${c.tags.map((t) => `<span class="pill-tag">${esc(t)}</span>`).join('')}</div>
        </div>
      </article>`).join('');

    const cats = [['all', 'All']].concat(
      [...new Map(CASES.map((c) => [c.cat, c.catLabel])).entries()]
    );
    filtersEl.innerHTML = cats.map(([key, label]) => {
      const n = key === 'all' ? CASES.length : CASES.filter((c) => c.cat === key).length;
      return `<button class="chip" type="button" aria-pressed="${key === 'all'}" data-filter="${key}">${label} <span class="count">${pad(n)}</span></button>`;
    }).join('');

    const cards = Array.from(gallery.querySelectorAll('.case'));
    const setFilter = (key) => {
      filtersEl.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === key)));
      let shown = 0;
      cards.forEach((card) => {
        const on = key === 'all' || card.dataset.cat === key;
        card.classList.toggle('is-hidden', !on);
        if (on) {
          shown++;
          if (!reduceMotion) {
            card.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
              { duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', delay: (shown - 1) * 60, fill: 'backwards' });
          }
        }
      });
      countEl.textContent = `Showing ${pad(shown)} of ${pad(CASES.length)}`;
    };
    filtersEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-filter]');
      if (b) setFilter(b.dataset.filter);
    });
    setFilter('all');
    observeReveal(gallery);
  }

  /* ---------------------------------------------------------------
     03 · Modal
     --------------------------------------------------------------- */
  const modal = document.querySelector('[data-modal]');
  const modalBody = modal && modal.querySelector('[data-modal-body]');
  const modalCount = modal && modal.querySelector('[data-modal-count]');
  let current = -1;
  let lastFocus = null;

  const renderCase = (i) => {
    const c = CASES[i];
    current = i;
    modalCount.textContent = `${pad(i + 1)} / ${pad(CASES.length)} · ${c.catLabel}`;
    modalBody.innerHTML = `
      <div class="case-modal__visual" data-media-slot>${ART[c.art]()}</div>
      <div class="case-modal__body">
        <div class="case-modal__intro">
          <p class="tag"><span class="idx">${pad(i + 1)}</span> ${esc(c.client)} · ${c.year}</p>
          <h2 class="h2" id="modal-title">${esc(c.name)}</h2>
          <p>${esc(c.summary)}</p>
          <p>${esc(c.detail)}</p>
          <div class="case__tags" style="margin:0">${c.tags.map((t) => `<span class="pill-tag">${esc(t)}</span>`).join('')}</div>
        </div>
        <div class="case-modal__specs">
          <p class="tag" style="margin-bottom:12px">Technical sheet</p>
          <dl class="specs">
            <div><dt>Client</dt><dd>${esc(c.client)}</dd></div>
            <div><dt>Tier</dt><dd>${esc(c.tier)}</dd></div>
            <div><dt>Timeline</dt><dd>${esc(c.timeline)}</dd></div>
            <div><dt>Stack</dt><dd>${esc(c.stack)}</dd></div>
            <div><dt>Type</dt><dd>${esc(c.type)}</dd></div>
            <div><dt>Palette</dt><dd><span class="swatches">${c.palette.map((p) => `<i style="background:${p}" title="${p}"></i>`).join('')}</span></dd></div>
          </dl>
        </div>
        <div class="metrics">${c.metrics.map(([v, l]) => `<div><strong>${esc(v)}</strong><span class="tag">${esc(l)}</span></div>`).join('')}</div>
      </div>`;
    modal.querySelector('.case-modal__scroll').scrollTop = 0;
    history.replaceState(null, '', `#${c.slug}`);
  };

  const openCase = (slug) => {
    const i = CASES.findIndex((c) => c.slug === slug);
    if (i < 0 || !modal) return;
    lastFocus = document.activeElement;
    renderCase(i);
    if (!modal.open) {
      modal.showModal();
      document.documentElement.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (!modal || !modal.open) return;
    const finish = () => {
      modal.classList.remove('is-closing');
      modal.close();
    };
    if (reduceMotion) finish();
    else {
      modal.classList.add('is-closing');
      setTimeout(finish, 280);
    }
  };

  if (modal) {
    modal.addEventListener('close', () => {
      document.documentElement.style.overflow = '';
      history.replaceState(null, '', location.pathname + location.search);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });
    modal.addEventListener('cancel', (e) => { e.preventDefault(); closeModal(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    modal.querySelector('[data-modal-close]').addEventListener('click', closeModal);
    modal.querySelector('[data-modal-prev]').addEventListener('click', () => renderCase((current - 1 + CASES.length) % CASES.length));
    modal.querySelector('[data-modal-next]').addEventListener('click', () => renderCase((current + 1) % CASES.length));
    modal.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea')) return;
      if (e.key === 'ArrowRight') renderCase((current + 1) % CASES.length);
      if (e.key === 'ArrowLeft') renderCase((current - 1 + CASES.length) % CASES.length);
    });
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open]');
      if (btn) openCase(btn.dataset.open);
    });
  }

  /* ---------------------------------------------------------------
     04 · Deep links — header dropdown + home cards use works.html#slug
     --------------------------------------------------------------- */
  const fromHash = () => {
    const slug = decodeURIComponent(location.hash.slice(1));
    if (CASES.some((c) => c.slug === slug)) openCase(slug);
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();

  /* ---------------------------------------------------------------
     05 · FAQ accordion (one open at a time)
     --------------------------------------------------------------- */
  const faq = document.querySelector('[data-faq]');
  if (faq) {
    faq.querySelectorAll('.faq-item').forEach((item, i) => {
      const q = item.querySelector('.faq-item__q');
      const a = item.querySelector('.faq-item__a');
      a.id = `faq-a-${i + 1}`;
      q.setAttribute('aria-controls', a.id);
      q.addEventListener('click', () => {
        const open = !item.classList.contains('is-open');
        faq.querySelectorAll('.faq-item.is-open').forEach((o) => {
          o.classList.remove('is-open');
          o.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
        });
        item.classList.toggle('is-open', open);
        q.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ---------------------------------------------------------------
     06 · Guided onboarding form
     Static by default: builds a brief and opens the visitor's email
     client. Set data-endpoint on the <form> to POST it instead
     (Formspree, Netlify Forms, a serverless function…).
     --------------------------------------------------------------- */
  const section = document.querySelector('.onboard');
  const panel = document.querySelector('[data-onboard]');
  if (!panel) return;
  const form = panel.querySelector('form');
  const sets = Array.from(form.querySelectorAll('[data-fieldset]'));
  const labels = Array.from(document.querySelectorAll('[data-step-label]'));
  const back = form.querySelector('[data-back]');
  const next = form.querySelector('[data-next]');
  const nextLabel = form.querySelector('[data-next-label]');
  const stepCount = form.querySelector('[data-step-count]');
  const progress = form.querySelector('[data-progress]');
  const briefEl = panel.querySelector('[data-brief]');
  const sendBtn = panel.querySelector('[data-send-brief]');
  let step = 0;

  // Prefill from services.html (?tier=boutique&addons=shader,scroll)
  const params = new URLSearchParams(location.search);
  const tier = params.get('tier');
  if (tier) {
    const r = form.querySelector(`input[name="tier"][value="${CSS.escape(tier)}"]`);
    if (r) r.checked = true;
  }
  (params.get('addons') || '').split(',').filter(Boolean).forEach((a) => {
    const cb = form.querySelector(`input[name="addons"][value="${CSS.escape(a)}"]`);
    if (cb) cb.checked = true;
  });

  const showStep = (n, focus = true) => {
    step = n;
    sets.forEach((s, i) => s.classList.toggle('is-current', i === n));
    labels.forEach((l, i) => {
      l.classList.toggle('is-current', i === n);
      l.classList.toggle('is-done', i < n);
    });
    back.hidden = n === 0;
    nextLabel.textContent = n === sets.length - 1 ? 'Build my brief' : 'Continue';
    stepCount.textContent = `Step ${n + 1} of ${sets.length}`;
    progress.style.setProperty('--p', ((n + 1) / sets.length).toFixed(3));
    if (focus) {
      const first = sets[n].querySelector('input, select, textarea');
      if (first) first.focus({ preventScroll: true });
    }
  };

  const validate = (fs) => {
    let ok = true;
    fs.querySelectorAll('input, textarea, select').forEach((el) => {
      const field = el.closest('.field');
      const err = field && field.querySelector('.field__error');
      if (!err) return;
      let msg = '';
      if (el.required && !el.value.trim()) msg = 'This field is required.';
      else if (el.type === 'email' && el.value && !el.checkValidity()) msg = 'Please enter a valid email address.';
      else if (el.type === 'url' && el.value && !/^https?:\/\/\S+\.\S+/.test(el.value)) msg = 'Use a full address, e.g. https://example.com';
      err.textContent = msg;
      field.classList.toggle('is-invalid', !!msg);
      el.setAttribute('aria-invalid', String(!!msg));
      if (msg && ok) { el.focus(); ok = false; }
    });
    return ok;
  };

  const collect = () => {
    const d = new FormData(form);
    return {
      name: d.get('name'), email: d.get('email'), company: d.get('company') || '—', website: d.get('website') || '—',
      role: d.get('role'), type: d.get('type'), tier: d.get('tier'), addons: d.getAll('addons'),
      brief: d.get('brief'), budget: d.get('budget'), launch: d.get('launch'), source: d.get('source') || '—',
    };
  };

  const briefText = (v) => [
    `NEW PROJECT BRIEF — BENTO NOIR`,
    ``,
    `Name:     ${v.name}`,
    `Email:    ${v.email}`,
    `Company:  ${v.company}`,
    `Website:  ${v.website}`,
    `Role:     ${v.role}`,
    ``,
    `Type:     ${v.type}`,
    `Tier:     ${v.tier}`,
    `Add-ons:  ${v.addons.length ? v.addons.join(', ') : 'none'}`,
    `Budget:   ${v.budget}`,
    `Launch:   ${v.launch}`,
    `Source:   ${v.source}`,
    ``,
    `What we're building:`,
    v.brief,
  ].join('\n');

  const finish = async () => {
    const v = collect();
    const text = briefText(v);
    briefEl.textContent = text;
    sendBtn.href = `mailto:${STUDIO.email}?subject=${encodeURIComponent(`New project — ${v.company !== '—' ? v.company : v.name}`)}&body=${encodeURIComponent(text)}`;

    const endpoint = form.dataset.endpoint;
    if (endpoint) {
      try {
        const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(res.statusText);
        panel.querySelector('[data-done-title]').textContent = 'Sent. Talk soon.';
        panel.querySelector('[data-done-text]').textContent = 'Your brief is with the studio. Expect a written scope, a fixed price and a start date within 48 hours. A copy is below.';
        sendBtn.hidden = true;
      } catch (err) {
        panel.querySelector('[data-done-text]').textContent = 'We could not send it automatically. Please send it by email instead.';
      }
    }
    section.classList.add('is-done');
    bindMagnetic(panel);
    const title = panel.querySelector('[data-done-title]');
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
  };

  next.addEventListener('click', () => {
    if (!validate(sets[step])) return;
    if (step < sets.length - 1) showStep(step + 1);
    else finish();
  });
  back.addEventListener('click', () => showStep(Math.max(0, step - 1)));
  form.addEventListener('submit', (e) => { e.preventDefault(); next.click(); });
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
      next.click();
    }
  });

  panel.querySelector('[data-copy-brief]').addEventListener('click', async (e) => {
    const label = e.currentTarget.querySelector('.btn__label');
    try {
      await navigator.clipboard.writeText(briefEl.textContent);
      label.textContent = 'Copied';
    } catch {
      label.textContent = 'Select & copy';
    }
    setTimeout(() => { label.textContent = 'Copy brief'; }, 1800);
  });
  panel.querySelector('[data-edit-brief]').addEventListener('click', () => {
    section.classList.remove('is-done');
    showStep(0);
  });

  showStep(0, false);
})();
