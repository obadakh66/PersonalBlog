(function () {
  "use strict";

  var nav = document.querySelector("#siteNav");
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector("#navMenu");
  var backToTop = document.querySelector(".back-to-top");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Theme toggle ── */
  var themeToggle = document.getElementById("themeToggle");
  var html = document.documentElement;

  var savedTheme = localStorage.getItem("theme") || "dark";
  html.setAttribute("data-theme", savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  /* ── Lightbox ── */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox && lightbox.querySelector(".lightbox-img");
  var lightboxClose = lightbox && lightbox.querySelector(".lightbox-close");
  var lastFocused = null;

  function openLightbox(src) {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightbox.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute("hidden", "");
    document.body.style.overflow = "";
    lightboxImg.src = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".project-card").forEach(function (card) {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      openLightbox(card.getAttribute("href"));
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && !lightbox.hasAttribute("hidden")) {
      closeLightbox();
    }
  });

  /* ── Anchor links: smooth scroll + close mobile menu ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var href = link.getAttribute("href");
      if (href === "#") return;
      var target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  /* ── Mobile nav toggle ── */
  function closeMenu() {
    if (!toggle || !menu) return;
    menu.classList.remove("open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = !menu.classList.contains("open");
      menu.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ── Close mobile menu on outside click ── */
  document.addEventListener("click", function (event) {
    if (menu && menu.classList.contains("open") &&
        !menu.contains(event.target) &&
        !toggle.contains(event.target)) {
      closeMenu();
    }
  });

  /* ── Scroll: back-to-top visibility + active nav link ── */
  function updateScrollState() {
    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 480);
    }

    var current = "home";
    document.querySelectorAll("main section[id], header[id]").forEach(function (section) {
      if (section.getBoundingClientRect().top <= 120) {
        current = section.id;
      }
    });

    document.querySelectorAll(".nav-menu a").forEach(function (link) {
      var href = link.getAttribute("href");
      link.classList.toggle("active", href === "#" + current);
    });

    /* Subtle nav shadow on scroll */
    if (nav) {
      nav.style.boxShadow = window.scrollY > 40
        ? "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset"
        : "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset";
    }
  }

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ── Scroll reveal with IntersectionObserver ── */
  var revealItems = document.querySelectorAll("[data-reveal]");
  if (revealItems.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) { item.classList.add("revealed"); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

      revealItems.forEach(function (item) { observer.observe(item); });
    }
  }

  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("load", updateScrollState);
  updateScrollState();
})();
