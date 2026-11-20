/**
 * Transserve landing — interactions (no frameworks)
 */
(function () {
  "use strict";

  const CFG = {
    login: "https://chotu-frontend-ngph.onrender.com/",
    register: "https://chotu-frontend-ngph.onrender.com/subscription-checkout",
    captainLogin: "",
    apkUrl:
      "https://expo.dev/accounts/raju005/projects/captain-app/builds/25829aac-479a-465b-8443-23094ae79b02",
    contactEmail: "support@transserve.in",
    privacyUrl: "",
    termsUrl: "",
  };

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  document.documentElement.setAttribute("data-theme", "light");

  /* Sticky header */
  const header = $(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Announcement */
  const annx = $("#annx");
  if (annx) annx.addEventListener("click", () => $("#ann")?.remove());

  /* Mobile nav */
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

  /* CFG links */
  $$("[data-cfg]").forEach((a) => {
    const key = a.dataset.cfg;
    const url = CFG[key];
    if (url) {
      a.href = url;
    } else {
      a.href = "#";
      a.setAttribute("aria-disabled", "true");
      a.addEventListener("click", (e) => e.preventDefault());
      if (key === "captainLogin") a.style.display = "none";
    }
  });

  /* Captain APK + QR */
  const apk = $("#apkbtn");
  const qrWrap = $("#qrwrap");
  const qrEl = $("#qr");
  if (apk) {
    if (CFG.apkUrl) {
      apk.href = CFG.apkUrl;
      apk.setAttribute("download", "");
      apk.textContent = "Download Captain APK";
      if (qrWrap && qrEl && typeof QRCode !== "undefined") {
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

  /* Footer company links */
  const flinks = $("#flinks");
  if (flinks) {
    const items = [];
    if (CFG.contactEmail) {
      items.push(`<li><a href="mailto:${CFG.contactEmail}">Contact Us</a></li>`);
    }
    if (CFG.privacyUrl) {
      items.push(`<li><a href="${CFG.privacyUrl}">Privacy Policy</a></li>`);
    }
    if (CFG.termsUrl) {
      items.push(`<li><a href="${CFG.termsUrl}">Terms and Conditions</a></li>`);
    }
    flinks.innerHTML = items.join("") || "<li>Contact details coming soon.</li>";
  }

  const yr = $("#yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* FAQ */
  $$(".faq-item").forEach((item) => {
    const btn = $("button", item);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* Hero entrance settle */
  window.setTimeout(() => {
    $(".hero-anim")?.classList.add("is-ready");
    $(".hero-visual")?.classList.add("is-ready");
  }, 1100);

  /* Scroll reveal */
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
