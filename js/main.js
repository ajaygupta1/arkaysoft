/* ==========================================================================
   Arkay Software Solutions Limited — Site interactions
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initYear();
    initMobileNav();
    initHeaderShadow();
    initReveal();
    initCounters();
    initFaq();
    initContactForm();
  });

  /* Footer year ---------------------------------------------------------- */
  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* Mobile navigation ---------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.querySelector(".nav__toggle");
    var links = document.querySelector(".nav__links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close when a link is tapped
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Sticky header shadow ------------------------------------------------- */
  function initHeaderShadow() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Reveal on scroll ----------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

    items.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 0.08) + "s";
      io.observe(el);
    });
  }

  /* Animated counters ---------------------------------------------------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    var run = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var decimals = (target % 1 !== 0) ? 1 : 0;
      var duration = 1600;
      var start = null;

      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = (target * eased).toFixed(decimals);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(run);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { io.observe(el); });
  }

  /* FAQ accordion -------------------------------------------------------- */
  function initFaq() {
    var items = document.querySelectorAll(".faq__item");
    if (!items.length) return;

    items.forEach(function (item) {
      var q = item.querySelector(".faq__q");
      var a = item.querySelector(".faq__a");
      if (!q || !a) return;

      q.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        // Close others
        items.forEach(function (other) {
          other.classList.remove("open");
          var oa = other.querySelector(".faq__a");
          if (oa) oa.style.maxHeight = null;
          var oq = other.querySelector(".faq__q");
          if (oq) oq.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          a.style.maxHeight = a.scrollHeight + "px";
          q.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* Contact form (client-side only, no backend) -------------------------- */
  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) return;
    var status = form.querySelector(".form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    // Enquiries are delivered here via the FormSubmit service (no backend
    // needed for this static site). Change the address to reroute enquiries.
    var FORM_ENDPOINT = "https://formsubmit.co/ajax/hello@arkaysoft.com";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var message = form.querySelector("#message");
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        return showStatus(status, "Please complete all required fields.", false);
      }
      if (!emailRe.test(email.value.trim())) {
        return showStatus(status, "Please enter a valid email address.", false);
      }

      // Honeypot: hidden field only bots fill in — silently drop if present.
      var honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value) { form.reset(); return; }

      var payload = {
        name: name.value.trim(),
        email: email.value.trim(),
        company: val(form, "#company"),
        interest: val(form, "#interest"),
        message: message.value.trim(),
        _subject: "New enquiry from arkaysoft.com",
        _template: "table"
      };

      setLoading(submitBtn, true);
      showStatus(status, "Sending your enquiry…", true);

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.ok; })
        .then(function (ok) {
          if (ok) {
            showStatus(
              status,
              "Thank you, " + payload.name + "! Your enquiry has been received. Our team will respond within one business day.",
              true
            );
            form.reset();
          } else {
            showStatus(status, "Sorry, something went wrong. Please email us directly at hello@arkaysoft.com.", false);
          }
        })
        .catch(function () {
          showStatus(status, "We couldn't send your enquiry — please check your connection or email hello@arkaysoft.com.", false);
        })
        .then(function () { setLoading(submitBtn, false); });
    });
  }

  function val(form, sel) {
    var el = form.querySelector(sel);
    return el ? el.value.trim() : "";
  }

  function setLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      if (!btn.dataset.label) btn.dataset.label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending…";
      btn.style.opacity = "0.75";
      btn.style.cursor = "wait";
    } else {
      btn.disabled = false;
      if (btn.dataset.label) btn.textContent = btn.dataset.label;
      btn.style.opacity = "";
      btn.style.cursor = "";
    }
  }

  function showStatus(el, msg, ok) {
    if (!el) return;
    el.textContent = msg;
    el.className = "form-status show " + (ok ? "ok" : "err");
  }
})();
