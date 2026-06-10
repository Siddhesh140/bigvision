/* ============================================================
   BIG VISION — interactions & scroll choreography
   GSAP + ScrollTrigger + Lenis. Scene state via window.__SCENE
   ============================================================ */

(() => {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  const S = (window.__SCENE = window.__SCENE || { dive: 0, rise: 0, ready: false });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------- Lenis smooth scroll ---------- */

  const lenis = new Lenis({ lerp: 0.085, smoothWheel: !reduceMotion });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('[data-scrollto]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
      lenis.scrollTo(el.getAttribute('data-scrollto'), { offset: 0, duration: 1.6 });
    });
  });

  /* ---------- text splitting ---------- */

  function splitChars(el) {
    // char spans grouped inside nowrap word spans so words never break mid-letter
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      [...w].forEach((ch) => {
        const s = document.createElement('span');
        s.className = 'c';
        s.textContent = ch;
        wordSpan.appendChild(s);
      });
      el.appendChild(wordSpan);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return el.querySelectorAll('.c');
  }

  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const s = document.createElement('span');
      s.className = 'w';
      s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return el.querySelectorAll('.w');
  }

  document.querySelectorAll('.split-chars').forEach(splitChars);
  document.querySelectorAll('.split-words').forEach(splitWords);

  /* ---------- preloader → hero intro ---------- */

  const preCount = document.getElementById('pre-count');
  const preloader = document.getElementById('preloader');

  const heroIntro = gsap.timeline({ paused: true });
  heroIntro
    .from('#hero .split-chars .c', {
      yPercent: 120, opacity: 0, duration: 1.05, ease: 'power4.out',
      stagger: { each: 0.022, from: 'start' },
    })
    .from('.hero-eyebrow', { y: -18, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.7')
    .from('.hero-sub', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.55')
    .from('.hero-ctas .btn', { y: 24, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, '-=0.5')
    .from('.scroll-cue', { opacity: 0, duration: 0.6 }, '-=0.3')
    .from('#nav', { y: -60, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.8');

  const counter = { v: 0 };
  gsap.to(counter, {
    v: 100,
    duration: reduceMotion ? 0.1 : 1.6,
    ease: 'power2.inOut',
    onUpdate: () => { preCount.textContent = Math.round(counter.v); },
    onComplete: finishPreload,
  });

  function finishPreload() {
    // hold until WebGL has produced a frame (max ~2.5s safeguard)
    const t0 = performance.now();
    (function waitReady() {
      if (S.ready || performance.now() - t0 > 2500) {
        gsap.timeline()
          .to('.preloader-inner', { opacity: 0, scale: 0.92, duration: 0.5, ease: 'power2.in' })
          .to(preloader, {
            yPercent: -100, duration: 0.9, ease: 'power4.inOut',
            onComplete: () => { preloader.style.display = 'none'; heroIntro.play(); },
          }, '-=0.1');
      } else {
        requestAnimationFrame(waitReady);
      }
    })();
  }

  /* ---------- nav state / burger ---------- */

  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');

  ScrollTrigger.create({
    start: 60,
    onUpdate: () => {},
    onToggle: (self) => nav.classList.toggle('is-scrolled', self.isActive),
  });

  function closeMenu() {
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    lenis.start();
  }

  burger.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    open ? lenis.stop() : lenis.start();
  });

  /* ---------- progress rail ---------- */

  gsap.to('#rail-fill', {
    height: '100%',
    ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.4 },
  });

  /* ---------- hero exit (content drifts up, cue fades) ---------- */

  gsap.to('.hero-content', {
    y: -140, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 35%', scrub: 0.5 },
  });
  gsap.to('.scroll-cue', {
    opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: '12% top', scrub: true },
  });

  /* ---------- THE DIVE: pinned act, drives camera through clouds ---------- */

  const diveLines = gsap.utils.toArray('.dive-line');

  if (!reduceMotion) {
    const diveTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#dive',
        start: 'top top',
        end: '+=260%',
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => { S.dive = self.progress; },
      },
    });

    // darken the whiteout while inside the cloud layer, then clear fully
    diveTl
      .fromTo('.dive-veil', { opacity: 0 }, { opacity: 0.9, duration: 1.4, ease: 'power1.in' }, 0)
      .to('.dive-veil', { opacity: 0, duration: 1.4, ease: 'power1.out' }, 4.4);

    diveLines.forEach((line, i) => {
      diveTl
        .fromTo(line, { opacity: 0, scale: 0.94, filter: 'blur(6px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' }, i === 0 ? 0.6 : '>')
        .to(line, { opacity: 0, scale: 1.05, filter: 'blur(6px)', duration: 1, ease: 'power2.in' }, '+=0.45');
    });
  } else {
    S.dive = 1;
    gsap.set(diveLines, { opacity: 1, position: 'relative', marginBottom: 30 });
  }

  /* ---------- marquee: duplicate track for seamless loop ---------- */

  const track = document.querySelector('.marquee-track');
  track.innerHTML += track.innerHTML;

  /* ---------- SERVICES: index rows + cursor-following preview ---------- */

  const floatBox = document.querySelector('.service-float');
  const floatImg = floatBox ? floatBox.querySelector('img') : null;

  if (floatBox && !isTouch) {
    const fpos = { x: 0, y: 0, tx: 0, ty: 0 };
    let floatActive = false;

    window.addEventListener('mousemove', (e) => {
      fpos.tx = e.clientX + 28;
      fpos.ty = e.clientY - 100;
    }, { passive: true });

    gsap.ticker.add(() => {
      if (!floatActive && Math.abs(fpos.x - fpos.tx) < 0.5) return;
      fpos.x += (fpos.tx - fpos.x) * 0.12;
      fpos.y += (fpos.ty - fpos.y) * 0.12;
      floatBox.style.transform = `translate(${fpos.x}px, ${fpos.y}px) scale(${floatActive ? 1 : 0.92})`;
    });

    document.querySelectorAll('.service-row').forEach((row) => {
      row.addEventListener('mouseenter', () => {
        floatImg.src = row.dataset.img;
        if (!floatActive) { fpos.x = fpos.tx; fpos.y = fpos.ty; } // snap on first hover
        floatBox.classList.add('is-active');
        floatActive = true;
      });
      row.addEventListener('mouseleave', () => {
        floatBox.classList.remove('is-active');
        floatActive = false;
      });
    });
  }

  // rows slide in with a stagger
  gsap.utils.toArray('.service-row').forEach((row, i) => {
    gsap.from(row, {
      y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.08,
      scrollTrigger: { trigger: row, start: 'top 90%', once: true },
    });
  });

  /* ---------- generic reveals ---------- */

  document.querySelectorAll('.split-words').forEach((el) => {
    gsap.from(el.querySelectorAll('.w'), {
      yPercent: 110, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    });
  });

  gsap.utils.toArray('.kicker, .stat, .fit-col, .voice, .proof-banner, .end-statement, .cta-sub, .lead-form, .cta-whatsapp').forEach((el) => {
    gsap.from(el, {
      y: 44, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  /* ---------- stat counters ---------- */

  document.querySelectorAll('.count').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: target, duration: 2, ease: 'power3.out',
          onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('en-IN'); },
        });
      },
    });
  });

  /* ---------- proof banner parallax ---------- */

  gsap.fromTo('.proof-banner img', { yPercent: -12 }, {
    yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '.proof-banner', start: 'top bottom', end: 'bottom top', scrub: 0.5 },
  });

  /* ---------- CTA: camera rises back above the clouds ---------- */

  ScrollTrigger.create({
    trigger: '#contact',
    start: 'top 85%',
    end: 'top 5%',
    scrub: 0.5,
    onUpdate: (self) => { S.rise = self.progress; },
  });

  gsap.from('#contact .split-chars .c', {
    yPercent: 120, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.02,
    scrollTrigger: { trigger: '.cta-title', start: 'top 82%', once: true },
  });

  /* ---------- testimonial tilt ---------- */

  if (!isTouch) {
    document.querySelectorAll('.tilt').forEach((card) => {
      let raf = null;
      card.addEventListener('mousemove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
          raf = null;
        });
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
        card.style.transform = '';
        setTimeout(() => (card.style.transition = ''), 600);
      });
    });
  }

  /* ---------- custom cursor + magnetic ---------- */

  if (!isTouch) {
    const cursor = document.querySelector('.cursor');
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { x: pos.x, y: pos.y };

    window.addEventListener('mousemove', (e) => { pos.x = e.clientX; pos.y = e.clientY; }, { passive: true });

    gsap.ticker.add(() => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%,-50%)`;
    });

    document.querySelectorAll('a, button, .tilt').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: mx * 0.25, y: my * 0.3, duration: 0.4, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
      });
    });
  }

  /* ---------- lead form → WhatsApp ---------- */

  document.getElementById('lead-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    let valid = true;
    form.querySelectorAll('input').forEach((input) => {
      const ok = input.checkValidity();
      input.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });
    if (!valid) return;

    const d = Object.fromEntries(new FormData(form));
    const msg = `Hi Big Vision! I'd like to book a strategy call.%0A%0AName: ${encodeURIComponent(d.name)}%0ACompany: ${encodeURIComponent(d.company)}%0AEmail: ${encodeURIComponent(d.email)}%0APhone: ${encodeURIComponent(d.phone)}`;
    window.open(`https://wa.me/919579662005?text=${msg}`, '_blank', 'noopener');
  });

  /* ---------- misc ---------- */

  document.getElementById('year').textContent = new Date().getFullYear();

  // Recalculate pins after fonts/images settle
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
