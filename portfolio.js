/* =========================================================
   Portfolio — interactions
   ========================================================= */
(function () {
  "use strict";

  const root = document.documentElement;
  const motionOK = () =>
    root.getAttribute("data-motion") !== "reduced" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav: scrolled state + active link ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // active section highlight
  const navLinks = [...document.querySelectorAll("#navLinks a")];
  const sectionFor = (id) => document.getElementById(id);
  const linkMap = navLinks
    .map((a) => ({ a, sec: sectionFor(a.getAttribute("href").slice(1)) }))
    .filter((x) => x.sec);

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.id;
          linkMap.forEach(({ a, sec }) =>
            a.classList.toggle("active", sec.id === id)
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  linkMap.forEach(({ sec }) => navObserver.observe(sec));

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  const toggleMenu = (open) => {
    const next = open ?? !menu.classList.contains("open");
    menu.classList.toggle("open", next);
    burger.setAttribute("aria-expanded", String(next));
  };
  burger.addEventListener("click", () => toggleMenu());
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => toggleMenu(false))
  );

  /* ---------- Scroll reveal ---------- */
  const revealEls = [...document.querySelectorAll(".reveal")];
  if (!motionOK()) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const revObserver = new IntersectionObserver(
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
    revealEls.forEach((el) => revObserver.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const counters = [...document.querySelectorAll(".count")];
  const animateCount = (el) => {
    const to = parseFloat(el.dataset.to);
    if (!motionOK()) {
      el.textContent = to;
      return;
    }
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = to;
    };
    requestAnimationFrame(tick);
  };
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => countObserver.observe(c));

  /* ---------- Cursor spotlight ---------- */
  const spotlight = document.getElementById("spotlight");
  let spotShown = false;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (!motionOK() || e.pointerType === "touch") return;
      if (!spotShown) {
        spotlight.style.opacity = "1";
        spotShown = true;
      }
      root.style.setProperty("--mx", e.clientX + "px");
      root.style.setProperty("--my", e.clientY + "px");
    },
    { passive: true }
  );

  /* ---------- Magnetic buttons ---------- */
  const magnets = [...document.querySelectorAll("[data-magnetic]")];
  magnets.forEach((el) => {
    let raf = null;
    el.addEventListener("pointermove", (e) => {
      if (!motionOK() || e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
      });
    });
    el.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    });
  });

  /* ---------- Project card tilt ---------- */
  const tilts = [...document.querySelectorAll("[data-tilt]")];
  tilts.forEach((card) => {
    let raf = null;
    card.addEventListener("pointermove", (e) => {
      if (!motionOK() || e.pointerType === "touch") return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${py * -5}deg) rotateY(${px * 6}deg) translateY(-4px)`;
      });
    });
    card.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      card.style.transform = "";
    });
  });

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contactForm");
  if (form) {
    const validators = {
      name: (v) => v.trim().length >= 2,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: (v) => v.trim().length >= 5,
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      Object.keys(validators).forEach((name) => {
        const input = form.elements[name];
        const field = input.closest(".field");
        const valid = validators[name](input.value);
        field.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (ok) form.classList.add("sent");
    });
    form.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", () => {
        const field = input.closest(".field");
        if (field.classList.contains("invalid")) {
          const name = input.name;
          if (validators[name] && validators[name](input.value))
            field.classList.remove("invalid");
        }
      });
    });
  }
})();
