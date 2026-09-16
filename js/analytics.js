/* ==========================================================================
   Arkay Software Solutions Limited — Analytics + cookie consent
   --------------------------------------------------------------------------
   Google Analytics 4 (GA4), loaded ONLY after the visitor accepts cookies,
   to comply with UK GDPR / PECR.

   >>> To activate: replace G-XXXXXXXXXX below with your real GA4
       Measurement ID (Admin → Data Streams → Web). Until a real ID is set,
       analytics and the cookie banner stay disabled and nothing is tracked.
   ========================================================================== */
(function () {
  "use strict";

  var GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // <-- replace with your GA4 ID
  var STORAGE_KEY = "arkay-cookie-consent"; // "granted" | "denied"

  // Guard: do nothing until a real Measurement ID is configured.
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf("XXXX") !== -1) return;

  var consent = safeGet(STORAGE_KEY);

  document.addEventListener("DOMContentLoaded", function () {
    if (consent === "granted") {
      loadGA();
    } else if (consent !== "denied") {
      showBanner();
    }
  });

  /* Load Google Analytics 4 --------------------------------------------- */
  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  /* Cookie consent banner ----------------------------------------------- */
  function showBanner() {
    var banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.innerHTML =
      '<p class="cookie-banner__text">We use cookies to analyse site traffic and improve your experience. ' +
      'See our <a href="#">Privacy Policy</a> for details.</p>' +
      '<div class="cookie-banner__actions">' +
        '<button type="button" class="btn btn--ghost cookie-decline">Decline</button>' +
        '<button type="button" class="btn btn--primary cookie-accept">Accept</button>' +
      '</div>';
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add("show"); });

    banner.querySelector(".cookie-accept").addEventListener("click", function () {
      safeSet(STORAGE_KEY, "granted");
      dismiss(banner);
      loadGA();
    });
    banner.querySelector(".cookie-decline").addEventListener("click", function () {
      safeSet(STORAGE_KEY, "denied");
      dismiss(banner);
    });
  }

  function dismiss(banner) {
    banner.classList.remove("show");
    setTimeout(function () { banner.remove(); }, 400);
  }

  /* Safe storage helpers (private mode / blocked storage) --------------- */
  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
})();
