/**
 * Transserve landing — interactions (no frameworks)
 * CFG values prefer window.TRANSERVE_CONFIG when present.
 */
(function () {
  "use strict";

  const SITE = window.TRANSERVE_CONFIG || {};
  const CFG = {
    login: SITE.loginUrl || "https://chotu-frontend-ngph.onrender.com/",
    register:
      SITE.registerUrl ||
      "https://chotu-frontend-ngph.onrender.com/subscription-checkout",
    captainLogin: SITE.captainLoginUrl || "",
    apkUrl:
      SITE.apkUrl ||
      "https://expo.dev/accounts/raju005/projects/captain-app/builds/25829aac-479a-465b-8443-23094ae79b02",
    contactEmail: SITE.contactEmail || "support@transserve.in",
    privacyUrl: SITE.privacyUrl || "",
    termsUrl: SITE.termsUrl || "",
  };

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  document.documentElement.setAttribute("data-theme", "light");

  const header = $(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const annx = $("#annx");
  if (annx) annx.addEventListener("click", () => $("#ann")?.remove());

  const burger = $("#burger");
  const mnav = $("#mnav");
  const setMenu = (open) => {
    if (!burger || !mnav) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mnav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  };
  if (burger && mnav) {
    burger.addEventListener("click", () => {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
    mnav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* Only wire CFG if seo.js did not already set a real href */
  $$("[data-cfg]").forEach((a) => {
    const key = a.dataset.cfg;
    if (key === "whatsapp" || key === "demo") return;
    const url = CFG[key];
    if (a.getAttribute("href") && a.getAttribute("href") !== "#" && a.getAttribute("href").startsWith("http")) {
      return;
    }
    if (url) {
      a.href = url;
    } else if (key === "captainLogin") {
      a.href = "#";
      a.setAttribute("aria-disabled", "true");
      a.style.display = "none";
      a.addEventListener("click", (e) => e.preventDefault());
    }
  });

  const apk = $("#apkbtn");
  const qrWrap = $("#qrwrap");
  const qrEl = $("#qr");
  if (apk) {
    if (CFG.apkUrl) {
      apk.href = CFG.apkUrl;
      apk.setAttribute("download", "");
      if (!apk.textContent.trim() || apk.textContent.includes("Coming")) {
        apk.textContent = document.documentElement.lang?.startsWith("hi")
          ? "कैप्टन APK डाउनलोड"
          : "Download Captain APK";
      }
      if (qrWrap && qrEl && typeof QRCode !== "undefined" && !qrEl.childElementCount) {
        try {
          new QRCode(qrEl, { text: CFG.apkUrl, width: 104, height: 104 });
          qrWrap.classList.add("is-visible");
        } catch (_) {}
      }
    } else {
      apk.href = "#";
      apk.setAttribute("aria-disabled", "true");
      apk.textContent = "APK Coming Soon";
      apk.addEventListener("click", (e) => e.preventDefault());
    }
  }

  const flinks = $("#flinks");
  if (flinks && !flinks.dataset.static && !flinks.children.length) {
    const isHi = document.documentElement.lang?.startsWith("hi");
    const items = [];
    if (CFG.contactEmail) {
      items.push(
        `<li><a href="mailto:${CFG.contactEmail}">${isHi ? "संपर्क करें" : "Contact Us"}</a></li>`,
      );
    }
    items.push(
      `<li><a href="${isHi ? "/hi/demo/" : "/demo/"}">${isHi ? "डेमो अनुरोध" : "Request a Demo"}</a></li>`,
    );
    if (CFG.privacyUrl) items.push(`<li><a href="${CFG.privacyUrl}">Privacy Policy</a></li>`);
    if (CFG.termsUrl) items.push(`<li><a href="${CFG.termsUrl}">Terms and Conditions</a></li>`);
    flinks.innerHTML = items.join("") || "<li>Contact details coming soon.</li>";
  }

  const yr = $("#yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  $$(".faq-item").forEach((item) => {
    const btn = $("button", item);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  window.setTimeout(() => {
    $(".hero-anim")?.classList.add("is-ready");
    $(".hero-visual")?.classList.add("is-ready");
  }, 1100);

  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 70}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }
})();
