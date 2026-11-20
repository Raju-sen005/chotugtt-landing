/**
 * Generates static SEO pages for Transserve (EN + HI).
 * Run: node tools/generate-seo-pages.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ORIGIN = "https://transserve.in";

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function write(rel, content) {
  const full = path.join(ROOT, rel);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, content, "utf8");
  console.log("wrote", rel);
}

function abs(pathname) {
  return ORIGIN + pathname;
}

function langPrefix(lang) {
  return lang === "hi" ? "/hi" : "";
}

function pairPath(lang, slug) {
  // slug: "" | "restaurant-management-software" | "blog/foo"
  const base = slug ? `/${slug}/` : "/";
  return lang === "hi" ? `/hi${base === "/" ? "/" : base}` : base;
}

function hreflang(lang, slug) {
  const en = abs(pairPath("en", slug));
  const hi = abs(pairPath("hi", slug));
  const self = lang === "hi" ? hi : en;
  return `
  <link rel="canonical" href="${self}">
  <link rel="alternate" hreflang="en-IN" href="${en}">
  <link rel="alternate" hreflang="hi-IN" href="${hi}">
  <link rel="alternate" hreflang="x-default" href="${en}">`;
}

function assetPrefix(depth) {
  return "../".repeat(depth) || "./";
}

function chrome(opts) {
  const {
    lang,
    slug,
    title,
    description,
    depth,
    category,
    active,
    schemaExtra = "",
    bodyClass = "",
  } = opts;
  const p = assetPrefix(depth);
  const lp = langPrefix(lang);
  const isHi = lang === "hi";
  const home = lp || "/";
  const enAlt = pairPath("en", slug);
  const hiAlt = pairPath("hi", slug);

  const nav = isHi
    ? {
        product: "उत्पाद",
        restaurant: "रेस्तरां",
        hotel: "होटल",
        resort: "रिसॉर्ट",
        pricing: "मूल्य",
        blog: "ब्लॉग",
        demo: "डेमो",
        login: "लॉगिन",
        start: "शुरू करें",
        solutions: "समाधान",
      }
    : {
        product: "Product",
        restaurant: "Restaurant",
        hotel: "Hotel",
        resort: "Resort",
        pricing: "Pricing",
        blog: "Blog",
        demo: "Demo",
        login: "Login",
        start: "Get Started",
        solutions: "Solutions",
      };

  const footerBlurb = isHi
    ? "रेस्तरां, होटल और आतिथ्य व्यवसायों के लिए ऑर्डर, टेबल, बिलिंग, मेनू, कमरे और कैप्टन वर्कफ़्लो एक प्लेटफ़ॉर्म में।"
    : "A complete restaurant & hospitality platform for orders, tables, billing, menus, rooms and Captain workflows.";

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Transserve",
    url: ORIGIN,
    logo: abs("/img/transserve-mark.svg"),
    email: "support@transserve.in",
    description:
      "Transserve is a restaurant and hospitality platform for orders, tables, billing, menus, rooms, bookings and Captain workflows.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Transserve",
    url: ORIGIN,
    inLanguage: lang === "hi" ? "hi-IN" : "en-IN",
  };

  return `<!DOCTYPE html>
<html lang="${lang === "hi" ? "hi-IN" : "en-IN"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="theme-color" content="#FF315A">
  ${hreflang(lang, slug)}
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${abs(pairPath(lang, slug))}">
  <meta property="og:image" content="${abs("/img/transserve-mark.svg")}">
  <meta property="og:locale" content="${lang === "hi" ? "hi_IN" : "en_IN"}">
  <meta property="og:locale:alternate" content="${lang === "hi" ? "en_IN" : "hi_IN"}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <link rel="icon" href="${p}img/Vibrant_Transserve_Gradient_Logo-removebg-preview.png" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${p}css/main.css">
  <link rel="stylesheet" href="${p}css/seo-pages.css">
  <script type="application/ld+json">${JSON.stringify(orgSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>
  ${schemaExtra}
  <script src="${p}js/site-config.js" defer></script>
  <script src="${p}js/seo.js" defer></script>
  <script src="${p}js/main.js" defer></script>
</head>
<body class="${bodyClass}" data-page-category="${category}">
  <header class="site-header">
    <div class="nav-bar">
      <a class="brand" href="${home === "/" ? "/" : home}" aria-label="Transserve home">
        <img src="${p}img/transserve-mark.svg" width="36" height="36" alt="">
        <span>Transserve</span>
      </a>
      <nav class="nav-links" aria-label="Primary">
        <a href="${lp}/restaurant-management-software/" class="${active === "restaurant" ? "is-active" : ""}">${nav.restaurant}</a>
        <a href="${lp}/hotel-management-software/" class="${active === "hotel" ? "is-active" : ""}">${nav.hotel}</a>
        <a href="${lp}/resort-management-software/" class="${active === "resort" ? "is-active" : ""}">${nav.resort}</a>
        <a href="${lp}/pricing/" class="${active === "pricing" ? "is-active" : ""}">${nav.pricing}</a>
        <a href="${lp}/blog/" class="${active === "blog" ? "is-active" : ""}">${nav.blog}</a>
      </nav>
      <div class="nav-actions">
        <span class="lang-switch" aria-label="Language">
          <a href="${enAlt}" data-lang-switch="en" class="${lang === "en" ? "is-active" : ""}" hreflang="en-IN">EN</a>
          <a href="${hiAlt}" data-lang-switch="hi" class="${lang === "hi" ? "is-active" : ""}" hreflang="hi-IN">HI</a>
        </span>
        <a class="login-link" data-cfg="login">${nav.login}</a>
        <a class="btn btn-primary" data-cfg="register">${nav.start}</a>
      </div>
      <button class="burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mnav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <div class="mobile-nav" id="mnav">
    <a href="${lp}/restaurant-management-software/">${nav.restaurant}</a>
    <a href="${lp}/hotel-management-software/">${nav.hotel}</a>
    <a href="${lp}/resort-management-software/">${nav.resort}</a>
    <a href="${lp}/pricing/">${nav.pricing}</a>
    <a href="${lp}/blog/">${nav.blog}</a>
    <a href="${lp}/demo/">${nav.demo}</a>
    <div class="mobile-cta">
      <a class="btn btn-secondary" data-cfg="login">${nav.login}</a>
      <a class="btn btn-primary" data-cfg="register">${nav.start}</a>
    </div>
    <div style="padding:12px 0 0;display:flex;justify-content:center;">
      <span class="lang-switch">
        <a href="${enAlt}" data-lang-switch="en" class="${lang === "en" ? "is-active" : ""}">EN</a>
        <a href="${hiAlt}" data-lang-switch="hi" class="${lang === "hi" ? "is-active" : ""}">HI</a>
      </span>
    </div>
  </div>
`;
}

function footer(lang, depth) {
  const p = assetPrefix(depth);
  const lp = langPrefix(lang);
  const isHi = lang === "hi";
  return `
  <section class="cta-band">
    <div class="container">
      <h2>${isHi ? "अपने रेस्तरां या होटल के संचालन को सरल बनाएँ।" : "Make your restaurant or hotel operations simpler."}</h2>
      <p>${isHi ? "डेमो का अनुरोध करें, WhatsApp पर पूछें, या सीधे रजिस्टर करें।" : "Request a demo, enquire on WhatsApp, or register directly."}</p>
      <div class="cta-actions">
        <a class="btn btn-primary" data-cfg="demo">${isHi ? "डेमो अनुरोध" : "Request a Demo"}</a>
        <a class="btn btn-ghost" data-cfg="whatsapp" data-requires-whatsapp hidden>${isHi ? "WhatsApp" : "WhatsApp Enquiry"}</a>
        <a class="btn btn-ghost" data-cfg="register">${isHi ? "रजिस्टर करें" : "Register"}</a>
      </div>
      <p class="form-note" data-requires-no-whatsapp style="margin-top:14px;color:rgba(255,255,255,.7);">${isHi ? "WhatsApp नंबर कॉन्फ़िगर होने के बाद यहाँ दिखेगा।" : "WhatsApp CTA appears after the business number is configured in site-config."}</p>
    </div>
  </section>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <a class="brand" href="${lp || "/"}">
          <img src="${p}img/transserve-mark.svg" width="32" height="32" alt="">
          <span>Transserve</span>
        </a>
        <p>${isHi ? "रेस्तरां और आतिथ्य टीमों के लिए ऑर्डर, टेबल, बिलिंग, मेनू और गेस्ट संचालन।" : "A complete restaurant & hospitality platform for orders, tables, billing, menus and guest operations."}</p>
      </div>
      <div>
        <h4>${isHi ? "उत्पाद" : "Product"}</h4>
        <a href="${lp}/restaurant-management-software/">${isHi ? "रेस्तरां सॉफ्टवेयर" : "Restaurant software"}</a>
        <a href="${lp}/restaurant-pos-software/">${isHi ? "रेस्तरां POS" : "Restaurant POS"}</a>
        <a href="${lp}/hotel-management-software/">${isHi ? "होटल सॉफ्टवेयर" : "Hotel software"}</a>
        <a href="${lp}/room-management-software/">${isHi ? "रूम मैनेजमेंट" : "Room management"}</a>
        <a href="${lp}/resort-management-software/">${isHi ? "रिसॉर्ट सॉफ्टवेयर" : "Resort software"}</a>
      </div>
      <div>
        <h4>${isHi ? "संसाधन" : "Resources"}</h4>
        <a href="${lp}/pricing/">${isHi ? "मूल्य" : "Pricing"}</a>
        <a href="${lp}/blog/">${isHi ? "ब्लॉग" : "Blog"}</a>
        <a href="${lp}/demo/">${isHi ? "डेमो" : "Request a Demo"}</a>
        <a data-cfg="login">${isHi ? "ओनर लॉगिन" : "Owner Login"}</a>
      </div>
      <div>
        <h4>${isHi ? "कंपनी" : "Company"}</h4>
        <ul id="flinks"></ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>© <span id="yr"></span> Transserve. ${isHi ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}</p>
    </div>
  </footer>
</body>
</html>`;
}

function faqSchema(faqs) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function softAppSchema(name, desc, url) {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Android (Captain app)",
    description: desc,
    url,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description: "Subscription plans available after registration; prices shown in the product checkout.",
    },
  };
  // Avoid fake free price - better omit offers if price unknown
  delete data.offers;
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function breadcrumbSchema(items) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function crumbsHtml(items) {
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${items
    .map((it, i) =>
      i < items.length - 1
        ? `<a href="${it.path}">${it.name}</a><span aria-hidden="true">/</span>`
        : `<span aria-current="page">${it.name}</span>`,
    )
    .join("")}</nav>`;
}

function faqHtml(faqs, lang) {
  return `<div class="faq-list" style="margin-top:24px;">${faqs
    .map(
      ([q, a]) => `<article class="faq-item">
      <h3><button type="button" aria-expanded="false">${q}<svg class="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button></h3>
      <div class="faq-panel"><div><p>${a}</p></div></div>
    </article>`,
    )
    .join("")}</div>`;
}

function ctaButtons(lang) {
  const isHi = lang === "hi";
  return `<div class="hero-cta">
    <a class="btn btn-primary" data-cfg="demo">${isHi ? "डेमो अनुरोध करें" : "Request a Demo"}</a>
    <a class="btn btn-secondary" data-cfg="register">${isHi ? "रजिस्टर करें" : "Get Started"}</a>
    <a class="btn btn-secondary" data-cfg="whatsapp" data-requires-whatsapp hidden>${isHi ? "WhatsApp पर पूछें" : "WhatsApp Enquiry"}</a>
  </div>`;
}

/* -------------------- PAGE CONTENT -------------------- */

const pages = [];

function addCommercial(def) {
  pages.push(def);
}

addCommercial({
  slug: "restaurant-management-software",
  category: "restaurant",
  active: "restaurant",
  en: {
    title: "Restaurant Management Software India | Transserve",
    description:
      "Transserve restaurant management software for Indian restaurants—live orders, POS billing, tables, menus, offers and Captain app workflows.",
    h1: "Restaurant Management Software for Indian restaurants",
    lead: "Run dine-in and takeaway operations from one owner dashboard—orders, tables, billing, menus and service staff coordination with the Captain app.",
    body: `
      <h2>What Transserve helps restaurant teams do</h2>
      <p>Transserve is built for daily restaurant and café operations in India. Feature availability may vary by subscription plan. Use it to keep the floor and counter organised without juggling separate tools for every task.</p>
      <div class="feature-grid-seo">
        <article><h3>Live order management</h3><p>Track new, preparing and ready orders as they move through service.</p></article>
        <article><h3>Billing and POS</h3><p>Generate bills quickly for dine-in and takeaway and keep billing organised.</p></article>
        <article><h3>Table management</h3><p>See which tables are occupied or free at a glance.</p></article>
        <article><h3>Menu management</h3><p>Update items, categories and prices from one place.</p></article>
        <article><h3>Captain app</h3><p>Let service staff handle assigned orders from their Android device.</p></article>
        <article><h3>Offers, payments and sales overview</h3><p>Apply offers at billing, record payments, and review available sales information.</p></article>
      </div>
      <h2>Who should consider this</h2>
      <p>Independent restaurants, cafés and growing food businesses that want a clear workspace for orders, tables and billing. Hotels and resorts that also run dining can explore <a href="/hotel-management-software/">hotel</a> and <a href="/resort-management-software/">resort</a> capabilities.</p>
      <h2>Practical benefits</h2>
      <ul>
        <li>Keep orders organised from placement to payment recording</li>
        <li>Simplify restaurant billing at the counter</li>
        <li>Improve coordination between owner panel and Captain staff</li>
        <li>Monitor table activity during service</li>
      </ul>
      <p><strong>Note:</strong> Channel Manager is planned / Coming Soon and is not advertised as available today.</p>
    `,
    faqs: [
      [
        "Is Transserve a restaurant management system for India?",
        "Yes. Transserve is designed for restaurants and hospitality teams in India to manage orders, tables, billing and menus from one platform. Hotel and resort plans are available for stay operations.",
      ],
      [
        "Does it include a Captain app?",
        "Yes. Captains and service staff can use the Android Captain app to handle assigned restaurant orders and table service.",
      ],
      [
        "How do I get started?",
        "Use Get Started to register, or Request a Demo to email the Transserve team. Then set up your restaurant and menu from the dashboard.",
      ],
    ],
  },
  hi: {
    title: "रेस्तरां मैनेजमेंट सॉफ्टवेयर भारत | Transserve",
    description:
      "Transserve रेस्तरां मैनेजमेंट सॉफ्टवेयर—लाइव ऑर्डर, POS बिलिंग, टेबल, मेनू, ऑफ़र और कैप्टन ऐप वर्कफ़्लो भारतीय रेस्तरां के लिए।",
    h1: "भारतीय रेस्तरां के लिए मैनेजमेंट सॉफ्टवेयर",
    lead: "डाइन-इन और टेकअवे संचालन एक ओनर डैशबोर्ड से चलाएँ—ऑर्डर, टेबल, बिलिंग, मेनू और कैप्टन ऐप के साथ स्टाफ़ समन्वय।",
    body: `
      <h2>Transserve रेस्तरां टीमों की कैसे मदद करता है</h2>
      <p>Transserve भारत में रोज़मर्रा के रेस्तरां और कैफ़े संचालन के लिए बनाया गया है। सुविधाएँ सब्सक्रिप्शन प्लान के अनुसार उपलब्ध हो सकती हैं।</p>
      <div class="feature-grid-seo">
        <article><h3>लाइव ऑर्डर मैनेजमेंट</h3><p>नए, तैयार हो रहे और तैयार ऑर्डर की स्थिति ट्रैक करें।</p></article>
        <article><h3>बिलिंग और POS</h3><p>डाइन-इन और टेकअवे के बिल जल्दी बनाएँ और व्यवस्थित रखें।</p></article>
        <article><h3>टेबल मैनेजमेंट</h3><p>कौन सी टेबल खाली या व्यस्त है, एक नज़र में देखें।</p></article>
        <article><h3>मेनू मैनेजमेंट</h3><p>आइटम, कैटेगरी और कीमतें एक जगह से अपडेट करें।</p></article>
        <article><h3>कैप्टन ऐप</h3><p>सर्विस स्टाफ़ Android डिवाइस से असाइन किए गए ऑर्डर संभालें।</p></article>
        <article><h3>ऑफ़र, भुगतान और सेल्स</h3><p>बिलिंग पर ऑफ़र लगाएँ, भुगतान दर्ज करें और उपलब्ध सेल्स जानकारी देखें।</p></article>
      </div>
      <h2>किसके लिए उपयुक्त</h2>
      <p>स्वतंत्र रेस्तरां, कैफ़े और बढ़ते फूड बिज़नेस। डाइनिंग के साथ होटल/रिसॉर्ट चलाते हैं तो <a href="/hi/hotel-management-software/">होटल</a> और <a href="/hi/resort-management-software/">रिसॉर्ट</a> पेज देखें।</p>
      <p><strong>नोट:</strong> Channel Manager योजना / Coming Soon है—आज उपलब्ध के रूप में दावा नहीं किया जाता।</p>
    `,
    faqs: [
      [
        "क्या Transserve भारत के लिए रेस्तरां मैनेजमेंट सिस्टम है?",
        "हाँ। यह ऑर्डर, टेबल, बिलिंग और मेनू को एक प्लेटफ़ॉर्म से संभालने के लिए बनाया गया है। होटल और रिसॉर्ट प्लान भी उपलब्ध हैं।",
      ],
      [
        "क्या कैप्टन ऐप शामिल है?",
        "हाँ। सर्विस स्टाफ़ Android कैप्टन ऐप से असाइन किए गए ऑर्डर और टेबल सर्विस संभाल सकते हैं।",
      ],
      [
        "शुरू कैसे करें?",
        "Get Started से रजिस्टर करें, या डेमो अनुरोध से टीम को ईमेल करें। फिर डैशबोर्ड से रेस्तरां और मेनू सेट करें।",
      ],
    ],
  },
});

addCommercial({
  slug: "restaurant-pos-software",
  category: "restaurant",
  active: "restaurant",
  en: {
    title: "Restaurant POS & Billing Software India | Transserve",
    description:
      "Restaurant POS software for Indian restaurants—billing workflow, live orders, preparation tracking, payments, tables and Captain coordination.",
    h1: "Restaurant POS and billing software",
    lead: "Generate bills quickly, track orders through preparation, record payments, and keep table service aligned with the Captain app.",
    body: `
      <h2>Billing and order workflow</h2>
      <p>Transserve supports a practical order-to-payment flow for restaurants: new order → preparation tracking → Captain service → bill generation → payment recording. Opening a UPI link is not treated as verified payment; your team records payments in the system.</p>
      <div class="feature-grid-seo">
        <article><h3>Counter POS billing</h3><p>Create bills for dine-in and takeaway and keep billing organised.</p></article>
        <article><h3>Live orders &amp; prep status</h3><p>Follow orders as they move from new to preparing to ready—useful for kitchen coordination often called KOT-style prep tracking.</p></article>
        <article><h3>Table context</h3><p>Connect service to table occupancy so the floor stays clear.</p></article>
        <article><h3>Offers at billing</h3><p>Set up offers and apply discounts when generating the bill.</p></article>
        <article><h3>Payment tracking</h3><p>Record and review payments against each bill.</p></article>
        <article><h3>Captain handoff</h3><p>Service staff manage assigned orders on Android while the counter handles billing.</p></article>
      </div>
      <h2>Why restaurants compare POS tools</h2>
      <p>Indian restaurants often need faster billing, fewer missed order updates, and clearer handoff between kitchen and floor. Transserve focuses on these daily operations rather than unverified marketing claims.</p>
      <p>Looking for the broader system view? See <a href="/restaurant-management-software/">Restaurant Management Software</a>.</p>
    `,
    faqs: [
      [
        "Does Transserve work as restaurant billing software?",
        "Yes. You can generate bills for dine-in and takeaway, apply offers, and record payments against bills.",
      ],
      [
        "Can I track kitchen preparation?",
        "You can track order status through preparation and ready states so the team stays aligned during service.",
      ],
      [
        "Is there a mobile app for waiters?",
        "The Captain app on Android helps service staff handle assigned restaurant orders and table service.",
      ],
    ],
  },
  hi: {
    title: "रेस्तरां POS और बिलिंग सॉफ्टवेयर | Transserve",
    description:
      "भारतीय रेस्तरां के लिए POS सॉफ्टवेयर—बिलिंग, लाइव ऑर्डर, तैयारी ट्रैकिंग, भुगतान, टेबल और कैप्टन समन्वय।",
    h1: "रेस्तरां POS और बिलिंग सॉफ्टवेयर",
    lead: "जल्दी बिल बनाएँ, तैयारी तक ऑर्डर ट्रैक करें, भुगतान दर्ज करें, और कैप्टन ऐप से टेबल सर्विस जोड़ें।",
    body: `
      <h2>बिलिंग और ऑर्डर वर्कफ़्लो</h2>
      <p>Transserve का व्यावहारिक प्रवाह: नया ऑर्डर → तैयारी → कैप्टन सर्विस → बिल → भुगतान दर्ज करना। UPI लिंक खोलना सत्यापित भुगतान नहीं माना जाता।</p>
      <div class="feature-grid-seo">
        <article><h3>काउंटर POS बिलिंग</h3><p>डाइन-इन और टेकअवे के बिल बनाएँ और व्यवस्थित रखें।</p></article>
        <article><h3>लाइव ऑर्डर और तैयारी</h3><p>नया → तैयार हो रहा → तैयार—किचन समन्वय (अक्सर KOT-शैली) के लिए उपयोगी।</p></article>
        <article><h3>टेबल संदर्भ</h3><p>टेबल व्यस्त/खाली स्थिति के साथ सर्विस जोड़ें।</p></article>
        <article><h3>बिलिंग पर ऑफ़र</h3><p>ऑफ़र सेट करें और बिल बनाते समय छूट लगाएँ।</p></article>
        <article><h3>भुगतान ट्रैकिंग</h3><p>हर बिल के मुकाबले भुगतान दर्ज और समीक्षा करें।</p></article>
        <article><h3>कैप्टन हैंडऑफ़</h3><p>स्टाफ़ Android पर ऑर्डर संभालें; काउंटर बिलिंग करे।</p></article>
      </div>
      <p>पूरा सिस्टम देखने के लिए <a href="/hi/restaurant-management-software/">रेस्तरां मैनेजमेंट सॉफ्टवेयर</a> पढ़ें।</p>
    `,
    faqs: [
      [
        "क्या यह रेस्तरां बिलिंग सॉफ्टवेयर है?",
        "हाँ। डाइन-इन/टेकअवे बिल, ऑफ़र और भुगतान रिकॉर्डिंग उपलब्ध हैं।",
      ],
      [
        "किचन तैयारी ट्रैक हो सकती है?",
        "ऑर्डर स्थिति preparing/ready तक ट्रैक की जा सकती है ताकि टीम संरेखित रहे।",
      ],
      [
        "वेटर के लिए ऐप है?",
        "Android कैप्टन ऐप सर्विस स्टाफ़ को असाइन किए गए ऑर्डर और टेबल सर्विस में मदद करता है।",
      ],
    ],
  },
});

addCommercial({
  slug: "hotel-management-software",
  category: "hotel",
  active: "hotel",
  en: {
    title: "Hotel Management Software India | Transserve",
    description:
      "Hotel management software for India—room management, bookings, guest profiles, room QR ordering and room billing / folio workflows.",
    h1: "Hotel Management Software for Indian hotels",
    lead: "Manage rooms, bookings and guest stays alongside secure guest records—with room QR and room billing / folio support where included in your plan.",
    body: `
      <h2>Hospitality workflows on Transserve</h2>
      <p>Transserve hotel capabilities help property teams manage stay operations without inventing separate tools for every step. Availability depends on your subscription plan.</p>
      <div class="feature-grid-seo">
        <article><h3>Room management</h3><p>Organise rooms as part of daily hotel operations.</p></article>
        <article><h3>Bookings and check-in</h3><p>Run booking and check-in flow for guest stays.</p></article>
        <article><h3>Guest profiles</h3><p>Keep guest records organised for your team.</p></article>
        <article><h3>Room QR ordering</h3><p>Support QR-based guest ordering tied to rooms where enabled.</p></article>
        <article><h3>Room billing / folio</h3><p>Handle room billing and folio-style charges for stays.</p></article>
        <article><h3>Optional dining stack</h3><p>Add restaurant POS and Captain workflows when your property also runs F&amp;B—see Resort plans.</p></article>
      </div>
      <h2>Related pages</h2>
      <p>For a deeper focus on inventory and booking flow, see <a href="/room-management-software/">Room Management Software</a>. Properties that combine dining and stay should review <a href="/resort-management-software/">Resort Management Software</a>.</p>
      <p><strong>Note:</strong> Channel Manager is Coming Soon / planned—not available as a current feature claim.</p>
    `,
    faqs: [
      [
        "Is Transserve a hotel management system?",
        "Transserve includes hotel workflows for rooms, bookings, guest profiles, room QR and room billing/folio, depending on plan.",
      ],
      [
        "Can guests order via QR from the room?",
        "Room QR ordering is part of the hotel/room capabilities described on the product site, subject to plan entitlements.",
      ],
      [
        "Does it replace a channel manager today?",
        "No. Channel Manager is planned / Coming Soon and is not sold as available now.",
      ],
    ],
  },
  hi: {
    title: "होटल मैनेजमेंट सॉफ्टवेयर भारत | Transserve",
    description:
      "भारत के लिए होटल मैनेजमेंट सॉफ्टवेयर—रूम, बुकिंग, गेस्ट प्रोफ़ाइल, रूम QR ऑर्डरिंग और रूम बिलिंग / folio।",
    h1: "भारतीय होटलों के लिए मैनेजमेंट सॉफ्टवेयर",
    lead: "कमरे, बुकिंग और गेस्ट स्टे संभालें—रूम QR और रूम बिलिंग / folio आपके प्लान के अनुसार।",
    body: `
      <h2>Transserve पर होटल वर्कफ़्लो</h2>
      <p>रूम मैनेजमेंट, बुकिंग/चेक-इन, गेस्ट प्रोफ़ाइल, रूम QR और रूम बिलिंग/folio—प्लान के अनुसार उपलब्ध।</p>
      <div class="feature-grid-seo">
        <article><h3>रूम मैनेजमेंट</h3><p>रोज़मर्रा के होटल संचालन में कमरे व्यवस्थित करें।</p></article>
        <article><h3>बुकिंग और चेक-इन</h3><p>गेस्ट स्टे के लिए बुकिंग और चेक-इन प्रवाह चलाएँ।</p></article>
        <article><h3>गेस्ट प्रोफ़ाइल</h3><p>टीम के लिए गेस्ट रिकॉर्ड व्यवस्थित रखें।</p></article>
        <article><h3>रूम QR ऑर्डरिंग</h3><p>जहाँ सक्षम हो, कमरे से QR ऑर्डरिंग।</p></article>
        <article><h3>रूम बिलिंग / folio</h3><p>स्टे से जुड़े रूम बिलिंग और folio-शैली चार्ज।</p></article>
        <article><h3>वैकल्पिक डाइनिंग</h3><p>F&amp;B भी चलाते हैं तो रेस्तरां/रिसॉर्ट क्षमताएँ देखें।</p></article>
      </div>
      <p><a href="/hi/room-management-software/">रूम मैनेजमेंट</a> और <a href="/hi/resort-management-software/">रिसॉर्ट</a> पेज भी देखें। Channel Manager Coming Soon है।</p>
    `,
    faqs: [
      [
        "क्या यह होटल मैनेजमेंट सिस्टम है?",
        "हाँ—रूम, बुकिंग, गेस्ट, रूम QR और रूम बिलिंग/folio प्लान के अनुसार।",
      ],
      [
        "क्या रूम से QR ऑर्डर हो सकता है?",
        "रूम QR ऑर्डरिंग होटल/रूम क्षमताओं का हिस्सा है, प्लान के अनुसार।",
      ],
      [
        "क्या Channel Manager आज उपलब्ध है?",
        "नहीं। यह योजना / Coming Soon है।",
      ],
    ],
  },
});

addCommercial({
  slug: "room-management-software",
  category: "hotel",
  active: "hotel",
  en: {
    title: "Hotel Room Management & Booking Software | Transserve",
    description:
      "Hotel room management software—room inventory, booking workflow, guest registration, room status, room billing and QR-based guest ordering.",
    h1: "Room management and booking software",
    lead: "Organise rooms, bookings and guest registration with clear stay billing—and QR-based guest ordering tied to rooms where your plan allows.",
    body: `
      <h2>Room operations covered</h2>
      <ul>
        <li>Room inventory and status as part of hotel operations</li>
        <li>Booking workflow and check-in flow</li>
        <li>Guest registration / guest profiles</li>
        <li>Room billing and folio-style charges</li>
        <li>Room QR for guest ordering (plan-dependent)</li>
      </ul>
      <h2>How this differs from the hotel overview page</h2>
      <p>This page focuses on room inventory, booking and billing detail. For the full hotel narrative, see <a href="/hotel-management-software/">Hotel Management Software</a>.</p>
      <h2>Use cases</h2>
      <p>Small and mid-size hotels that need a practical digital workspace for rooms and guests—without claiming unverified channel connections. Channel Manager remains Coming Soon.</p>
    `,
    faqs: [
      [
        "Can I manage room bookings in Transserve?",
        "Yes. Bookings and check-in flow are part of the hotel/room capabilities, depending on plan.",
      ],
      [
        "What is room folio support?",
        "Transserve supports room billing / folio workflows for stay-related charges as described on the product site.",
      ],
      [
        "Is QR ordering available for rooms?",
        "Room QR ordering is listed among hotel capabilities and depends on your entitlements.",
      ],
    ],
  },
  hi: {
    title: "होटल रूम मैनेजमेंट और बुकिंग सॉफ्टवेयर | Transserve",
    description:
      "रूम इन्वेंटरी, बुकिंग, गेस्ट रजिस्ट्रेशन, रूम स्टेटस, रूम बिलिंग और QR गेस्ट ऑर्डरिंग के लिए सॉफ्टवेयर।",
    h1: "रूम मैनेजमेंट और बुकिंग सॉफ्टवेयर",
    lead: "कमरे, बुकिंग और गेस्ट रजिस्ट्रेशन व्यवस्थित करें—रूम बिलिंग और QR ऑर्डरिंग आपके प्लान के अनुसार।",
    body: `
      <h2>रूम संचालन</h2>
      <ul>
        <li>रूम इन्वेंटरी और स्थिति</li>
        <li>बुकिंग वर्कफ़्लो और चेक-इन</li>
        <li>गेस्ट रजिस्ट्रेशन / प्रोफ़ाइल</li>
        <li>रूम बिलिंग और folio-शैली चार्ज</li>
        <li>रूम QR गेस्ट ऑर्डरिंग (प्लान पर निर्भर)</li>
      </ul>
      <p>पूर्ण होटल अवलोकन: <a href="/hi/hotel-management-software/">होटल मैनेजमेंट सॉफ्टवेयर</a>। Channel Manager Coming Soon है।</p>
    `,
    faqs: [
      [
        "क्या रूम बुकिंग मैनेज हो सकती है?",
        "हाँ—बुकिंग और चेक-इन प्रवाह प्लान के अनुसार उपलब्ध हैं।",
      ],
      [
        "folio सपोर्ट क्या है?",
        "स्टे से जुड़े रूम बिलिंग / folio वर्कफ़्लो उत्पाद साइट के अनुसार समर्थित हैं।",
      ],
      [
        "रूम QR ऑर्डरिंग?",
        "होटल क्षमताओं में शामिल है; एंटाइटेलमेंट पर निर्भर।",
      ],
    ],
  },
});

addCommercial({
  slug: "resort-management-software",
  category: "resort",
  active: "resort",
  en: {
    title: "Resort Management Software | Restaurant + Hotel | Transserve",
    description:
      "Resort management software combining restaurant and hotel operations—POS, orders, Captain app, rooms, bookings, guest profiles and room billing under one tenant.",
    h1: "Resort management: restaurant and hotel together",
    lead: "Combine dining and stay operations under one tenant account with plan-based entitlements for restaurant and hotel feature tiers.",
    body: `
      <h2>What “resort” means on Transserve</h2>
      <p>Resort plans bring restaurant-tier features and hotel-tier features together—shared staff and profile tools under one account. Exact modules depend on entitlements.</p>
      <div class="feature-grid-seo">
        <article><h3>Restaurant tier</h3><p>Live orders, POS billing, tables, menus, offers and Captain workflows.</p></article>
        <article><h3>Hotel tier</h3><p>Rooms, bookings, guest profiles, room QR and room billing / folio.</p></article>
        <article><h3>One tenant</h3><p>Operate dining and stay without maintaining completely separate product silos.</p></article>
        <article><h3>Plan-based access</h3><p>Features unlock according to your subscription—availability may vary.</p></article>
      </div>
      <h2>Who it is for</h2>
      <p>Resorts and hospitality businesses that run both F&amp;B and rooms. Pure restaurants should start with <a href="/restaurant-management-software/">restaurant software</a>; room-only properties with <a href="/hotel-management-software/">hotel software</a>.</p>
      <p>Channel Manager is Coming Soon and is not a current resort feature claim.</p>
    `,
    faqs: [
      [
        "Is Transserve hospitality management software?",
        "Yes. It covers restaurant and hotel operations, including combined resort-style tenancy with plan-based entitlements.",
      ],
      [
        "Can I run restaurant and hotel on one account?",
        "Resort positioning combines restaurant and hotel tier features under one tenant account, subject to plan.",
      ],
      [
        "Where do I compare plans?",
        "See the Pricing page for how plans are presented, then register to view live checkout options.",
      ],
    ],
  },
  hi: {
    title: "रिसॉर्ट मैनेजमेंट सॉफ्टवेयर | रेस्तरां + होटल | Transserve",
    description:
      "रेस्तरां और होटल संचालन एक साथ—POS, ऑर्डर, कैप्टन, रूम, बुकिंग, गेस्ट और रूम बिलिंग एक टैनेंट में।",
    h1: "रिसॉर्ट मैनेजमेंट: रेस्तरां और होटल एक साथ",
    lead: "डाइनिंग और स्टे संचालन एक टैनेंट अकाउंट में—रेस्तरां और होटल फीचर टियर प्लान के अनुसार।",
    body: `
      <h2>Transserve पर रिसॉर्ट का मतलब</h2>
      <p>रिसॉर्ट प्लान रेस्तरां-टियर और होटल-टियर सुविधाएँ एक अकाउंट में लाते हैं। साझा स्टाफ़/प्रोफ़ाइल टूल। सटीक मॉड्यूल एंटाइटेलमेंट पर निर्भर।</p>
      <div class="feature-grid-seo">
        <article><h3>रेस्तरां टियर</h3><p>लाइव ऑर्डर, POS, टेबल, मेनू, ऑफ़र, कैप्टन।</p></article>
        <article><h3>होटल टियर</h3><p>रूम, बुकिंग, गेस्ट, रूम QR, रूम बिलिंग/folio।</p></article>
        <article><h3>एक टैनेंट</h3><p>डाइनिंग और स्टे अलग-अलग साइलो के बिना।</p></article>
        <article><h3>प्लान-आधारित पहुँच</h3><p>सुविधाएँ सब्सक्रिप्शन के अनुसार खुलती हैं।</p></article>
      </div>
      <p>Channel Manager Coming Soon है। <a href="/hi/pricing/">मूल्य</a> पेज देखें।</p>
    `,
    faqs: [
      [
        "क्या यह हॉस्पिटैलिटी मैनेजमेंट सॉफ्टवेयर है?",
        "हाँ—रेस्तरां और होटल संचालन, रिसॉर्ट-शैली संयुक्त टैनेंसी सहित।",
      ],
      [
        "एक अकाउंट में दोनों?",
        "रिसॉर्ट पोजिशनिंग दोनों टियर को एक टैनेंट में लाती है, प्लान के अनुसार।",
      ],
      [
        "प्लान कहाँ देखें?",
        "Pricing पेज देखें, फिर रजिस्टर कर लाइव चेकआउट विकल्प देखें।",
      ],
    ],
  },
});

/* Generate commercial pages */
for (const page of pages) {
  for (const lang of ["en", "hi"]) {
    const c = page[lang];
    const depth = lang === "hi" ? 2 : 1;
    const lp = langPrefix(lang);
    const homeName = lang === "hi" ? "होम" : "Home";
    const crumbs = [
      { name: homeName, path: lp || "/" },
      { name: c.h1.split(":")[0].slice(0, 48), path: pairPath(lang, page.slug) },
    ];
    const related =
      lang === "hi"
        ? `<div class="related-links">
        <a href="/hi/restaurant-management-software/">रेस्तरां सॉफ्टवेयर<span>ऑर्डर, टेबल, मेनू</span></a>
        <a href="/hi/hotel-management-software/">होटल सॉफ्टवेयर<span>रूम और गेस्ट</span></a>
        <a href="/hi/pricing/">मूल्य<span>प्लान समझें</span></a>
      </div>`
        : `<div class="related-links">
        <a href="/restaurant-management-software/">Restaurant software<span>Orders, tables, menus</span></a>
        <a href="/hotel-management-software/">Hotel software<span>Rooms and guests</span></a>
        <a href="/pricing/">Pricing<span>Understand plans</span></a>
      </div>`;

    const html =
      chrome({
        lang,
        slug: page.slug,
        title: c.title,
        description: c.description,
        depth,
        category: page.category,
        active: page.active,
        schemaExtra:
          faqSchema(c.faqs) +
          softAppSchema("Transserve", c.description, abs(pairPath(lang, page.slug))) +
          breadcrumbSchema([
            { name: "Home", path: lang === "hi" ? "/hi/" : "/" },
            { name: c.h1, path: pairPath(lang, page.slug) },
          ]),
      }) +
      `<main>
    <section class="page-hero">
      <div class="container">
        ${crumbsHtml(crumbs)}
        <p class="eyebrow">Transserve</p>
        <h1>${c.h1}</h1>
        <p class="lead">${c.lead}</p>
        ${ctaButtons(lang)}
      </div>
    </section>
    <section class="section">
      <div class="container prose reveal">
        ${c.body}
        <h2>${lang === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently asked questions"}</h2>
        ${faqHtml(c.faqs, lang)}
        <div class="cta-strip">
          <h2>${lang === "hi" ? "अगला कदम" : "Next step"}</h2>
          <p>${lang === "hi" ? "डेमो अनुरोध करें या रजिस्टर कर डैशबोर्ड देखें।" : "Request a demo or register to open the dashboard."}</p>
          ${ctaButtons(lang)}
        </div>
        <h2>${lang === "hi" ? "संबंधित" : "Related"}</h2>
        ${related}
      </div>
    </section>
  </main>` +
      footer(lang, depth);

    const rel =
      lang === "hi"
        ? path.join("hi", page.slug, "index.html")
        : path.join(page.slug, "index.html");
    write(rel, html);
  }
}

/* Pricing */
function pricingPage(lang) {
  const isHi = lang === "hi";
  const depth = isHi ? 2 : 1;
  const title = isHi
    ? "Transserve मूल्य और प्लान | रेस्तरां, होटल, रिसॉर्ट"
    : "Transserve Pricing & Plans | Restaurant, Hotel, Resort";
  const description = isHi
    ? "Transserve प्लान रेस्तरां, होटल और रिसॉर्ट एंटाइटेलमेंट के अनुसार मिलते हैं। लाइव कीमतें रजिस्ट्रेशन चेकआउट में दिखती हैं।"
    : "Transserve plans follow restaurant, hotel and resort entitlements. Live prices appear in registration checkout—this page does not invent tariffs.";
  const body = isHi
    ? `<h2>प्लान कैसे काम करते हैं</h2>
      <p>Transserve सुविधाएँ सब्सक्रिप्शन प्लान पर निर्भर करती हैं। रेस्तरां, होटल और रिसॉर्ट टियर अलग एंटाइटेलमेंट देते हैं। इस पेज पर काल्पनिक कीमतें या छूट नहीं लिखी गई हैं।</p>
      <ul>
        <li><strong>Restaurant</strong> — काउंटर POS, लाइव ऑर्डर, मेनू, टेबल, कैप्टन</li>
        <li><strong>Hotel</strong> — रूम, बुकिंग, गेस्ट, रूम QR, रूम बिलिंग/folio</li>
        <li><strong>Resort</strong> — रेस्तरां + होटल टियर एक टैनेंट में</li>
      </ul>
      <p>लाइव मूल्य और भुगतान विकल्प देखने के लिए <strong>Get Started / रजिस्टर</strong> से प्रोडक्ट चेकआउट खोलें।</p>
      <p>Channel Manager Coming Soon है और वर्तमान प्लान दावे में शामिल नहीं है।</p>`
    : `<h2>How plans work</h2>
      <p>Transserve features depend on your subscription plan. Restaurant, hotel and resort tiers unlock different entitlements. This page does <strong>not</strong> invent prices, discounts or customer counts.</p>
      <ul>
        <li><strong>Restaurant</strong> — counter POS, live orders, menus, tables, Captain app</li>
        <li><strong>Hotel</strong> — rooms, bookings, guests, room QR, room billing/folio</li>
        <li><strong>Resort</strong> — restaurant + hotel tiers under one tenant</li>
      </ul>
      <p>To see live pricing and payment options, use <strong>Get Started</strong> to open the product checkout experience.</p>
      <p>Channel Manager is Coming Soon and is not included as a current plan claim.</p>`;

  const html =
    chrome({
      lang,
      slug: "pricing",
      title,
      description,
      depth,
      category: "pricing",
      active: "pricing",
      schemaExtra: breadcrumbSchema([
        { name: "Home", path: isHi ? "/hi/" : "/" },
        { name: "Pricing", path: pairPath(lang, "pricing") },
      ]),
    }) +
    `<main>
    <section class="page-hero"><div class="container">
      ${crumbsHtml([
        { name: isHi ? "होम" : "Home", path: isHi ? "/hi/" : "/" },
        { name: isHi ? "मूल्य" : "Pricing", path: pairPath(lang, "pricing") },
      ])}
      <p class="eyebrow">${isHi ? "मूल्य" : "Pricing"}</p>
      <h1>${isHi ? "प्लान और एंटाइटेलमेंट" : "Plans and entitlements"}</h1>
      <p class="lead">${description}</p>
      ${ctaButtons(lang)}
    </div></section>
    <section class="section"><div class="container prose reveal">${body}
      <div class="cta-strip"><h2>${isHi ? "प्लान देखने के लिए रजिस्टर करें" : "Register to view live plans"}</h2>
      <p>${isHi ? "चेकआउट में वास्तविक विकल्प दिखते हैं।" : "Real options appear inside checkout."}</p>
      ${ctaButtons(lang)}</div>
    </div></section>
  </main>` +
    footer(lang, depth);

  write(isHi ? "hi/pricing/index.html" : "pricing/index.html", html);
}
pricingPage("en");
pricingPage("hi");

/* Demo */
function demoPage(lang) {
  const isHi = lang === "hi";
  const depth = isHi ? 2 : 1;
  const title = isHi ? "Transserve डेमो अनुरोध" : "Request a Transserve Demo";
  const description = isHi
    ? "रेस्तरां, होटल या रिसॉर्ट के लिए Transserve डेमो का अनुरोध करें। फॉर्म ईमेल के माध्यम से टीम तक पहुँचता है।"
    : "Request a Transserve demo for your restaurant, hotel or resort. The form opens email to the Transserve team—no fake backend.";
  const html =
    chrome({
      lang,
      slug: "demo",
      title,
      description,
      depth,
      category: "demo",
      active: "",
    }) +
    `<main>
    <section class="page-hero"><div class="container">
      <p class="eyebrow">${isHi ? "डेमो" : "Demo"}</p>
      <h1>${isHi ? "डेमो अनुरोध करें" : "Request a demo"}</h1>
      <p class="lead">${description}</p>
    </div></section>
    <section class="section"><div class="container demo-layout">
      <div class="demo-card">
        <form id="demo-form" novalidate>
          <div class="form-field"><label for="business">${isHi ? "व्यवसाय का नाम *" : "Business name *"}</label><input id="business" name="business" required autocomplete="organization"></div>
          <div class="form-field"><label for="businessType">${isHi ? "प्रकार" : "Business type"}</label>
            <select id="businessType" name="businessType">
              <option value="restaurant">${isHi ? "रेस्तरां" : "Restaurant"}</option>
              <option value="hotel">${isHi ? "होटल" : "Hotel"}</option>
              <option value="resort">${isHi ? "रिसॉर्ट" : "Resort"}</option>
              <option value="other">${isHi ? "अन्य" : "Other"}</option>
            </select>
          </div>
          <div class="form-field"><label for="city">${isHi ? "शहर" : "City"}</label><input id="city" name="city" autocomplete="address-level2"></div>
          <div class="form-field"><label for="name">${isHi ? "आपका नाम *" : "Your name *"}</label><input id="name" name="name" required autocomplete="name"></div>
          <div class="form-field"><label for="phone">${isHi ? "फ़ोन *" : "Phone *"}</label><input id="phone" name="phone" required autocomplete="tel" inputmode="tel"></div>
          <div class="form-field"><label for="email">${isHi ? "ईमेल" : "Email"}</label><input id="email" name="email" type="email" autocomplete="email"></div>
          <div class="form-field"><label for="message">${isHi ? "संदेश" : "Message"}</label><textarea id="message" name="message" placeholder="${isHi ? "आपकी आवश्यकता संक्षेप में" : "Briefly describe what you need"}"></textarea></div>
          <button class="btn btn-primary" type="submit">${isHi ? "ईमेल से भेजें" : "Send via email"}</button>
          <p class="form-note">${isHi ? "अभी कोई फॉर्म बैकएंड नहीं है। सबमिट आपके ईमेल ऐप में ड्राफ्ट खोलेगा (support@transserve.in)। नाम/फ़ोन GA4 को नहीं भेजे जाते।" : "There is no form backend yet. Submit opens your email app to support@transserve.in. Names/phones are never sent to GA4."}</p>
          <p id="demo-status" role="status" aria-live="polite"></p>
        </form>
      </div>
      <div>
        <h2>${isHi ? "अन्य तरीके" : "Other ways to connect"}</h2>
        <ul class="check-list" style="margin-top:16px;">
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg> <a data-cfg="register">${isHi ? "सीधे रजिस्टर करें" : "Register directly"}</a></li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg> <a href="mailto:support@transserve.in">support@transserve.in</a></li>
          <li data-requires-whatsapp hidden><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg> <a data-cfg="whatsapp">${isHi ? "WhatsApp" : "WhatsApp enquiry"}</a></li>
        </ul>
        <p class="form-note" data-requires-no-whatsapp>${isHi ? "WhatsApp CTA तब दिखेगा जब js/site-config.js में सत्यापित नंबर जोड़ा जाएगा।" : "WhatsApp CTA appears when a verified number is added in js/site-config.js."}</p>
      </div>
    </div></section>
  </main>` +
    footer(lang, depth);
  write(isHi ? "hi/demo/index.html" : "demo/index.html", html);
}
demoPage("en");
demoPage("hi");

console.log("Commercial, pricing, demo done");
