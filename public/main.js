/* =========================================================
   SCROLL VELOCITY TRACKING (GLOBAL)
========================================================= */
let lastScrollY = window.scrollY;
let scrollVelocity = 0;

window.addEventListener("scroll", () => {
  const currentY = window.scrollY;
  scrollVelocity = Math.min(40, Math.abs(currentY - lastScrollY));
  lastScrollY = currentY;
});

/* =========================================================
   SCROLL FADE (SECTION OPACITY)
========================================================= */
function initScrollOpacity() {
  const sections = document.querySelectorAll("[data-scroll-fade]");
  if (!sections.length) return;

  function onScroll() {
    const vh = window.innerHeight;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const visible = Math.min(
        1,
        Math.max(0, (vh - rect.top) / (vh * 0.6))
      );
      section.style.opacity = Math.max(0.65, 0.5 + visible * 0.5);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* =========================================================
   DARK MODE (SUNSET BASED)
========================================================= */
function applyAutoDarkMode() {
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 7;
  document.documentElement.classList.toggle("dark", isNight);
}

/* =========================================================
   SCROLL REVEAL (GROUPED + VELOCITY AWARE)
========================================================= */
function initRevealAnimations() {
  const groups = document.querySelectorAll("[data-reveal-group]");
  if (!groups.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const group = entry.target;
      const items = group.querySelectorAll("[data-reveal]");

      let ease;
      if (scrollVelocity > 30) {
        ease = "cubic-bezier(.15,.85,.15,1)";
      } else if (scrollVelocity > 15) {
        ease = "cubic-bezier(.25,.8,.25,1)";
      } else {
        ease = "cubic-bezier(.4,0,.2,1)";
      }

      if (entry.isIntersecting) {
        items.forEach((el, i) => {
          el.classList.add("will-change-transform");
          el.style.transition =
            `opacity 720ms ${ease}, transform 600ms ${ease}`;

          setTimeout(() => {
            el.classList.remove("opacity-0", "translate-y-4");
            el.classList.add("opacity-100", "translate-y-0");
          }, i * 90);
        });
      } else {
        items.forEach(el => {
          el.style.transition =
            `opacity 400ms ${ease}, transform 400ms ${ease}`;
          el.classList.add("opacity-0", "translate-y-4");
          el.classList.remove("opacity-100", "translate-y-0");
        });
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: "0px 0px -80px 0px"
  });

  groups.forEach(group => io.observe(group));
}

/* =========================================================
   PROCESS SECTION ANIMATION
========================================================= */
function initProcessAnimation() {
  const processLine = document.querySelector("[data-process-line]");
  const processSteps = document.querySelectorAll("[data-process-step]");
  if (!processLine || !processSteps.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      processSteps.forEach((step, i) => {
        step.style.opacity = "0";
        step.style.transform = "translateY(8px)";
        step.style.transition =
          "opacity 720ms cubic-bezier(.4,0,.2,1), transform 600ms cubic-bezier(.4,0,.2,1)";

        setTimeout(() => {
          step.style.opacity = "1";
          step.style.transform = "translateY(0)";
        }, i * 140);
      });

      io.disconnect();
    });
  }, { threshold: 0.35 });

  io.observe(processLine);
}

/* =========================================================
   MOBILE HEADER (SCROLL APPEAR)
========================================================= */
function initMobileHeader() {
  const mobileHeader = document.getElementById("mobileHeader");
  if (!mobileHeader) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 120) {
      mobileHeader.classList.remove("-translate-y-full", "hidden");
      mobileHeader.classList.add("translate-y-0");
    } else {
      mobileHeader.classList.add("-translate-y-full");
    }
  });
}

/* =========================================================
   MOBILE SIDEBAR MENU
========================================================= */
function initMobileMenu() {
  const menuBtn = document.getElementById("menuBtnMobile");
  const closeBtn = document.getElementById("closeMenu");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!menuBtn || !mobileMenu) return;

  const closeMenu = () => {
    mobileMenu.classList.add("-translate-x-full");
  };

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("-translate-x-full");
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  /* ✅ CLOSE ON ANY LINK CLICK INSIDE MENU */
  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  /* ESC KEY */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
  });
}

/* =========================================================
   DESKTOP NAVBAR SCROLL POLISH
========================================================= */
function initDesktopNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;

  const logo = nav.querySelector("img");
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const blur = Math.min(16, y / 18);
    const opacity = y > 40 ? 0.75 : 0.6;
    const isDark = document.documentElement.classList.contains("dark");

    nav.style.backdropFilter = `blur(${blur}px)`;
    nav.style.backgroundColor = isDark
      ? `rgba(26,26,26,${opacity})`
      : `rgba(255,255,255,${opacity})`;

    nav.classList.toggle("shadow-md", y > 40);
    if (logo) logo.style.transform = y > 40 ? "scale(0.96)" : "scale(1)";
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  });
}

/* =========================================================
   ACTIVE NAV LINK (DESKTOP)
========================================================= */
function initActiveNav() {
  const navLinks = document.querySelectorAll("[data-link]");
  const sections = [...navLinks]
   .map(l => {
  const href = l.getAttribute("href");
  if (!href || !href.startsWith("/#")) return null;
  return document.querySelector(href.replace("/#", "#"));
})
.filter(Boolean);


  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 140) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        "after:w-full",
        link.getAttribute("href") === `/#${current}`
      );
    });
  });
}


  /* =========================================================
     NETLIFY FORM SUBMIT + TOAST
  ========================================================= */
  const form = document.querySelector("form[name='contact']");
  const toast = document.getElementById("formToast");

  if (form && toast) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      try {
        const res = await fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams(formData).toString()
        });

        if (res.ok) {
          form.reset();

          toast.classList.remove("hidden");
          toast.classList.add("opacity-100");

          setTimeout(() => {
            toast.classList.add("hidden");
          }, 3500);
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch {
        alert("Network error. Please try again.");
      }
    });
  }

/* =========================================================
   WHATSAPP CTA TEXT
========================================================= */
const waText = document.getElementById("waText");
if (waText) {
  const h = new Date().getHours();
  waText.textContent =
    h >= 22 || h < 8 ? "Leave us a message" : "Chat with us";
}

/* =========================================================
   CURRENCY AUTO-DETECT
========================================================= */
function detectCurrency() {
  const prices = document.querySelectorAll("[data-price]");
  if (!prices.length) return;

  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  let currency = "inr";

  if (locale.startsWith("en-US")) currency = "usd";
  if (locale.startsWith("en-GB") || locale.startsWith("de") || locale.startsWith("fr")) {
    currency = "eur";
  }

  prices.forEach(el => {
    if (el.dataset[currency]) el.textContent = el.dataset[currency];
  });
}

/* =========================================================
   LEAD SCORING
========================================================= */
function scoreLead() {
  const form = document.querySelector("form[name='contact']");
  if (!form) return;

  form.addEventListener("change", () => {
    let score = 0;
    const type = form.querySelector("[name='client_type']")?.value;
    const goal = form.querySelector("[name='primary_goal']")?.value;

    if (type === "Founder / Startup" || type === "Business owner") score += 2;
    if (goal === "Speed & performance" || goal === "Better credibility") score += 2;

    form.querySelector("#leadScore").value = score;
  });
}

/* =========================================================
   SITE INITIALIZATION
========================================================= */
function initSite() {

  /* YEAR */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* GREETING */
  const greet = document.getElementById("timeGreeting");
  if (greet) {
    const h = new Date().getHours();
    greet.textContent =
      h < 12 ? "Good morning" :
      h < 18 ? "Good afternoon" :
      "Good evening";
  }

  /* DARK MODE */
  applyAutoDarkMode();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    requestAnimationFrame(() => {
      initRevealAnimations();
      initProcessAnimation();
      initScrollOpacity();
      detectCurrency();
      scoreLead();
    });
  }

  initDesktopNavbar();
  initMobileHeader();
  initMobileMenu();
  initActiveNav();
}

document.addEventListener("DOMContentLoaded", initSite);

