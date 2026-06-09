/* =====================================================================
   One Support Disability - site behaviour
   Injects shared header + footer, handles nav, accessibility tools,
   accordions, scroll reveal and form validation.
   Edit the NAV array or the footer template below to change them
   everywhere on the site at once.
   ===================================================================== */
(function () {
  "use strict";

  /* ---- Shared contact details (change once, updates everywhere) ---- */
  var SITE = {
    email: "support@onesupportdisability.com.au",
    phone: "0493 341 909",                                   // mobile
    abn: "54 680 063 432",                                    // ABN
    area: "Melbourne & Greater Victoria"
  };

  /* ---- Inline SVG icons ---- */
  var I = {
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
  };

  /* ---- Navigation model ---- */
  var NAV = [
    { key: "home", label: "Home", href: "index.html" },
    { key: "about", label: "About Us", href: "about.html" },
    { key: "services", label: "Services", href: "services.html", sub: [
      { key: "service-daily-living", label: "Daily Living & Personal Care", href: "service-daily-living.html", desc: "Everyday support, your way" },
      { key: "service-sil", label: "Supported Independent Living", href: "service-sil.html", desc: "Live independently with support" },
      { key: "service-community", label: "Community Participation", href: "service-community.html", desc: "Connect, learn & socialise" },
      { key: "service-transport", label: "Transport & Travel", href: "service-transport.html", desc: "Get where you need to be" }
    ]},
    { key: "ndis", label: "NDIS Info", href: "ndis.html" },
    { key: "referral", label: "Referrals", href: "referral.html" },
    { key: "careers", label: "Careers", href: "careers.html" }
  ];

  var page = document.body.getAttribute("data-page") || "home";

  /* ---- Entry welcome modal (shows once per browser session) ---- */
  (function entryModal() {
    var KEY = "osd-entry-ack";
    try { if (sessionStorage.getItem(KEY) === "1") return; } catch (e) {}
    var overlay = document.createElement("div");
    overlay.className = "entry-modal";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "entryTitle");
    overlay.innerHTML =
      '<div class="entry-modal__card">' +
        '<img class="entry-modal__logo" src="assets/images/logo.jpg" alt="One Support Disability">' +
        '<span class="entry-modal__badge">🤖 Moe’s AI Assistant</span>' +
        '<h2 id="entryTitle" class="entry-modal__title">Hey Sajad 👋</h2>' +
        '<p class="entry-modal__text">This is Moe’s AI Assistant. Don’t call me dumb next time.</p>' +
        '<button type="button" class="btn btn--accent btn--lg entry-modal__ok">OK</button>' +
      "</div>";
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    var ok = overlay.querySelector(".entry-modal__ok");
    setTimeout(function () { ok.focus(); }, 50);
    function close() {
      try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
      overlay.classList.add("is-closing");
      document.body.style.overflow = "";
      setTimeout(function () { overlay.remove(); }, 220);
    }
    ok.addEventListener("click", close);
    // Must press OK: keep focus trapped on the button; Enter/Space confirm.
    overlay.addEventListener("keydown", function (e) {
      if (e.key === "Tab") { e.preventDefault(); ok.focus(); }
      if (e.key === "Enter") { e.preventDefault(); close(); }
    });
  })();

  /* ---- Build header ---- */
  function buildHeader() {
    var items = NAV.map(function (n) {
      if (n.sub) {
        var subs = n.sub.map(function (s) {
          return '<li><a href="' + s.href + '" data-key="' + s.key + '">' + s.label +
                 '<small>' + s.desc + '</small></a></li>';
        }).join("");
        return '<li class="has-sub"><a href="' + n.href + '" data-key="' + n.key + '">' + n.label +
               " " + I.chevron + '</a><ul class="subnav">' + subs + "</ul></li>";
      }
      return '<li><a href="' + n.href + '" data-key="' + n.key + '">' + n.label + "</a></li>";
    }).join("");

    return '' +
      '<div class="topbar"><div class="container topbar__inner">' +
        '<div class="topbar__contact">' +
          '<a href="mailto:' + SITE.email + '">' + I.mail + '<span>' + SITE.email + '</span></a>' +
          '<span><i class="label" style="display:inline-flex;gap:.45em;align-items:center">' + I.pin + SITE.area + '</i></span>' +
        '</div>' +
        '<div class="topbar__tools">' +
          '<div class="a11y" role="group" aria-label="Adjust text size">' +
            '<span>Text size</span>' +
            '<button type="button" data-font="dec" aria-label="Decrease text size">A&#8722;</button>' +
            '<button type="button" data-font="reset" aria-label="Reset text size">A</button>' +
            '<button type="button" data-font="inc" aria-label="Increase text size">A+</button>' +
          '</div>' +
        '</div>' +
      '</div></div>' +
      '<div class="container"><nav class="nav" aria-label="Primary">' +
        '<a class="brand" href="index.html" aria-label="One Support Disability home">' +
          '<img src="assets/images/logo.jpg" alt="One Support Disability logo">' +
          '<span class="brand__name">One Support<small>DISABILITY · NDIS</small></span>' +
        '</a>' +
        '<ul class="nav__menu" id="navMenu">' + items +
          '<li class="nav__menu-cta"><a class="btn btn--accent" href="contact.html">Get Support</a></li>' +
        "</ul>" +
        '<div class="nav__actions">' +
          '<a class="btn btn--accent" href="contact.html">Get Support ' + I.arrow + "</a>" +
          '<button class="nav__toggle" id="navToggle" aria-expanded="false" aria-controls="navMenu" aria-label="Open menu">' +
            '<span class="icon-open">' + I.menu + "</span><span class=\"icon-close\">" + I.close + "</span>" +
          "</button>" +
        "</div>" +
      "</nav></div>" +
      '<div class="nav-backdrop" id="navBackdrop"></div>';
  }

  /* ---- Build footer ---- */
  function buildFooter() {
    var svc = NAV.find(function (n) { return n.key === "services"; });
    var svcLinks = svc.sub.map(function (s) {
      return '<li><a href="' + s.href + '">' + s.label + "</a></li>";
    }).join("");
    return '' +
      '<div class="container"><div class="footer__grid footer">' +
        '<div class="footer__brand">' +
          '<img src="assets/images/logo.jpg" alt="One Support Disability">' +
          '<p>Compassionate, person-centred NDIS support across ' + SITE.area +
          '. Empowering independence through quality care.</p>' +
          '<span class="ndis-badge">' + I.shield + " Registered NDIS Provider</span>" +
        "</div>" +
        '<div><h4>Explore</h4><ul>' +
          '<li><a href="about.html">About Us</a></li>' +
          '<li><a href="services.html">Our Services</a></li>' +
          '<li><a href="ndis.html">NDIS Info</a></li>' +
          '<li><a href="referral.html">Make a Referral</a></li>' +
          '<li><a href="careers.html">Careers</a></li>' +
          '<li><a href="contact.html">Contact</a></li>' +
        "</ul></div>" +
        '<div><h4>Services</h4><ul>' + svcLinks + "</ul></div>" +
        '<div class="footer__contact"><h4>Get in touch</h4><ul>' +
          "<li>" + I.mail + '<a href="mailto:' + SITE.email + '">' + SITE.email + "</a></li>" +
          "<li>" + I.phone + '<a href="tel:' + SITE.phone.replace(/\s/g, "") + '">' + SITE.phone + "</a></li>" +
          "<li>" + I.clock + "<span>Mon-Fri, 9am-5pm</span></li>" +
        "</ul></div>" +
      "</div>" +
      '<div class="footer__bottom">' +
        "<div>&copy; <span id=\"yr\"></span> One Support Disability. ABN " + SITE.abn + ". All rights reserved.</div>" +
        '<div class="links">' +
          '<a href="accessibility.html">Accessibility</a>' +
          '<a href="privacy.html">Privacy Policy</a>' +
          '<a href="contact.html">Contact</a>' +
        "</div>" +
      "</div></div>";
  }

  /* ---- Mount header & footer ---- */
  var headEl = document.getElementById("site-header");
  var footEl = document.getElementById("site-footer");
  if (headEl) { headEl.className = "site-header"; headEl.innerHTML = buildHeader(); }
  if (footEl) { footEl.className = "site-footer"; footEl.innerHTML = buildFooter(); }

  /* ---- Active nav state ---- */
  (function setActive() {
    var links = document.querySelectorAll(".nav__menu a[data-key]");
    var topMatch = false;
    links.forEach(function (a) {
      if (a.getAttribute("data-key") === page) { a.setAttribute("aria-current", "page"); topMatch = true; }
    });
    if (!topMatch && page.indexOf("service") === 0) {
      var parent = document.querySelector('.nav__menu a[data-key="services"]');
      if (parent) parent.setAttribute("aria-current", "page");
      var subItem = document.querySelector('.subnav a[data-key="' + page + '"]');
      if (subItem) subItem.setAttribute("aria-current", "page");
    }
  })();

  /* ---- Year ---- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = (new Date()).getFullYear();

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  var backdrop = document.getElementById("navBackdrop");
  function closeMenu() {
    menu.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      backdrop.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    backdrop.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { if (window.innerWidth <= 1024) closeMenu(); });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ---- Header shadow on scroll ---- */
  var hdr = document.querySelector(".site-header");
  function onScroll() { if (hdr) hdr.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---- Accessibility: font scaling ---- */
  var STEP = 0.1, MIN = 0.9, MAX = 1.4;
  function applyScale(v) {
    document.documentElement.style.setProperty("--font-scale", v);
    try { localStorage.setItem("osd-font-scale", v); } catch (e) {}
    document.querySelectorAll(".a11y button[data-font]").forEach(function (b) { b.classList.remove("is-active"); });
    if (v > 1.001) { var inc = document.querySelector('[data-font="inc"]'); if (inc) inc.classList.add("is-active"); }
    else if (v < 0.999) { var dec = document.querySelector('[data-font="dec"]'); if (dec) dec.classList.add("is-active"); }
  }
  var saved = 1;
  try { saved = parseFloat(localStorage.getItem("osd-font-scale")) || 1; } catch (e) {}
  applyScale(saved);
  document.querySelectorAll(".a11y button[data-font]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--font-scale")) || 1;
      var mode = btn.getAttribute("data-font");
      if (mode === "inc") cur = Math.min(MAX, cur + STEP);
      else if (mode === "dec") cur = Math.max(MIN, cur - STEP);
      else cur = 1;
      applyScale(Math.round(cur * 100) / 100);
    });
  });

  /* ---- Accordions ---- */
  document.querySelectorAll(".acc__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = btn.nextElementSibling;
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      panel.style.maxHeight = open ? null : panel.scrollHeight + "px";
    });
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Form validation (no backend - demo submit) ---- */
  document.querySelectorAll("form.js-form").forEach(function (form) {
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var valid = input.value.trim() !== "";
        if (valid && input.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        if (field) field.classList.toggle("invalid", !valid);
        if (!valid && ok) { input.focus(); }
        if (!valid) ok = false;
      });
      if (!ok) return;
      var success = form.querySelector(".form-success");
      form.querySelectorAll(".field, .form__note, button[type=submit]").forEach(function (el) { el.style.display = "none"; });
      if (success) { success.classList.add("show"); success.setAttribute("role", "status"); success.scrollIntoView({ behavior: "smooth", block: "center" }); }
    });
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field && field.classList.contains("invalid")) field.classList.remove("invalid");
      });
    });
  });
})();
