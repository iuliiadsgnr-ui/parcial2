/* =====================================================================
   BENTO NOIR — Shared runtime (all pages)
   01 Studio config        05 Magnetic buttons
   02 Scroll/resize bus    06 Section sheets + header tone
   03 Reveals              07 Newsletter
   04 Header               08 Adaptive pixel-dissolving cursor trail
   ===================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ---------------------------------------------------------------
     01 · Studio config — edit availability in one place
     --------------------------------------------------------------- */
  const STUDIO = {
    open: true,                       // false → "Waitlist" everywhere
    window: "Q4 · Q1 '27",            // booking window label
    nextStart: '2026-11-16',          // ISO date of the next free sprint
    slots: 2,                         // project slots left in the window
    email: 'hello@bentonoir.studio',  // placeholder — replace with the real inbox
  };

  const fmtDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  document.querySelectorAll('[data-studio]').forEach((el) => {
    const key = el.dataset.studio;
    if (key === 'status') el.textContent = STUDIO.open ? `Status: Open for ${STUDIO.window}` : 'Status: Waitlist only';
    if (key === 'status-short') el.textContent = STUDIO.open ? 'Open for projects' : 'Waitlist only';
    if (key === 'next') el.textContent = fmtDate(STUDIO.nextStart);
    if (key === 'slots') el.textContent = STUDIO.open ? `${STUDIO.slots} of 4` : '0 of 4';
    if (key === 'window') el.textContent = STUDIO.window;
    if (key === 'email') { el.textContent = STUDIO.email; if (el.tagName === 'A') el.href = `mailto:${STUDIO.email}`; }
    if (key === 'mailto') el.href = `mailto:${STUDIO.email}?subject=${encodeURIComponent(el.dataset.subject || 'New project')}`;
  });
  document.querySelectorAll('.status-dot[data-live]').forEach((d) => d.classList.toggle('is-closed', !STUDIO.open));
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------------------------------------------------------------
     02 · Scroll / resize bus (one rAF per frame for every module)
     --------------------------------------------------------------- */
  const scrollFns = new Set();
  const resizeFns = new Set();
  let ticking = false;
  const runScroll = () => { ticking = false; scrollFns.forEach((fn) => fn()); };
  const requestScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(runScroll); } };
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', () => { resizeFns.forEach((fn) => fn()); requestScroll(); }, { passive: true });

  /* ---------------------------------------------------------------
     03 · Reveals — fade-ups, masked lines, expanding bento modules
     --------------------------------------------------------------- */
  let io = null;
  const observeReveal = (scope = document) => {
    const els = scope.querySelectorAll('[data-reveal]:not(.is-in), [data-lines]:not(.is-in)');
    if (!io || reduceMotion) { els.forEach((el) => el.classList.add('is-in')); return; }
    els.forEach((el) => io.observe(el));
  };

  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  }

  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 900))]).then(() => {
    requestAnimationFrame(() => {
      root.classList.add('is-loaded');
      observeReveal();
    });
  });

  /* ---------------------------------------------------------------
     04 · Header — cursor light, Works dropdown, mobile menu
     --------------------------------------------------------------- */
  document.querySelectorAll('[data-glow]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
      el.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
    });
  });

  const nav = document.querySelector('.nav');
  if (nav) {
    const toggle = nav.querySelector('.nav__toggle');
    const dropdown = nav.querySelector('.has-dropdown');
    const trigger = dropdown && dropdown.querySelector('.nav__trigger');

    const setDropdown = (open) => {
      if (!dropdown) return;
      dropdown.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    };
    const setMenu = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (!open) setDropdown(false);
    };

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        setDropdown(!dropdown.classList.contains('is-open'));
      });
    }
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    document.addEventListener('click', (e) => {
      if (dropdown && !dropdown.contains(e.target)) setDropdown(false);
      if (!nav.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { setDropdown(false); setMenu(false); }
    });
    nav.querySelectorAll('.nav__links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    window.matchMedia('(min-width: 761px)').addEventListener('change', (mq) => { if (mq.matches) setMenu(false); });
  }

  /* ---------------------------------------------------------------
     05 · Magnetic buttons
     --------------------------------------------------------------- */
  const bindMagnetic = (scope = document) => {
    if (reduceMotion || !finePointer) return;
    scope.querySelectorAll('[data-magnetic]:not([data-magnetic-bound])').forEach((el) => {
      el.setAttribute('data-magnetic-bound', '');
      const strength = parseFloat(el.dataset.magnetic) || 0.3;
      const label = el.querySelector('.btn__label');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
        if (label) label.style.transform = `translate3d(${x * strength * 0.35}px, ${y * strength * 0.35}px, 0)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
        if (label) label.style.transform = '';
      });
    });
  };
  bindMagnetic();

  /* ---------------------------------------------------------------
     06 · Section map: sheet transitions, header tone, theme lookup
     --------------------------------------------------------------- */
  const sections = Array.from(document.querySelectorAll('.section'));
  let sectionMap = [];  // [{ top, bottom, dark }] in document coordinates

  const measureSections = () => {
    const sy = window.scrollY;
    sectionMap = sections.map((s) => {
      const r = s.getBoundingClientRect();
      return { top: r.top + sy, bottom: r.bottom + sy, dark: s.dataset.theme === 'dark' };
    });
  };
  // Later sections overlap earlier ones (sheets), so the last match wins.
  const isDarkAt = (clientY) => {
    const y = clientY + window.scrollY;
    let dark = false;
    for (let i = 0; i < sectionMap.length; i++) {
      const s = sectionMap[i];
      if (y >= s.top && y < s.bottom) dark = s.dark;
    }
    return dark;
  };

  measureSections();
  resizeFns.add(measureSections);
  if ('ResizeObserver' in window) new ResizeObserver(() => { measureSections(); requestScroll(); }).observe(document.body);
  window.addEventListener('load', measureSections);

  const sheets = Array.from(document.querySelectorAll('.section--sheet'));
  const hero = document.querySelector('.hero');
  const updateSheets = () => {
    const vh = window.innerHeight;
    const maxInset = Math.min(32, window.innerWidth * 0.025);
    sheets.forEach((s, i) => {
      const top = s.getBoundingClientRect().top;
      const p = clamp(1 - top / vh);
      const r = parseFloat(getComputedStyle(s).getPropertyValue('--sheet-r-max')) || (window.innerWidth < 761 ? 24 : 40);
      s.style.setProperty('--sheet-r', `${(r * (1 - p)).toFixed(2)}px`);
      s.style.setProperty('--sheet-inset', `${(maxInset * (1 - p)).toFixed(2)}px`);
      if (i === 0 && hero && !reduceMotion) hero.style.setProperty('--hero-p', p.toFixed(3));
    });
  };

  const headerProbe = () => {
    const header = document.querySelector('.site-header');
    if (!header || !nav) return;
    const r = header.getBoundingClientRect();
    nav.dataset.tone = isDarkAt(r.top + r.height / 2) ? 'dark' : 'light';
  };

  scrollFns.add(updateSheets);
  scrollFns.add(headerProbe);
  requestScroll();

  /* ---------------------------------------------------------------
     07 · Newsletter (static: posts to data-endpoint when configured)
     --------------------------------------------------------------- */
  document.querySelectorAll('form[data-newsletter]').forEach((form) => {
    const note = form.querySelector('.form-note');
    const input = form.querySelector('input[type="email"]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      note.classList.remove('is-ok', 'is-error');
      if (!input.checkValidity() || !input.value.trim()) {
        note.textContent = 'Please enter a valid email address.';
        note.classList.add('is-error');
        input.focus();
        return;
      }
      const endpoint = form.dataset.endpoint;
      try {
        if (endpoint) {
          const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(res.statusText);
        } else {
          console.info('[Bento Noir] Newsletter has no data-endpoint yet; nothing was sent.');
        }
        note.textContent = 'Subscribed. One dispatch a month, no noise.';
        note.classList.add('is-ok');
        form.reset();
      } catch (err) {
        note.textContent = 'Something went wrong. Please try again.';
        note.classList.add('is-error');
      }
    });
  });

  /* Public API for page modules */
  window.BN = {
    STUDIO, reduceMotion, finePointer, clamp, fmtDate,
    onScroll: (fn) => { scrollFns.add(fn); requestScroll(); },
    onResize: (fn) => resizeFns.add(fn),
    observeReveal, bindMagnetic, measureSections,
  };

  /* ---------------------------------------------------------------
     08 · Adaptive pixel-dissolving cursor trail
     Over dark sections: porcelain light + soft sage.
     Over light sections: charcoal + muted olive / sage.
     --------------------------------------------------------------- */
  const canvas = document.getElementById('canvas-cursor');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, DPR = 1;
  const resize = () => {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  resize();
  resizeFns.add(resize);

  // Pre-rendered glow sprites — index 0: for dark backgrounds, 1: for light
  const makeSprite = (stops) => {
    const S = 128;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const s = c.getContext('2d');
    const g = s.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    stops.forEach(([o, col]) => g.addColorStop(o, col));
    s.fillStyle = g;
    s.fillRect(0, 0, S, S);
    return c;
  };
  const SPRITES = [
    makeSprite([
      [0.00, 'rgba(253, 251, 247, 0.95)'],
      [0.14, 'rgba(214, 222, 212, 0.62)'],
      [0.34, 'rgba(88, 107, 90, 0.38)'],
      [0.64, 'rgba(88, 107, 90, 0.10)'],
      [1.00, 'rgba(88, 107, 90, 0)'],
    ]),
    makeSprite([
      [0.00, 'rgba(22, 24, 23, 0.42)'],
      [0.18, 'rgba(22, 24, 23, 0.20)'],
      [0.40, 'rgba(88, 107, 90, 0.14)'],
      [0.70, 'rgba(125, 139, 127, 0.04)'],
      [1.00, 'rgba(125, 139, 127, 0)'],
    ]),
  ];
  const HEAD_ALPHA = [0.4, 0.5];
  const GLOW_ALPHA = [0.85, 0.7];
  const TONES = [
    ['#FDFBF7', '#A9BBAB', '#586B5A'], // dark backgrounds
    ['#161817', '#7D8B7F', '#586B5A'], // light backgrounds
  ];
  const PIXEL_ALPHA = [0.95, 0.72];

  const GRID = 3;
  const GLOW_END = 0.42;
  const PIXEL_START = 0.3;

  // Fixed pool — slots are recycled via swap-remove, never re-allocated
  const MAX = 900;
  const pool = new Array(MAX);
  for (let i = 0; i < MAX; i++) {
    pool[i] = { x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 1, size: 0, seed: 0, tone: 0, shards: 1, pal: 0 };
  }
  let count = 0;

  const pointer = { x: 0, y: 0, px: 0, py: 0, inside: false, last: 0, pal: 0 };
  const head = { x: 0, y: 0, a: 0, pal: 0 };

  const emit = (x, y, vx, vy, pal) => {
    if (count >= MAX) return;
    const p = pool[count++];
    p.x = x + (Math.random() - 0.5) * 6;
    p.y = y + (Math.random() - 0.5) * 6;
    p.vx = vx * 0.06 + (Math.random() - 0.5) * 0.7;
    p.vy = vy * 0.06 + (Math.random() - 0.5) * 0.7 - 0.12;
    p.age = 0;
    p.life = 0.85 + Math.random() * 0.85;
    p.size = 9 + Math.random() * 15;
    p.seed = Math.random() * Math.PI * 2;
    const r = Math.random();
    p.tone = r < 0.66 ? 0 : (r < 0.86 ? 1 : 2);
    p.shards = 1 + ((Math.random() * 3) | 0);
    p.pal = pal;
  };

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return; // keep scrolling on phones clean
    const x = e.clientX, y = e.clientY;
    if (!pointer.inside) {
      pointer.px = x; pointer.py = y;
      head.x = x; head.y = y;
      pointer.inside = true;
    }
    const pal = isDarkAt(y) ? 0 : 1;
    pointer.pal = pal;
    const dx = x - pointer.px;
    const dy = y - pointer.py;
    const dist = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.min(22, Math.floor(dist / 7)));
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      emit(pointer.px + dx * t, pointer.py + dy * t, dx, dy, pal);
    }
    pointer.x = x; pointer.y = y;
    pointer.px = x; pointer.py = y;
    pointer.last = performance.now();
    wake();
  }, { passive: true });

  root.addEventListener('mouseleave', () => { pointer.inside = false; });

  let running = false;
  let lastT = 0;
  const wake = () => {
    if (running || document.hidden) return;
    running = true;
    lastT = performance.now();
    requestAnimationFrame(frame);
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) running = false;
    else if (count > 0) wake();
  });

  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;
    const k = dt * 60;
    const drag = Math.pow(0.94, k);

    ctx.clearRect(0, 0, W, H);

    // Fluid light head — eases toward the cursor and fades when idle
    const idle = now - pointer.last;
    const targetA = pointer.inside && idle < 140 ? 1 : 0;
    head.a += (targetA - head.a) * (1 - Math.pow(0.86, k));
    const follow = 1 - Math.pow(0.72, k);
    head.x += (pointer.x - head.x) * follow;
    head.y += (pointer.y - head.y) * follow;
    head.pal = pointer.pal;
    if (head.a > 0.01) {
      const r = 90;
      ctx.globalAlpha = head.a * HEAD_ALPHA[head.pal];
      ctx.drawImage(SPRITES[head.pal], head.x - r, head.y - r, r * 2, r * 2);
    }

    // Physics + glow pass
    for (let i = 0; i < count;) {
      const p = pool[i];
      p.age += dt;
      if (p.age >= p.life) {
        pool[i] = pool[count - 1];
        pool[count - 1] = p;
        count--;
        continue;
      }
      p.vx = p.vx * drag + Math.sin(p.y * 0.018 + p.seed) * 0.025 * k;
      p.vy = p.vy * drag - 0.01 * k;
      p.x += p.vx * k;
      p.y += p.vy * k;

      const t = p.age / p.life;
      if (t < GLOW_END) {
        const g = 1 - t / GLOW_END;
        const r = p.size * (0.55 + g * 0.45);
        ctx.globalAlpha = g * g * GLOW_ALPHA[p.pal];
        ctx.drawImage(SPRITES[p.pal], p.x - r, p.y - r, r * 2, r * 2);
      }
      i++;
    }

    // Pixel dissolution pass — grouped by palette + tone (few state changes)
    for (let pal = 0; pal < 2; pal++) {
      for (let tone = 0; tone < 3; tone++) {
        ctx.fillStyle = TONES[pal][tone];
        for (let i = 0; i < count; i++) {
          const p = pool[i];
          if (p.pal !== pal || p.tone !== tone) continue;
          const t = p.age / p.life;
          if (t < PIXEL_START) continue;
          const q = (t - PIXEL_START) / (1 - PIXEL_START);
          const fadeIn = Math.min(1, (t - PIXEL_START) / 0.08);
          const alpha = Math.pow(1 - q, 1.5) * fadeIn;
          if (alpha < 0.02) continue;
          ctx.globalAlpha = alpha * PIXEL_ALPHA[pal];
          const size = q < 0.5 ? 3 : (q < 0.8 ? 2 : 1);
          const spread = q * 10;
          for (let s = 0; s < p.shards; s++) {
            const a = p.seed + s * 2.39;
            const sx = Math.round((p.x + Math.cos(a) * spread) / GRID) * GRID;
            const sy = Math.round((p.y + Math.sin(a) * spread) / GRID) * GRID;
            ctx.fillRect(sx, sy, size, size);
          }
        }
      }
    }
    ctx.globalAlpha = 1;

    if (count === 0 && head.a < 0.01) {
      ctx.clearRect(0, 0, W, H);
      running = false;
      return;
    }
    requestAnimationFrame(frame);
  }
})();
