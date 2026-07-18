/* =====================================================================
   Yameen Alsaaidah · Portfolio interactions
   Vanilla JS, zero dependencies.
   ===================================================================== */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initHeader();
  initMobileMenu();
  initReveal();
  initActiveNav();
  initCounters();
  initClock();
  initContactForm();
  initBackToTop();
});

/* ---------- Theme ---------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  // data-theme is already set by the inline <head> script; keep it in sync here.
  sync(root.getAttribute("data-theme") || "dark");

  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    sync(next);
  });

  function sync(theme) {
    const next = theme === "dark" ? "light" : "dark";
    toggle.setAttribute("aria-label", `Switch to ${next} theme`);
    toggle.setAttribute("title", `Switch to ${next} theme`);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#141210" : "#f6f2ea");
  }
}

/* ---------- Header: scrolled state + progress bar ---------- */
function initHeader() {
  const header = document.getElementById("site-header");
  const bar = document.getElementById("scroll-progress");
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 12);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    bar.style.opacity = y > 4 ? "1" : "0";
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", String(!open));
  };

  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) setOpen(false);
  });
  // If the viewport grows past the mobile breakpoint, make sure the menu closes.
  window.matchMedia("(min-width: 1081px)").addEventListener("change", (e) => {
    if (e.matches && menu.classList.contains("open")) setOpen(false);
  });
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
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
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
  );
  items.forEach((el) => io.observe(el));

  // Safety net: anything still hidden after load settles gets revealed.
  setTimeout(() => {
    items.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
    });
  }, 1200);
}

/* ---------- Active nav link ---------- */
function initActiveNav() {
  const links = [...document.querySelectorAll(".site-nav .nav-link")];
  const sections = links
    .map((l) => document.getElementById(l.getAttribute("href").slice(1)))
    .filter(Boolean);
  if (!sections.length || !("IntersectionObserver" in window)) return;

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
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));
}

/* ---------- Animated counters ---------- */
function initCounters() {
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (reduceMotion) {
      el.textContent = target;
      return;
    }
    const dur = 1300;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    nums.forEach((n) => (n.textContent = n.dataset.count));
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  nums.forEach((n) => io.observe(n));
}

/* ---------- Footer clock (Charlotte, NC · Eastern time) ---------- */
function initClock() {
  const el = document.getElementById("footer-clock");
  if (!el) return;
  const update = () => {
    try {
      const time = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York",
      }).format(new Date());
      el.textContent = `Charlotte, NC · ${time}`;
    } catch (e) {
      el.textContent = "Charlotte, NC";
    }
  };
  update();
  setInterval(update, 30000);
}

/* ---------- Contact form (opens a prepared email draft) ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const name = form.querySelector("#cf-name").value.trim();
    const email = form.querySelector("#cf-email").value.trim();
    const message = form.querySelector("#cf-message").value.trim();

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:Yameen.code@gmail.com?subject=${subject}&body=${body}`;

    const note = document.getElementById("cf-note");
    const label = document.getElementById("cf-submit-label");
    note.textContent = "Draft opened. Send it from your email app to complete.";
    note.classList.add("is-success");
    label.textContent = "Draft opened";

    setTimeout(() => {
      note.textContent = "Submitting opens a ready-to-send draft in your email app.";
      note.classList.remove("is-success");
      label.textContent = "Open email draft";
    }, 5000);
  });
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById("to-top");
  if (!btn) return;
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
  );
}
