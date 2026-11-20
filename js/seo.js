/**
 * Transserve SEO / acquisition helpers — GA4 (optional), CTAs, language preference, demo form.
 */
(function () {
  "use strict";

  const CFG = window.TRANSERVE_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const pageMeta = document.body?.dataset || {};
  const pageLang = document.documentElement.lang?.startsWith("hi") ? "hi" : "en";
  const pageCategory = pageMeta.pageCategory || "general";

  /* ---------- GA4 (loads only when Measurement ID is set) ---------- */
  const tracked = new Set();
  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function initGA4() {
    const id = (CFG.ga4MeasurementId || "").trim();
    if (!id || id.includes("XXXX")) return;
    if (window.__tsGa4Ready) return;
    window.__tsGa4Ready = true;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", id, {
      anonymize_ip: true,
      send_page_view: true,
    });
    track("page_context", { page_category: pageCategory, language: pageLang });
  }

  function track(name, params) {
    const id = (CFG.ga4MeasurementId || "").trim();
    if (!id || id.includes("XXXX")) return;
    const key = name + ":" + JSON.stringify(params || {});
    if (tracked.has(key) && name.endsWith("_view")) return;
    if (name.endsWith("_view")) tracked.add(key);
    gtag("event", name, Object.assign({ language: pageLang, page_category: pageCategory }, params || {}));
  }

  window.TransserveTrack = track;
  initGA4();

  /* Category page views (once) */
  if (pageCategory === "restaurant") track("restaurant_page_view");
  if (pageCategory === "hotel") track("hotel_page_view");
  if (pageCategory === "resort") track("resort_page_view");
  if (pageCategory === "pricing") track("pricing_view");

  /* ---------- Language preference (no geo redirect) ---------- */
  const LANG_KEY = "ts_lang";
  $$("[data-lang-switch]").forEach((a) => {
    a.addEventListener("click", () => {
      const lang = a.getAttribute("data-lang-switch");
      try {
        localStorage.setItem(LANG_KEY, lang);
      } catch (_) {}
      track("language_switch", { to_language: lang });
    });
  });

  /* ---------- Wire CFG-style links from site-config ---------- */
  function setHref(el, url, disabledLabel) {
    if (!el) return;
    if (url) {
      el.href = url;
      el.removeAttribute("aria-disabled");
    } else {
      el.href = "#";
      el.setAttribute("aria-disabled", "true");
      el.addEventListener("click", (e) => e.preventDefault());
      if (disabledLabel) el.textContent = disabledLabel;
    }
  }

  $$("[data-cfg]").forEach((a) => {
    const key = a.dataset.cfg;
    const map = {
      login: CFG.loginUrl,
      register: CFG.registerUrl,
      captainLogin: CFG.captainLoginUrl,
      contact: CFG.contactEmail ? "mailto:" + CFG.contactEmail : "",
      demo: "/demo/",
      whatsapp: "",
    };
    if (key === "whatsapp") {
      const n = (CFG.whatsappNumber || "").replace(/\D/g, "");
      if (n) {
        const text = encodeURIComponent(
          pageLang === "hi"
            ? "नमस्ते, मुझे Transserve डेमो के बारे में जानकारी चाहिए।"
            : "Hi, I would like to know more about Transserve for my business.",
        );
        a.href = "https://wa.me/" + n + "?text=" + text;
        a.classList.remove("is-hidden");
        a.addEventListener("click", () => track("whatsapp_click", { conversion_source: pageCategory }));
      } else {
        a.classList.add("is-hidden");
        a.href = "#";
        a.setAttribute("aria-disabled", "true");
        a.addEventListener("click", (e) => e.preventDefault());
      }
      return;
    }
    if (key === "register") {
      setHref(a, map.register);
      a.addEventListener("click", () => track("signup_click", { conversion_source: pageCategory }));
      return;
    }
    if (key === "demo") {
      const href = a.getAttribute("href") || map.demo;
      a.href = pageLang === "hi" && href.startsWith("/demo") ? "/hi/demo/" : href.startsWith("http") ? href : href;
      if (pageLang === "hi" && (a.getAttribute("href") === "/demo/" || a.dataset.cfg === "demo")) {
        a.href = "/hi/demo/";
      }
      a.addEventListener("click", () => track("demo_request_click", { conversion_source: pageCategory }));
      return;
    }
    setHref(a, map[key]);
    if (key === "captainLogin" && !map.captainLogin) a.style.display = "none";
  });

  /* Fix demo links explicitly */
  $$('a[data-cfg="demo"]').forEach((a) => {
    a.href = pageLang === "hi" ? "/hi/demo/" : "/demo/";
  });

  /* ---------- WhatsApp blocks visibility ---------- */
  const hasWa = !!(CFG.whatsappNumber || "").replace(/\D/g, "");
  $$("[data-requires-whatsapp]").forEach((el) => {
    el.hidden = !hasWa;
  });
  $$("[data-requires-no-whatsapp]").forEach((el) => {
    el.hidden = hasWa;
  });

  /* ---------- Demo form (mailto fallback — no PII to GA4) ---------- */
  const form = $("#demo-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const business = String(fd.get("business") || "").trim();
      const type = String(fd.get("businessType") || "").trim();
      const city = String(fd.get("city") || "").trim();
      const name = String(fd.get("name") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const message = String(fd.get("message") || "").trim();

      if (!business || !name || !phone) {
        $("#demo-status").textContent =
          pageLang === "hi"
            ? "कृपया व्यवसाय का नाम, आपका नाम और फ़ोन नंबर भरें।"
            : "Please fill business name, your name and phone number.";
        return;
      }

      track("demo_form_submit", {
        conversion_source: pageCategory,
        business_type: type || "unspecified",
      });

      const subject = encodeURIComponent("Transserve demo request — " + business);
      const body = encodeURIComponent(
        [
          "Demo request from transserve.in",
          "",
          "Business: " + business,
          "Type: " + type,
          "City: " + city,
          "Name: " + name,
          "Phone: " + phone,
          "Email: " + email,
          "",
          "Message:",
          message,
        ].join("\n"),
      );
      const to = CFG.demoMailto || CFG.contactEmail || "support@transserve.in";
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
      $("#demo-status").textContent =
        pageLang === "hi"
          ? "आपका ईमेल ऐप खुल रहा है। बैकएंड फॉर्म उपलब्ध नहीं है — मेल भेजकर अनुरोध पूरा करें।"
          : "Opening your email app. There is no form backend yet — please send the email to complete the request.";
    });
  }

  /* ---------- Footer year + company links ---------- */
  const yr = $("#yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  const flinks = $("#flinks");
  if (flinks && !flinks.dataset.static) {
    const items = [];
    if (CFG.contactEmail) {
      items.push(`<li><a href="mailto:${CFG.contactEmail}">${pageLang === "hi" ? "संपर्क करें" : "Contact Us"}</a></li>`);
    }
    items.push(
      `<li><a href="${pageLang === "hi" ? "/hi/demo/" : "/demo/"}">${pageLang === "hi" ? "डेमो अनुरोध" : "Request a Demo"}</a></li>`,
    );
    if (CFG.privacyUrl) items.push(`<li><a href="${CFG.privacyUrl}">Privacy Policy</a></li>`);
    if (CFG.termsUrl) items.push(`<li><a href="${CFG.termsUrl}">Terms and Conditions</a></li>`);
    flinks.innerHTML = items.join("");
  }

  /* registration_complete must only fire after real success — never on click */
})();
