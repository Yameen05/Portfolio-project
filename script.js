/* =====================================================================
   Yameen Alsaaidah — Portfolio interactions
   Vanilla JS, zero dependencies. Built from scratch.
   ===================================================================== */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

document.addEventListener("DOMContentLoaded", () => {
  // Start every (re)load at the top — never auto-jump to a section.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash) {
    history.replaceState(null, "", location.pathname + location.search);
  }
  window.scrollTo(0, 0);

  initTheme();
  initNav();
  initMobileMenu();
  initScrollProgress();
  initReveal();
  initStagger();
  initCounters();
  initTypewriter();
  initSpotlight();
  initMagnetic();
  initTilt();
  initBackToTop();
  if (!reduceMotion) initConstellation();
});

/* ---------- Theme ---------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const icon = toggle.querySelector("i");

  const saved = localStorage.getItem("theme") || "dark";
  apply(saved);

  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    apply(next);
  });

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    window.__theme = theme;
  }
}

/* ---------- Navigation (condense, hide on scroll, active link) ---------- */
function initNav() {
  const nav = document.getElementById("navbar");
  const links = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")];
  let lastY = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 20);

    if (!document.body.classList.contains("menu-open")) {
      if (y > 240 && y > lastY) nav.classList.add("hidden");
      else nav.classList.remove("hidden");
    }
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active link via IntersectionObserver around viewport middle
  const byId = new Map(links.map((l) => [l.getAttribute("href").slice(1), l]));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          byId.get(e.target.id)?.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));

  // In-page links: smooth-scroll with nav offset and keep the URL hash-free,
  // so refreshing the page never jumps to a section.
  const navH =
    parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"), 10) || 76;
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      closeMobileMenu();
      const id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - navH);
      window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
      history.replaceState(null, "", location.pathname + location.search);
    });
  });
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    toggle.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
  });

  document.querySelectorAll(".mobile-link").forEach((l) =>
    l.addEventListener("click", closeMobileMenu)
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu();
  });
}

function closeMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  if (!menu || !menu.classList.contains("open")) return;
  menu.classList.remove("open");
  menu.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
  document.body.style.overflow = "";
  document.getElementById("menu-toggle")?.setAttribute("aria-expanded", "false");
}

/* ---------- Scroll progress ---------- */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- Staggered groups ---------- */
function initStagger() {
  const groups = document.querySelectorAll("[data-stagger]");
  groups.forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty("--i", i));
  });
  if (reduceMotion) {
    groups.forEach((g) => g.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
  );
  groups.forEach((g) => io.observe(g));
}

/* ---------- Animated counters ---------- */
function initCounters() {
  const nums = document.querySelectorAll(".stat-num[data-count]");
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        animate(e.target);
        obs.unobserve(e.target);
      });
    },
    { threshold: 0.6 }
  );
  nums.forEach((n) => io.observe(n));

  function animate(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

/* ---------- Typewriter ---------- */
function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const roles = [
    "Software Engineer",
    "Computer Science Student",
    "Back-End Engineer",
    "Full-Stack Developer",
    "LLM Engineer",
    "AI/ML Enthusiast",
    "DevOps Engineer",
  ];

  if (reduceMotion) {
    el.textContent = roles[0];
    return;
  }

  let role = 0;
  let char = 0;
  let deleting = false;

  const tick = () => {
    const current = roles[role];
    char += deleting ? -1 : 1;
    el.textContent = current.slice(0, char);

    let delay = deleting ? 35 : 70;
    if (!deleting && char === current.length) {
      deleting = true;
      delay = 1300;
    } else if (deleting && char === 0) {
      deleting = false;
      role = (role + 1) % roles.length;
      delay = 320;
    }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 700);
}

/* ---------- Spotlight cards ---------- */
function initSpotlight() {
  if (!finePointer) return;
  document.querySelectorAll("[data-spotlight]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });
}

/* ---------- Magnetic buttons ---------- */
function initMagnetic() {
  if (!finePointer || reduceMotion) return;
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = 0.3;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
}

/* ---------- 3D tilt ---------- */
function initTilt() {
  if (!finePointer || reduceMotion) return;
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    const max = 9;
    el.style.transition = "transform 0.2s var(--ease)";
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
    });
  });
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById("to-top");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("show", window.scrollY > 600),
    { passive: true }
  );
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
  );
}

/* ---------- Constellation background ---------- */
function initConstellation() {
  const canvas = document.getElementById("constellation");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, dpr, points, raf;
  const mouse = { x: -9999, y: -9999 };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    const count = Math.min(90, Math.floor((innerWidth * innerHeight) / 18000));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18 * dpr,
      vy: (Math.random() - 0.5) * 0.18 * dpr,
    }));
  };

  const color = () => (window.__theme === "light" ? "20, 22, 40" : "150, 150, 200");

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const rgb = color();
    const linkDist = 130 * dpr;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.3 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, 0.6)`;
      ctx.fill();

      for (let j = i + 1; j < points.length; j++) {
        const q = points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < linkDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${rgb}, ${0.14 * (1 - dist / linkDist)})`;
          ctx.lineWidth = dpr;
          ctx.stroke();
        }
      }

      // subtle attraction to cursor
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const md = Math.hypot(mdx, mdy);
      if (md < 160 * dpr) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(139, 124, 255, ${0.2 * (1 - md / (160 * dpr))})`;
        ctx.lineWidth = dpr;
        ctx.stroke();
      }
    }
    raf = requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize);
  window.addEventListener(
    "pointermove",
    (e) => {
      mouse.x = e.clientX * dpr;
      mouse.y = e.clientY * dpr;
    },
    { passive: true }
  );
  window.addEventListener("pointerleave", () => {
    mouse.x = mouse.y = -9999;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(draw);
  });

  resize();
  draw();
}

/* ---------- Contact form (mailto fallback) ---------- */
function handleContactForm(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector("#contact-name").value;
  const email = form.querySelector("#contact-email").value;
  const message = form.querySelector("#contact-message").value;

  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`);
  window.open(`mailto:Yameen.code@gmail.com?subject=${subject}&body=${body}`);

  const successEl = document.getElementById("form-success");
  const btn = form.querySelector(".form-submit-btn");
  successEl.classList.add("visible");
  btn.disabled = true;
  btn.querySelector("span").textContent = "Sent!";

  setTimeout(() => {
    form.reset();
    successEl.classList.remove("visible");
    btn.disabled = false;
    btn.querySelector("span").textContent = "Send message";
  }, 4000);
}
