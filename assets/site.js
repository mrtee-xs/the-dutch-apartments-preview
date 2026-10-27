/* Website Sales Factory — shared site behaviour (no dependencies, no secrets). */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");

  /* Mobile navigation (disclosure pattern) */
  var toggle = document.querySelector(".nav-toggle");
  var panel = toggle && document.getElementById(toggle.getAttribute("aria-controls"));
  function setOpen(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    var label = toggle.querySelector(".nav-toggle__label");
    if (label) label.textContent = open ? "Close" : "Menu";
  }
  if (toggle && panel) {
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    panel.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 56.01rem)").addEventListener("change", function (mq) { if (mq.matches) setOpen(false); });
  }

  /* Reveal on scroll (restrained) */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* WhatsApp enquiry form: composes a message and opens wa.me (no backend). */
  document.querySelectorAll("form[data-whatsapp]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form__status");
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        var ok = field.value.trim() !== "";
        field.setAttribute("aria-invalid", String(!ok));
        if (!ok && valid) { field.focus(); valid = false; }
      });
      if (!valid) { if (status) status.textContent = "Please fill in the required fields."; return; }
      var lines = [form.getAttribute("data-intro") || "Hello, I'd like to make an enquiry."];
      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        if (!field.name || !field.value.trim()) return;
        var label = form.querySelector('label[for="' + field.id + '"]');
        lines.push((label ? label.textContent.replace("*", "").trim() : field.name) + ": " + field.value.trim());
      });
      var number = form.getAttribute("data-whatsapp");
      var url = "https://wa.me/" + number + "?text=" + encodeURIComponent(lines.join("\n"));
      if (status) status.textContent = "Opening WhatsApp with your message…";
      window.open(url, "_blank", "noopener");
    });
  });

  /* Current year */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

/* ==========================================================================
   The Duch Apartments — Apple-Grade Micro-Interactions & Conversion Logic
   Brand: Forest Green (#1f4d3a) & Champagne Gold (#9a6a3e) on Crisp White
   ========================================================================== */

(function () {
  "use strict";

  // 1. Header scroll blur & shadow intensification
  var header = document.querySelector(".site-header");
  if (header) {
    var checkHeaderScroll = function () {
      if (window.scrollY > 24) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };
    window.addEventListener("scroll", checkHeaderScroll, { passive: true });
    checkHeaderScroll();
  }

  // 2. Mobile Sticky Quick-Booking Bar (Slides up when scrolling past hero)
  if (window.innerWidth <= 768) {
    var stickyBar = document.createElement("div");
    stickyBar.className = "mobile-sticky-bar";
    stickyBar.innerHTML = [
      '<div class="bar-info">',
      '  <span style="color:#065f46;font-weight:700;">● 24/7 Power Guaranteed</span>',
      '  <strong>The Duch Apartments</strong>',
      '</div>',
      '<a href="https://wa.me/2349038818601?text=Hello%20The%20Duch%20Apartments%2C%20I%20would%20like%20to%20check%20suite%20availability." target="_blank" rel="noopener" class="btn btn--whatsapp">',
      '  <span>Book on WhatsApp</span>',
      '</a>'
    ].join("");
    document.body.appendChild(stickyBar);

    var heroSection = document.querySelector(".hero");
    if (heroSection) {
      var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            stickyBar.classList.add("is-visible");
          } else {
            stickyBar.classList.remove("is-visible");
          }
        });
      }, { threshold: 0.1 });
      heroObserver.observe(heroSection);
    }
  }

  // 3. Quick-Book Suite Buttons on Service Cards
  // Turn each card into an irresistible direct-booking pathway
  document.querySelectorAll(".card").forEach(function (card) {
    var titleEl = card.querySelector(".card__title");
    var metaEl = card.querySelector(".card__meta");
    if (titleEl && metaEl && !card.querySelector(".btn--card-book")) {
      var suiteName = titleEl.textContent.trim();
      var btn = document.createElement("a");
      btn.className = "btn btn--whatsapp btn--small btn--card-book";
      btn.style.marginTop = "0.75rem";
      btn.style.width = "100%";
      btn.href = "https://wa.me/2349038818601?text=" + encodeURIComponent("Hello The Duch Apartments, I am interested in reserving the " + suiteName + ". Please confirm available dates.");
      btn.target = "_blank";
      btn.rel = "noopener";
      btn.innerHTML = '<span>Check ' + suiteName.split(" ")[0] + ' Availability →</span>';
      card.appendChild(btn);
    }
  });

  // 4. Interactive Suite Selection Enhancement in WhatsApp Form
  var form = document.querySelector("form[data-whatsapp]");
  var selectField = form && form.querySelector("select");
  if (form && selectField) {
    var chipsContainer = document.createElement("div");
    chipsContainer.className = "suite-chips";
    chipsContainer.style.display = "flex";
    chipsContainer.style.flexWrap = "wrap";
    chipsContainer.style.gap = "0.5rem";
    chipsContainer.style.marginTop = "0.25rem";
    chipsContainer.style.marginBottom = "0.75rem";

    var options = selectField.querySelectorAll("option");
    options.forEach(function (opt) {
      if (!opt.value) return;
      var chip = document.createElement("button");
      chip.type = "button";
      chip.textContent = opt.textContent.replace(" (Confirm fee)", "");
      chip.style.padding = "0.35rem 0.75rem";
      chip.style.borderRadius = "999px";
      chip.style.fontSize = "0.75rem";
      chip.style.fontWeight = "600";
      chip.style.background = "rgba(31, 77, 58, 0.08)";
      chip.style.border = "1px solid rgba(31, 77, 58, 0.2)";
      chip.style.color = "#1f4d3a";
      chip.style.cursor = "pointer";
      chip.style.transition = "all 180ms ease";

      chip.addEventListener("click", function () {
        selectField.value = opt.value;
        chipsContainer.querySelectorAll("button").forEach(function (b) {
          b.style.background = "rgba(31, 77, 58, 0.08)";
          b.style.color = "#1f4d3a";
          b.style.borderColor = "rgba(31, 77, 58, 0.2)";
        });
        chip.style.background = "#1f4d3a";
        chip.style.color = "#ffffff";
        chip.style.borderColor = "#1f4d3a";
      });
      chipsContainer.appendChild(chip);
    });

    selectField.parentNode.insertBefore(chipsContainer, selectField.nextSibling);
  }

  // 5. Tactile micro-click feedback on all action buttons
  document.querySelectorAll(".btn").forEach(function (b) {
    b.addEventListener("mousedown", function () {
      b.style.transform = "scale(0.97)";
    });
    b.addEventListener("mouseup", function () {
      b.style.transform = "";
    });
    b.addEventListener("mouseleave", function () {
      b.style.transform = "";
    });
  });

})();
