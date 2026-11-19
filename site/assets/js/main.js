/* Axioma IA Tech — interacciones (sin dependencias) */
(() => {
  "use strict";

  document.documentElement.classList.add("js"); // ya lo pone el <head>; por si acaso
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canObserve = "IntersectionObserver" in window;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Navegación ---------- */
  const nav = $("#nav");
  const toggle = $("#nav-toggle");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.classList.toggle("no-scroll", open);
  }
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("#nav-links a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false);
  });
  window.matchMedia("(min-width: 834px)").addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });

  /* ---------- Aparición al hacer scroll ---------- */
  const revealables = $$("[data-reveal]");
  revealables.forEach((el) => {
    const group = Array.from(el.parentElement.children).filter((c) => c.hasAttribute("data-reveal"));
    if (group.length > 2) el.style.setProperty("--rd", `${Math.min(group.indexOf(el), 6) * 70}ms`);
  });
  if (canObserve && !reduce) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Pausar animaciones fuera de pantalla ---------- */
  if (canObserve) {
    const pio = new IntersectionObserver((entries) => {
      entries.forEach((en) => en.target.classList.toggle("is-offscreen", !en.isIntersecting));
    });
    $$(".hero, .tile--agent, .tile--data, .pipeline__visual, .window").forEach((el) => pio.observe(el));
  }

  /* ---------- Manifiesto: palabra por palabra ---------- */
  const manifesto = $(".manifesto");
  const mText = $("[data-words]");
  let words = [];
  if (mText) {
    const parts = mText.textContent.trim().split(/\s+/);
    mText.textContent = "";
    words = parts.map((w, i) => {
      const s = document.createElement("span");
      s.className = "w";
      s.textContent = w;
      mText.append(s);
      if (i < parts.length - 1) mText.append(" ");
      return s;
    });
  }
  function updateManifesto() {
    if (!manifesto || reduce) return;
    const r = manifesto.getBoundingClientRect();
    const vh = window.innerHeight;
    const travel = r.height - vh;
    const p = Math.min(1, Math.max(0, (vh * 0.5 - r.top) / (travel * 0.75 + vh * 0.5)));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < n));
  }

  /* ---------- Hero: se aleja al bajar ---------- */
  const hero = $(".hero");
  const heroContent = $(".hero__content");
  function updateHero() {
    if (reduce || !hero) return;
    const p = Math.min(1, window.scrollY / hero.offsetHeight);
    heroContent.style.transform = `translateY(${p * 70}px) scale(${1 - p * 0.08})`;
    heroContent.style.opacity = String(Math.max(0, 1 - p * 1.25));
  }

  /* ---------- Escena de datos ---------- */
  const pipe = $("#pipeline");
  const psteps = $$(".pstep");
  function updatePipeline() {
    if (!pipe || !psteps.length) return;
    const target = window.innerHeight * (window.innerWidth < 834 ? 0.74 : 0.5);
    let best = 0;
    let bestD = Infinity;
    psteps.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - target);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    if (pipe.dataset.step !== String(best)) pipe.dataset.step = String(best);
    psteps.forEach((s, i) => s.classList.toggle("is-active", i === best));
  }

  /* ---------- Botón flotante de WhatsApp ---------- */
  const wa = $("#wa-float");
  const contact = $("#contacto");
  function updateFloat() {
    if (!wa || !hero || !contact) return;
    const pastHero = hero.getBoundingClientRect().bottom < 80;
    const cr = contact.getBoundingClientRect();
    const atContact = cr.top < window.innerHeight * 0.85 && cr.bottom > 0;
    wa.classList.toggle("is-visible", pastHero && !atContact);
  }

  /* ---------- Bucle de scroll ---------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
      updateHero();
      updateManifesto();
      updatePipeline();
      updateFloat();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Demo del agente ---------- */
  const chat = $("#chat");
  if (chat) {
    const win = chat.closest(".window");
    const items = $$("[data-seq]", chat);
    const replay = $("#chat-replay");
    let timers = [];

    const showAll = () => {
      items.forEach((el) => el.classList.add("show", "done"));
      win.classList.add("is-done");
    };

    const play = () => {
      timers.forEach(clearTimeout);
      timers = [];
      win.classList.remove("is-done");
      items.forEach((el) => el.classList.remove("show", "done"));
      let t = 350;
      items.forEach((el) => {
        timers.push(setTimeout(() => el.classList.add("show"), t));
        if (el.classList.contains("tool")) {
          t += 950;
          timers.push(setTimeout(() => el.classList.add("done"), t));
          t += 250;
        } else {
          t += el.classList.contains("msg--user") ? 1000 : 1800;
        }
      });
      timers.push(setTimeout(() => win.classList.add("is-done"), t));
    };

    if (reduce || !canObserve) {
      showAll();
    } else {
      const cio = new IntersectionObserver(
        ([en]) => {
          if (en.isIntersecting) {
            play();
            cio.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      cio.observe(win);
    }
    replay.addEventListener("click", reduce ? showAll : play);
  }

  /* ---------- Rejilla de puntos (tarjeta de datos) ---------- */
  const dots = $(".dots");
  if (dots) {
    const hot = new Set([15, 28, 41, 46, 52, 63, 70]);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 12 * 7; i++) {
      const d = document.createElement("i");
      if (hot.has(i)) {
        d.className = "hot";
        d.style.setProperty("--dl", `${(i % 5) * 0.45}s`);
      }
      frag.append(d);
    }
    dots.append(frag);
  }
})();
