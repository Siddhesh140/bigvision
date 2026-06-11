/* ============================================================
   BIG VISION v3 — choreography (see v3/design.md §6)
   GSAP + ScrollTrigger + Lenis. Scene bridge: window.__SCENE
   ============================================================ */

(() => {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  const S = (window.__SCENE = window.__SCENE || { build: 0.42, glow: 0, ready: false, rotDeg: 0 });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------- Lenis ---------- */

  const lenis = new Lenis({ lerp: 0.09, smoothWheel: !reduceMotion });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('[data-scrollto]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
      lenis.scrollTo(el.getAttribute('data-scrollto'), { duration: 1.4 });
    });
  });

  /* ---------- preloader boot log ---------- */

  const pre = document.getElementById('preloader');
  const bootLines = gsap.utils.toArray('.boot-line');

  const intro = gsap.timeline({ paused: true });

  // the work lamp clicks on — fluorescent stutter, then steady
  if (!reduceMotion) {
    intro
      .to(S, { lamp: 0.85, duration: 0.06, ease: 'none' }, 0.05)
      .to(S, { lamp: 0.08, duration: 0.05, ease: 'none' }, 0.14)
      .to(S, { lamp: 0.95, duration: 0.05, ease: 'none' }, 0.26)
      .to(S, { lamp: 0.25, duration: 0.07, ease: 'none' }, 0.34)
      .to(S, { lamp: 1, duration: 0.18, ease: 'power2.out' }, 0.46);
  } else {
    S.lamp = 1;
  }

  intro
    .from('#hero .dmask', { yPercent: 115, duration: 1.1, ease: 'power4.out', stagger: 0.08 }, reduceMotion ? 0 : 0.55)
    .from('.reveal-h', { y: 22, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 }, '-=0.7')
    .from('.hero-anno', { opacity: 0, duration: 0.9 }, '-=0.3')
    .from('#bar', { y: -56, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.8')
    .from('#telemetry', { y: 30, opacity: 0, duration: 0.6 }, '-=0.5')
    .from('.scroll-cue', { opacity: 0, duration: 0.5 }, '-=0.4');

  const boot = gsap.timeline();
  boot
    .to(bootLines, { opacity: 1, duration: 0.01, stagger: reduceMotion ? 0 : 0.32 })
    .to('#boot-fill', { width: '100%', duration: reduceMotion ? 0.1 : 1.0, ease: 'power2.inOut' }, 0.2)
    .add(() => {
      const t0 = performance.now();
      (function waitReady() {
        if (S.ready || performance.now() - t0 > 2600) {
          gsap.to(pre, {
            yPercent: -100, duration: 0.8, ease: 'power4.inOut',
            onComplete: () => { pre.style.display = 'none'; intro.play(); },
          });
        } else requestAnimationFrame(waitReady);
      })();
    });

  /* ---------- bar / burger ---------- */

  const bar = document.getElementById('bar');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');

  ScrollTrigger.create({
    start: 40,
    onToggle: (self) => bar.classList.toggle('is-scrolled', self.isActive),
  });

  function closeMenu() {
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    lenis.start();
  }
  burger.addEventListener('click', () => {
    const open = !menu.classList.contains('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    open ? lenis.stop() : lenis.start();
  });

  /* ---------- crosshair cursor + magnetics ---------- */

  if (!isTouch) {
    const xh = document.querySelector('.xhair');
    const parts = xh.querySelectorAll('.xh-h, .xh-v, .xh-dot');
    window.addEventListener('mousemove', (e) => {
      parts.forEach((p) => { p.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`; });
    }, { passive: true });

    document.querySelectorAll('a, button, input, .log, .tol-table tr').forEach((el) => {
      el.addEventListener('mouseenter', () => xh.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => xh.classList.remove('is-hover'));
    });

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.12,
          y: (e.clientY - (r.top + r.height / 2)) * 0.18,
          duration: 0.35, ease: 'power3.out',
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
      });
    });
  }

  /* ---------- telemetry readouts ---------- */

  const tmBuild = document.getElementById('tm-build');
  const tmRot = document.getElementById('tm-rot');
  if (tmBuild) {
    gsap.ticker.add(() => {
      tmBuild.textContent = String(Math.round((S.scan || 0) * 100)).padStart(3, '0') + '%';
      tmRot.textContent = S.rotDeg.toFixed(1).padStart(5, '0') + '°';
    });
  }

  /* ---------- A1 · the build (pinned) ---------- */

  const specLines = gsap.utils.toArray('.spec-line');
  let stamped = false;

  if (!reduceMotion) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#spec',
        start: 'top top',
        end: '+=240%',
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          S.scan = self.progress; // QC ring sweeps the part
          if (self.progress > 0.97 && !stamped) {
            stamped = true;
            gsap.fromTo('#stamp', { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' });
          }
        },
      },
    });

    specLines.forEach((line) => {
      tl.fromTo(line, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
        .to(line, { opacity: 0, y: -28, duration: 1, ease: 'power2.in' }, '+=0.5');
    });
  } else {
    S.scan = 1;
    gsap.set('#stamp', { opacity: 1, scale: 1 });
  }

  /* ---------- the part travels the page ---------- */
  // docks to a bottom-right watermark while reading, returns for the CTA
  if (!reduceMotion) {
    gsap.to(S, {
      dock: 1, ease: 'none',
      scrollTrigger: { trigger: '#process', start: 'top 95%', end: 'top 35%', scrub: 0.5 },
    });
    gsap.to(S, {
      dock: 0, ease: 'none',
      scrollTrigger: { trigger: '#commission', start: 'top 95%', end: 'top 40%', scrub: 0.5 },
    });
  }

  /* ---------- A5 · energize ---------- */

  ScrollTrigger.create({
    trigger: '#commission',
    start: 'top 85%',
    end: 'top 15%',
    scrub: 0.5,
    onUpdate: (self) => { S.glow = self.progress; },
  });

  gsap.from('#commission .dmask', {
    yPercent: 115, duration: 1, ease: 'power4.out', stagger: 0.1,
    scrollTrigger: { trigger: '.comm-title', start: 'top 80%', once: true },
  });

  /* ---------- ticker ---------- */

  const track = document.querySelector('.ticker-track');
  track.innerHTML += track.innerHTML;

  /* ---------- reveals ---------- */

  gsap.utils.toArray('.kick, .h2, .station-copy, .gauge, .tol-table, .log, .comm-body, .order, .foot-mark').forEach((el) => {
    gsap.from(el, {
      y: 32, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 87%', once: true },
    });
  });

  /* ---------- station mockups: activate + loop ---------- */

  document.querySelectorAll('.station-visual').forEach((visual) => {
    gsap.from(visual, {
      y: 32, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: visual, start: 'top 87%', once: true },
    });
  });

  // ST.01 — profile assembles: bars fill, badge pops, followers count up
  const mockProfile = document.querySelector('.mock-profile');
  if (mockProfile) {
    ScrollTrigger.create({
      trigger: mockProfile,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        mockProfile.classList.add('is-on');
        const f = mockProfile.querySelector('.mp-followers');
        const obj = { v: 0 };
        gsap.to(obj, {
          v: 12400, duration: 2.2, delay: 0.4, ease: 'power3.out',
          onUpdate: () => { f.textContent = obj.v >= 1000 ? (obj.v / 1000).toFixed(1) + 'K' : Math.round(obj.v); },
        });
      },
    });
  }

  // ST.02 — weekly feed: posts go live one by one, counters tick, loops
  const mockFeed = document.querySelector('.mock-feed');
  if (mockFeed) {
    const posts = mockFeed.querySelectorAll('.mf-post');
    const likeTargets = [184, 312, 547];
    const cmtTargets = [21, 38, 64];
    let cycle = 0;
    let running = false;

    function liveOne(i) {
      posts.forEach((p, j) => p.classList.toggle('is-live', j === i));
      const like = posts[i].querySelector('.mf-like b');
      const cmt = posts[i].querySelector('.mf-cmt b');
      const obj = { l: 0, c: 0 };
      gsap.to(obj, {
        l: likeTargets[i], c: cmtTargets[i], duration: 1.6, ease: 'power2.out',
        onUpdate: () => { like.textContent = Math.round(obj.l); cmt.textContent = Math.round(obj.c); },
      });
    }

    function loop() {
      if (!running) return;
      liveOne(cycle % 3);
      cycle++;
      gsap.delayedCall(2.6, loop);
    }

    ScrollTrigger.create({
      trigger: mockFeed,
      start: 'top 82%',
      onEnter: () => { if (!running) { running = true; loop(); } },
      onLeave: () => { running = false; },
      onEnterBack: () => { if (!running) { running = true; loop(); } },
      onLeaveBack: () => { running = false; },
    });
  }

  // ST.03 — inbox: messages arrive in sequence, stamp pops
  const mockInbox = document.querySelector('.mock-inbox');
  if (mockInbox) {
    ScrollTrigger.create({
      trigger: mockInbox,
      start: 'top 80%',
      once: true,
      onEnter: () => mockInbox.classList.add('is-on'),
    });
  }

  /* ---------- counters + bars ---------- */

  document.querySelectorAll('.count').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const bar = el.closest('.gauge')?.querySelector('.gauge-bar i');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.8, ease: 'power3.out',
          onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('en-IN'); },
        });
        if (bar) gsap.to(bar, { width: '100%', duration: 1.8, ease: 'power3.out' });
      },
    });
  });

  /* ---------- work order → WhatsApp ---------- */

  document.getElementById('order').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    let valid = true;
    form.querySelectorAll('input').forEach((i) => {
      const ok = i.checkValidity();
      i.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });
    if (!valid) return;
    const d = Object.fromEntries(new FormData(form));
    const msg = `WORK ORDER — BV/NEW%0A%0ANAME: ${encodeURIComponent(d.name)}%0ACOMPANY: ${encodeURIComponent(d.company)}%0AEMAIL: ${encodeURIComponent(d.email)}%0APHONE: ${encodeURIComponent(d.phone)}%0A%0AREQUEST: 30-MIN BUILD REVIEW`;
    window.open(`https://wa.me/919579662005?text=${msg}`, '_blank', 'noopener');
  });

  /* ---------- misc ---------- */

  const y = new Date().getFullYear();
  document.getElementById('year').textContent = y;
  document.getElementById('year2').textContent = y;

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
