/**
 * Blog hub + 12 EN articles + 12 HI localized articles
 * Run: node tools/generate-blog.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ORIGIN = "https://transserve.in";

// Reuse helpers by duplicating minimal chrome (keep script standalone)
function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}
function write(rel, content) {
  const full = path.join(ROOT, rel);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, content, "utf8");
  console.log("wrote", rel);
}
function abs(p) {
  return ORIGIN + p;
}
function assetPrefix(depth) {
  return "../".repeat(depth) || "./";
}
function pairPath(lang, slug) {
  const base = slug ? `/${slug}/` : "/";
  return lang === "hi" ? `/hi${base === "/" ? "/" : base}` : base;
}
function hreflang(lang, slug) {
  const en = abs(pairPath("en", slug));
  const hi = abs(pairPath("hi", slug));
  const self = lang === "hi" ? hi : en;
  return `<link rel="canonical" href="${self}">
  <link rel="alternate" hreflang="en-IN" href="${en}">
  <link rel="alternate" hreflang="hi-IN" href="${hi}">
  <link rel="alternate" hreflang="x-default" href="${en}">`;
}

function shell(lang, slug, title, description, depth, category, mainHtml) {
  const p = assetPrefix(depth);
  const lp = lang === "hi" ? "/hi" : "";
  const enAlt = pairPath("en", slug);
  const hiAlt = pairPath("hi", slug);
  const isHi = lang === "hi";
  return `<!DOCTYPE html>
<html lang="${isHi ? "hi-IN" : "en-IN"}">
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
  <meta property="og:type" content="article">
  <meta property="og:url" content="${abs(pairPath(lang, slug))}">
  <meta property="og:image" content="${abs("/img/transserve-mark.svg")}">
  <link rel="icon" href="${p}img/Vibrant_Transserve_Gradient_Logo-removebg-preview.png" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${p}css/main.css">
  <link rel="stylesheet" href="${p}css/seo-pages.css">
  <script src="${p}js/site-config.js" defer></script>
  <script src="${p}js/seo.js" defer></script>
  <script src="${p}js/main.js" defer></script>
</head>
<body data-page-category="${category}">
  <header class="site-header">
    <div class="nav-bar">
      <a class="brand" href="${lp || "/"}" aria-label="Transserve home">
        <img src="${p}img/transserve-mark.svg" width="36" height="36" alt=""><span>Transserve</span>
      </a>
      <nav class="nav-links" aria-label="Primary">
        <a href="${lp}/restaurant-management-software/">${isHi ? "रेस्तरां" : "Restaurant"}</a>
        <a href="${lp}/hotel-management-software/">${isHi ? "होटल" : "Hotel"}</a>
        <a href="${lp}/resort-management-software/">${isHi ? "रिसॉर्ट" : "Resort"}</a>
        <a href="${lp}/pricing/">${isHi ? "मूल्य" : "Pricing"}</a>
        <a href="${lp}/blog/" class="is-active">${isHi ? "ब्लॉग" : "Blog"}</a>
      </nav>
      <div class="nav-actions">
        <span class="lang-switch">
          <a href="${enAlt}" data-lang-switch="en" class="${lang === "en" ? "is-active" : ""}">EN</a>
          <a href="${hiAlt}" data-lang-switch="hi" class="${lang === "hi" ? "is-active" : ""}">HI</a>
        </span>
        <a class="login-link" data-cfg="login">${isHi ? "लॉगिन" : "Login"}</a>
        <a class="btn btn-primary" data-cfg="register">${isHi ? "शुरू करें" : "Get Started"}</a>
      </div>
      <button class="burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mnav"><span></span><span></span><span></span></button>
    </div>
  </header>
  <div class="mobile-nav" id="mnav">
    <a href="${lp}/restaurant-management-software/">${isHi ? "रेस्तरां" : "Restaurant"}</a>
    <a href="${lp}/hotel-management-software/">${isHi ? "होटल" : "Hotel"}</a>
    <a href="${lp}/resort-management-software/">${isHi ? "रिसॉर्ट" : "Resort"}</a>
    <a href="${lp}/pricing/">${isHi ? "मूल्य" : "Pricing"}</a>
    <a href="${lp}/blog/">${isHi ? "ब्लॉग" : "Blog"}</a>
    <div class="mobile-cta">
      <a class="btn btn-secondary" data-cfg="login">${isHi ? "लॉगिन" : "Login"}</a>
      <a class="btn btn-primary" data-cfg="register">${isHi ? "शुरू करें" : "Get Started"}</a>
    </div>
  </div>
  ${mainHtml}
  <section class="cta-band"><div class="container">
    <h2>${isHi ? "Transserve आज़माएँ" : "Try Transserve"}</h2>
    <p>${isHi ? "डेमो अनुरोध करें या रजिस्टर करें।" : "Request a demo or register."}</p>
    <div class="cta-actions">
      <a class="btn btn-primary" data-cfg="demo">${isHi ? "डेमो" : "Request a Demo"}</a>
      <a class="btn btn-ghost" data-cfg="register">${isHi ? "रजिस्टर" : "Register"}</a>
      <a class="btn btn-ghost" data-cfg="whatsapp" data-requires-whatsapp hidden>WhatsApp</a>
    </div>
  </div></section>
  <footer class="site-footer"><div class="container footer-grid">
    <div><a class="brand" href="${lp || "/"}"><img src="${p}img/transserve-mark.svg" width="32" height="32" alt=""><span>Transserve</span></a>
    <p>${isHi ? "रेस्तरां और आतिथ्य प्लेटफ़ॉर्म।" : "Restaurant & hospitality platform."}</p></div>
    <div><h4>${isHi ? "उत्पाद" : "Product"}</h4>
      <a href="${lp}/restaurant-management-software/">${isHi ? "रेस्तरां" : "Restaurant"}</a>
      <a href="${lp}/hotel-management-software/">${isHi ? "होटल" : "Hotel"}</a>
      <a href="${lp}/resort-management-software/">${isHi ? "रिसॉर्ट" : "Resort"}</a></div>
    <div><h4>${isHi ? "संसाधन" : "Resources"}</h4>
      <a href="${lp}/blog/">${isHi ? "ब्लॉग" : "Blog"}</a>
      <a href="${lp}/pricing/">${isHi ? "मूल्य" : "Pricing"}</a>
      <a href="${lp}/demo/">${isHi ? "डेमो" : "Demo"}</a></div>
    <div><h4>${isHi ? "कंपनी" : "Company"}</h4><ul id="flinks"></ul></div>
  </div>
  <div class="container footer-bottom"><p>© <span id="yr"></span> Transserve.</p></div>
  </footer>
</body></html>`;
}

const articles = [
  {
    slug: "blog/restaurant-pos-software-guide-india",
    tag: "Restaurant",
    cta: "/restaurant-pos-software/",
    en: {
      title: "Restaurant POS Software: Complete Guide for Indian Restaurants | Transserve",
      description:
        "A practical guide to restaurant POS software in India—billing, order tracking, payments, tables and what to compare before you buy.",
      h1: "Restaurant POS Software: Complete Guide for Indian Restaurants",
      intent: "Informational / commercial investigation",
      body: `<p>Indian restaurants usually evaluate POS software for faster billing, clearer order status, and fewer mistakes between the counter, kitchen and floor. This guide explains what matters in daily service—and how Transserve approaches the same problems—without inventing ratings or competitor scores.</p>
      <h2>What restaurant POS software should cover</h2>
      <ul>
        <li>Quick bill generation for dine-in and takeaway</li>
        <li>Live order status from new to preparing to ready</li>
        <li>Table context so the floor knows what is occupied</li>
        <li>Offers or discounts at billing time</li>
        <li>Payment recording against each bill</li>
        <li>Optional waiter/captain mobile workflow</li>
      </ul>
      <h2>Order-to-payment flow that teams understand</h2>
      <p>A clear flow reduces shouting across the floor: order placed → preparation tracked → staff serves → bill created → payment recorded. In Transserve, opening a UPI link is not treated as verified payment; the team records payment in the system.</p>
      <h2>Kitchen prep (often called KOT)</h2>
      <p>Many Indian restaurants describe kitchen tickets as KOT. What you need operationally is reliable preparation status—not a buzzword. Track orders as they move through cooking so captains and counters stay aligned.</p>
      <h2>What to compare before you buy</h2>
      <ul>
        <li>Does billing support your dine-in and takeaway mix?</li>
        <li>Can staff see live order states?</li>
        <li>Is there a mobile workflow for floor staff?</li>
        <li>Are prices and plans shown clearly at checkout (not hidden marketing numbers)?</li>
        <li>Does the vendor avoid claiming unavailable modules (for Transserve: Channel Manager is Coming Soon)?</li>
      </ul>
      <h2>Next step</h2>
      <p>Read the product page for <a href="/restaurant-pos-software/">Restaurant POS Software</a>, or <a href="/demo/">request a demo</a>.</p>`,
    },
    hi: {
      title: "रेस्तरां POS सॉफ्टवेयर गाइड भारत | Transserve",
      description: "भारत में रेस्तरां POS—बिलिंग, ऑर्डर ट्रैकिंग, भुगतान, टेबल और खरीद से पहले तुलना के बिंदु।",
      h1: "रेस्तरां POS सॉफ्टवेयर: भारतीय रेस्तरां के लिए गाइड",
      body: `<p>भारतीय रेस्तरां POS चुनते समय तेज़ बिलिंग, साफ़ ऑर्डर स्थिति और काउंटर-किचन-फ्लोर समन्वय देखते हैं। यह गाइड रोज़मर्रा की ज़रूरतें समझाती है।</p>
      <h2>POS में क्या होना चाहिए</h2>
      <ul>
        <li>डाइन-इन/टेकअवे बिलिंग</li>
        <li>लाइव ऑर्डर स्थिति</li>
        <li>टेबल संदर्भ</li>
        <li>बिलिंग पर ऑफ़र</li>
        <li>भुगतान रिकॉर्डिंग</li>
        <li>कैप्टन/वेटर मोबाइल वर्कफ़्लो</li>
      </ul>
      <h2>ऑर्डर से भुगतान</h2>
      <p>नया ऑर्डर → तैयारी → सर्विस → बिल → भुगतान दर्ज। UPI लिंक खोलना सत्यापित भुगतान नहीं है।</p>
      <h2>अगला कदम</h2>
      <p><a href="/hi/restaurant-pos-software/">रेस्तरां POS</a> पेज देखें या <a href="/hi/demo/">डेमो अनुरोध</a> करें।</p>`,
    },
  },
  {
    slug: "blog/restaurant-billing-software-features",
    tag: "Restaurant",
    cta: "/restaurant-pos-software/",
    en: {
      title: "Restaurant Billing Software: Features to Compare | Transserve",
      description: "Features to compare in restaurant billing software—bill speed, offers, payments, order linkage and floor coordination.",
      h1: "Restaurant Billing Software: Features to Compare",
      body: `<p>Billing software is only useful if it matches how your counter actually works during rush hours. Compare features that affect speed and accuracy—not vanity metrics.</p>
      <h2>Feature checklist</h2>
      <ul>
        <li>Bill creation speed for dine-in and takeaway</li>
        <li>Ability to apply offers/discounts at billing</li>
        <li>Payment recording per bill</li>
        <li>Link to live orders and table status</li>
        <li>Sales overview for owners</li>
        <li>Mobile captain support for floor service</li>
      </ul>
      <h2>Transserve angle</h2>
      <p>Transserve billing sits inside the wider restaurant workspace: orders, tables, menus and Captain app. See <a href="/restaurant-pos-software/">POS &amp; billing</a>.</p>`,
    },
    hi: {
      title: "रेस्तरां बिलिंग सॉफ्टवेयर: तुलना के लिए फीचर्स | Transserve",
      description: "रेस्तरां बिलिंग में तुलना करें—गति, ऑफ़र, भुगतान, ऑर्डर लिंक और फ्लोर समन्वय।",
      h1: "रेस्तरां बिलिंग सॉफ्टवेयर: फीचर्स की तुलना",
      body: `<p>बिलिंग तभी उपयोगी है जब व्यस्त समय में काउंटर की वास्तविक गति से मेल खाए।</p>
      <h2>चेकलिस्ट</h2>
      <ul><li>डाइन-इन/टेकअवे बिल</li><li>ऑफ़र/छूट</li><li>भुगतान रिकॉर्ड</li><li>ऑर्डर व टेबल लिंक</li><li>सेल्स अवलोकन</li><li>कैप्टन ऐप</li></ul>
      <p><a href="/hi/restaurant-pos-software/">POS और बिलिंग</a> देखें।</p>`,
    },
  },
  {
    slug: "blog/manage-restaurant-orders-and-kot",
    tag: "Restaurant",
    cta: "/restaurant-management-software/",
    en: {
      title: "How to Manage Restaurant Orders and KOT | Transserve",
      description: "How Indian restaurants manage orders and kitchen preparation (KOT-style)—status tracking, floor handoff and billing.",
      h1: "How to Manage Restaurant Orders and KOT",
      body: `<p>“KOT” is the everyday word many Indian kitchens use for preparation tickets. Operationally, you need every order to move through clear states without getting lost.</p>
      <h2>A simple operating model</h2>
      <ol class="flow" style="margin-top:16px;list-style:decimal;padding-left:20px;display:block;">
        <li style="margin:8px 0;">Capture the order (table or takeaway)</li>
        <li style="margin:8px 0;">Track preparation status</li>
        <li style="margin:8px 0;">Hand off to Captain / service staff</li>
        <li style="margin:8px 0;">Generate the bill</li>
        <li style="margin:8px 0;">Record payment</li>
      </ol>
      <p>Transserve surfaces live orders with statuses such as new, preparing and ready so the team can coordinate. Explore <a href="/restaurant-management-software/">restaurant management software</a>.</p>`,
    },
    hi: {
      title: "रेस्तरां ऑर्डर और KOT कैसे मैनेज करें | Transserve",
      description: "ऑर्डर और किचन तैयारी (KOT-शैली) मैनेज करने का व्यावहारिक तरीका।",
      h1: "रेस्तरां ऑर्डर और KOT कैसे मैनेज करें",
      body: `<p>भारतीय किचन में KOT आम शब्द है। जरूरत है साफ़ स्टेटस ट्रैकिंग की।</p>
      <ul><li>ऑर्डर कैप्चर</li><li>तैयारी स्थिति</li><li>कैप्टन हैंडऑफ़</li><li>बिल</li><li>भुगतान रिकॉर्ड</li></ul>
      <p><a href="/hi/restaurant-management-software/">रेस्तरां मैनेजमेंट</a> देखें।</p>`,
    },
  },
  {
    slug: "blog/qr-menu-ordering-benefits-restaurants",
    tag: "Restaurant",
    cta: "/hotel-management-software/",
    en: {
      title: "QR Menu Ordering: Benefits for Restaurants & Hotels | Transserve",
      description: "Benefits of QR ordering for hospitality—focusing on verified Transserve room QR guest ordering and careful restaurant claims.",
      h1: "QR Menu Ordering: Benefits for Hospitality Teams",
      body: `<p>QR ordering can reduce waiter load and help guests order from a room or seat. On Transserve, <strong>room QR ordering</strong> is part of hotel/room capabilities (plan-dependent). This article does not invent a separate restaurant QR-menu module beyond what the product site documents.</p>
      <h2>Where QR helps</h2>
      <ul>
        <li>Guests order from the room without calling the desk for every item</li>
        <li>Orders land in the same operational workspace as other F&amp;B flow when dining is enabled</li>
        <li>Less verbal miscommunication for routine requests</li>
      </ul>
      <h2>What to verify with any vendor</h2>
      <ul>
        <li>Is QR tied to room/table identity correctly?</li>
        <li>Do orders appear in live order management?</li>
        <li>Which plans include the feature?</li>
      </ul>
      <p>Learn more on <a href="/hotel-management-software/">Hotel Management Software</a> and <a href="/room-management-software/">Room Management</a>.</p>`,
    },
    hi: {
      title: "QR मेनू ऑर्डरिंग: लाभ | Transserve",
      description: "हॉस्पिटैलिटी में QR ऑर्डरिंग—Transserve रूम QR पर केंद्रित, बिना काल्पनिक दावों के।",
      h1: "QR मेनू ऑर्डरिंग: आतिथ्य टीमों के लिए लाभ",
      body: `<p>Transserve पर <strong>रूम QR ऑर्डरिंग</strong> होटल/रूम क्षमताओं का हिस्सा है (प्लान पर निर्भर)।</p>
      <ul><li>कमरे से ऑर्डर</li><li>लाइव ऑर्डर वर्कस्पेस</li><li>प्लान एंटाइटेलमेंट जाँचें</li></ul>
      <p><a href="/hi/hotel-management-software/">होटल सॉफ्टवेयर</a> पढ़ें।</p>`,
    },
  },
  {
    slug: "blog/hotel-management-software-guide",
    tag: "Hotel",
    cta: "/hotel-management-software/",
    en: {
      title: "Hotel Management Software: Complete Guide | Transserve",
      description: "Complete guide to hotel management software—rooms, bookings, guests, folio billing and room QR—without fake reviews.",
      h1: "Hotel Management Software: Complete Guide",
      body: `<p>Hotel software should reduce front-desk friction: rooms, bookings, guests and billing in one place. Transserve’s hotel tier covers these workflows based on plan entitlements.</p>
      <h2>Core modules to understand</h2>
      <ul>
        <li>Room management</li>
        <li>Bookings and check-in</li>
        <li>Guest profiles</li>
        <li>Room billing / folio</li>
        <li>Room QR ordering</li>
      </ul>
      <h2>Channel Manager reality check</h2>
      <p>Many hotels ask about OTAs. Transserve marks Channel Manager as Coming Soon—do not buy expecting it today.</p>
      <p>Continue on the <a href="/hotel-management-software/">hotel product page</a>.</p>`,
    },
    hi: {
      title: "होटल मैनेजमेंट सॉफ्टवेयर गाइड | Transserve",
      description: "रूम, बुकिंग, गेस्ट, folio और रूम QR—बिना नकली रिव्यू के गाइड।",
      h1: "होटल मैनेजमेंट सॉफ्टवेयर: पूरी गाइड",
      body: `<p>होटल सॉफ्टवेयर फ्रंट-डेस्क का काम सरल करे। Transserve होटल टियर प्लान के अनुसार इन वर्कफ़्लो को कवर करता है।</p>
      <ul><li>रूम</li><li>बुकिंग/चेक-इन</li><li>गेस्ट</li><li>folio बिलिंग</li><li>रूम QR</li></ul>
      <p>Channel Manager Coming Soon है। <a href="/hi/hotel-management-software/">होटल पेज</a> देखें।</p>`,
    },
  },
  {
    slug: "blog/manage-hotel-room-bookings",
    tag: "Hotel",
    cta: "/room-management-software/",
    en: {
      title: "How to Manage Hotel Room Bookings | Transserve",
      description: "Practical approach to hotel room bookings and check-in flow using modern room management software.",
      h1: "How to Manage Hotel Room Bookings",
      body: `<p>Booking management fails when room status and guest details live in different notebooks. Keep inventory, booking state and check-in in one workspace.</p>
      <h2>Operating tips</h2>
      <ul>
        <li>Update room status as soon as check-in/out happens</li>
        <li>Capture guest details during registration</li>
        <li>Connect stay charges to room billing / folio</li>
      </ul>
      <p>See <a href="/room-management-software/">Room Management Software</a>.</p>`,
    },
    hi: {
      title: "होटल रूम बुकिंग कैसे मैनेज करें | Transserve",
      description: "रूम बुकिंग और चेक-इन का व्यावहारिक तरीका।",
      h1: "होटल रूम बुकिंग कैसे मैनेज करें",
      body: `<p>बुकिंग तब बिगड़ती है जब रूम स्थिति और गेस्ट डिटेल अलग जगह हों।</p>
      <ul><li>चेक-इन/आउट पर स्टेटस अपडेट</li><li>रजिस्ट्रेशन पर गेस्ट विवरण</li><li>folio से चार्ज जोड़ें</li></ul>
      <p><a href="/hi/room-management-software/">रूम मैनेजमेंट</a> देखें।</p>`,
    },
  },
  {
    slug: "blog/hotel-guest-management-and-billing",
    tag: "Hotel",
    cta: "/hotel-management-software/",
    en: {
      title: "Hotel Guest Management and Billing | Transserve",
      description: "Guest profiles and room billing/folio—how hotels keep stay charges organised.",
      h1: "Hotel Guest Management and Billing",
      body: `<p>Guest management is more than a name list. You need profiles tied to stays and a clear path to room billing / folio charges.</p>
      <h2>What good guest ops look like</h2>
      <ul>
        <li>Searchable guest profiles</li>
        <li>Stay context linked to the room</li>
        <li>Transparent folio-style billing</li>
      </ul>
      <p>Explore <a href="/hotel-management-software/">Hotel Management Software</a>.</p>`,
    },
    hi: {
      title: "होटल गेस्ट मैनेजमेंट और बिलिंग | Transserve",
      description: "गेस्ट प्रोफ़ाइल और रूम बिलिंग/folio कैसे व्यवस्थित रखें।",
      h1: "होटल गेस्ट मैनेजमेंट और बिलिंग",
      body: `<p>गेस्ट प्रोफ़ाइल स्टे और रूम बिलिंग से जुड़ी होनी चाहिए।</p>
      <ul><li>प्रोफ़ाइल</li><li>रूम संदर्भ</li><li>folio बिलिंग</li></ul>
      <p><a href="/hi/hotel-management-software/">होटल सॉफ्टवेयर</a> देखें।</p>`,
    },
  },
  {
    slug: "blog/hotel-room-management-software-features",
    tag: "Hotel",
    cta: "/room-management-software/",
    en: {
      title: "Hotel Room Management Software: Features to Compare | Transserve",
      description: "Compare hotel room management features—inventory, status, bookings, QR ordering and folio billing.",
      h1: "Hotel Room Management Software: Features to Compare",
      body: `<p>Use this checklist when comparing room tools for Indian hotels.</p>
      <ul>
        <li>Room inventory and status</li>
        <li>Booking + check-in workflow</li>
        <li>Guest registration</li>
        <li>Room billing / folio</li>
        <li>Room QR guest ordering</li>
        <li>Honest roadmap notes (e.g. Channel Manager Coming Soon)</li>
      </ul>
      <p><a href="/room-management-software/">Room management product page</a>.</p>`,
    },
    hi: {
      title: "होटल रूम मैनेजमेंट सॉफ्टवेयर: फीचर्स | Transserve",
      description: "रूम इन्वेंटरी, स्टेटस, बुकिंग, QR और folio—तुलना सूची।",
      h1: "होटल रूम मैनेजमेंट: तुलना के फीचर्स",
      body: `<ul><li>इन्वेंटरी/स्टेटस</li><li>बुकिंग/चेक-इन</li><li>गेस्ट रजिस्ट्रेशन</li><li>folio</li><li>रूम QR</li><li>Coming Soon का ईमानदार उल्लेख</li></ul>
      <p><a href="/hi/room-management-software/">रूम मैनेजमेंट</a>।</p>`,
    },
  },
  {
    slug: "blog/resort-management-software-guide",
    tag: "Resort",
    cta: "/resort-management-software/",
    en: {
      title: "Resort Management Software: Complete Guide | Transserve",
      description: "Guide to resort management software that combines restaurant and hotel operations under one tenant.",
      h1: "Resort Management Software: Complete Guide",
      body: `<p>Resorts need both stay and dining operations. Transserve’s resort positioning combines restaurant-tier and hotel-tier features under one tenant with plan-based entitlements.</p>
      <h2>Evaluate both sides</h2>
      <ul>
        <li>F&amp;B: orders, POS, tables, Captain</li>
        <li>Stay: rooms, bookings, guests, room QR, folio</li>
      </ul>
      <p>Read <a href="/resort-management-software/">Resort Management Software</a>.</p>`,
    },
    hi: {
      title: "रिसॉर्ट मैनेजमेंट सॉफ्टवेयर गाइड | Transserve",
      description: "रेस्तरां + होटल संचालन एक टैनेंट में—रिसॉर्ट गाइड।",
      h1: "रिसॉर्ट मैनेजमेंट सॉफ्टवेयर: गाइड",
      body: `<p>रिसॉर्ट में स्टे और डाइनिंग दोनों चाहिए। Transserve दोनों टियर एक टैनेंट में लाता है।</p>
      <p><a href="/hi/resort-management-software/">रिसॉर्ट सॉफ्टवेयर</a> पढ़ें।</p>`,
    },
  },
  {
    slug: "blog/restaurant-hotel-operations-one-platform",
    tag: "Resort",
    cta: "/resort-management-software/",
    en: {
      title: "Restaurant and Hotel Operations in One Platform | Transserve",
      description: "Why hospitality teams consolidate restaurant and hotel operations on one platform—and how Transserve approaches it.",
      h1: "Restaurant and Hotel Operations in One Platform",
      body: `<p>Separate tools for dining and rooms create duplicate staff logins and broken reporting. A shared tenant with clear entitlements keeps teams aligned.</p>
      <p>Transserve resort plans are designed for this combination. Details on the <a href="/resort-management-software/">resort page</a>.</p>`,
    },
    hi: {
      title: "एक प्लेटफ़ॉर्म में रेस्तरां और होटल संचालन | Transserve",
      description: "डाइनिंग और रूम एक प्लेटफ़ॉर्म पर क्यों लाएँ।",
      h1: "एक प्लेटफ़ॉर्म में रेस्तरां और होटल संचालन",
      body: `<p>अलग-अलग टूल से लॉगिन और रिपोर्टिंग टूटती है। साझा टैनेंट बेहतर है।</p>
      <p><a href="/hi/resort-management-software/">रिसॉर्ट पेज</a>।</p>`,
    },
  },
  {
    slug: "blog/hotel-restaurant-billing-together",
    tag: "Resort",
    cta: "/resort-management-software/",
    en: {
      title: "How to Manage Hotel and Restaurant Billing Together | Transserve",
      description: "Managing stay folio charges and restaurant POS billing in one hospitality platform.",
      h1: "How to Manage Hotel and Restaurant Billing Together",
      body: `<p>Properties that run both rooms and F&amp;B need two billing contexts: room folio-style charges and restaurant POS bills. Keep them in one platform so owners are not reconciling spreadsheets overnight.</p>
      <ul>
        <li>Restaurant: dine-in/takeaway bills, offers, payment recording</li>
        <li>Hotel: room billing / folio for stay charges</li>
      </ul>
      <p><a href="/resort-management-software/">Resort software</a> · <a href="/restaurant-pos-software/">Restaurant POS</a></p>`,
    },
    hi: {
      title: "होटल और रेस्तरां बिलिंग एक साथ | Transserve",
      description: "folio और रेस्तरां POS बिलिंग एक प्लेटफ़ॉर्म में।",
      h1: "होटल और रेस्तरां बिलिंग एक साथ कैसे मैनेज करें",
      body: `<p>रूम folio और रेस्तरां POS—दोनों संदर्भ एक प्लेटफ़ॉर्म में रखें।</p>
      <p><a href="/hi/resort-management-software/">रिसॉर्ट</a> · <a href="/hi/restaurant-pos-software/">POS</a></p>`,
    },
  },
  {
    slug: "blog/hospitality-management-software-growing-businesses",
    tag: "Hospitality",
    cta: "/resort-management-software/",
    en: {
      title: "Hospitality Management Software for Growing Businesses | Transserve",
      description: "How growing restaurants, hotels and resorts should evaluate hospitality management software in India.",
      h1: "Hospitality Management Software for Growing Businesses",
      body: `<p>Growing hospitality businesses outgrow notebooks and chat-based order taking. Choose software that matches your operating model: restaurant-only, hotel-only, or combined resort.</p>
      <h2>Decision path</h2>
      <ul>
        <li>Mostly F&amp;B → <a href="/restaurant-management-software/">Restaurant</a></li>
        <li>Mostly rooms → <a href="/hotel-management-software/">Hotel</a></li>
        <li>Both → <a href="/resort-management-software/">Resort</a></li>
      </ul>
      <p>Then <a href="/demo/">request a demo</a> or register to see live plan options.</p>`,
    },
    hi: {
      title: "बढ़ते व्यवसायों के लिए हॉस्पिटैलिटी सॉफ्टवेयर | Transserve",
      description: "रेस्तरां, होटल, रिसॉर्ट के लिए सॉफ्टवेयर कैसे चुनें।",
      h1: "बढ़ते व्यवसायों के लिए हॉस्पिटैलिटी मैनेजमेंट सॉफ्टवेयर",
      body: `<ul>
        <li>मुख्यतः F&amp;B → <a href="/hi/restaurant-management-software/">रेस्तरां</a></li>
        <li>मुख्यतः रूम → <a href="/hi/hotel-management-software/">होटल</a></li>
        <li>दोनों → <a href="/hi/resort-management-software/">रिसॉर्ट</a></li>
      </ul>
      <p><a href="/hi/demo/">डेमो अनुरोध</a> करें।</p>`,
    },
  },
];

// Blog hubs
for (const lang of ["en", "hi"]) {
  const isHi = lang === "hi";
  const cards = articles
    .map((a) => {
      const t = a[lang];
      const href = pairPath(lang, a.slug);
      return `<a class="blog-card" href="${href}">
        <div><span class="tag">${a.tag}</span></div>
        <div>
          <h2>${t.h1}</h2>
          <p>${t.description}</p>
          <p class="blog-meta">${isHi ? "गाइड" : "Guide"} · Transserve</p>
        </div>
      </a>`;
    })
    .join("\n");
  const main = `<main>
    <section class="page-hero"><div class="container">
      <p class="eyebrow">${isHi ? "ब्लॉग" : "Blog"}</p>
      <h1>${isHi ? "रेस्तरां, होटल और रिसॉर्ट गाइड" : "Guides for restaurants, hotels and resorts"}</h1>
      <p class="lead">${isHi ? "मूल खोज इरादे पर आधारित उपयोगी लेख—बिना नकली आँकड़ों के।" : "Practical articles mapped to real search intent—no fabricated statistics."}</p>
    </div></section>
    <section class="section"><div class="container blog-list">${cards}</div></section>
  </main>`;
  const html = shell(
    lang,
    "blog",
    isHi ? "Transserve ब्लॉग | रेस्तरां और होटल गाइड" : "Transserve Blog | Restaurant & Hotel Guides",
    isHi
      ? "भारतीय रेस्तरां, होटल और रिसॉर्ट के लिए Transserve गाइड और लेख।"
      : "Guides and articles for Indian restaurants, hotels and resorts from Transserve.",
    lang === "hi" ? 2 : 1,
    "blog",
    main,
  );
  write(lang === "hi" ? "hi/blog/index.html" : "blog/index.html", html);
}

// Articles
for (const a of articles) {
  for (const lang of ["en", "hi"]) {
    const t = a[lang];
    const isHi = lang === "hi";
    const depth = a.slug.split("/").length + (lang === "hi" ? 1 : 0);
    // slug blog/foo → depth 2 for en (blog/foo/index), hi → hi/blog/foo = depth 3
    const d = lang === "hi" ? 3 : 2;
    const cta = isHi ? `/hi${a.cta}` : a.cta;
    const main = `<main class="article-body">
      <section class="page-hero"><div class="container">
        <nav class="breadcrumb"><a href="${isHi ? "/hi/" : "/"}">${isHi ? "होम" : "Home"}</a><span aria-hidden="true">/</span><a href="${isHi ? "/hi/blog/" : "/blog/"}">${isHi ? "ब्लॉग" : "Blog"}</a><span aria-hidden="true">/</span><span aria-current="page">${a.tag}</span></nav>
        <p class="eyebrow">${a.tag}</p>
        <h1>${t.h1}</h1>
        <p class="lead">${t.description}</p>
      </div></section>
      <section class="section"><div class="container prose">
        ${t.body}
        <div class="cta-strip">
          <h2>${isHi ? "उत्पाद देखें" : "See the product"}</h2>
          <p><a class="btn btn-primary" href="${cta}">${isHi ? "उत्पाद पेज" : "Open product page"}</a>
          <a class="btn btn-secondary" data-cfg="demo" style="margin-left:8px;">${isHi ? "डेमो" : "Request a Demo"}</a></p>
        </div>
      </div></section>
    </main>`;
    const html = shell(lang, a.slug, t.title, t.description, d, "blog", main);
    write(
      lang === "hi" ? path.join("hi", a.slug, "index.html") : path.join(a.slug, "index.html"),
      html,
    );
  }
}

// Editorial calendar doc
write(
  "TRANSERVE_BLOG_EDITORIAL_CALENDAR.md",
  `# Transserve Blog — Editorial Calendar & Outlines

All 12 articles below are **published** as complete pages under \`/blog/\` and \`/hi/blog/\` (localized, not machine-only stubs).

| # | EN slug | Primary CTA | Status |
|---|---------|-------------|--------|
| 1 | restaurant-pos-software-guide-india | /restaurant-pos-software/ | Published |
| 2 | restaurant-billing-software-features | /restaurant-pos-software/ | Published |
| 3 | manage-restaurant-orders-and-kot | /restaurant-management-software/ | Published |
| 4 | qr-menu-ordering-benefits-restaurants | /hotel-management-software/ | Published |
| 5 | hotel-management-software-guide | /hotel-management-software/ | Published |
| 6 | manage-hotel-room-bookings | /room-management-software/ | Published |
| 7 | hotel-guest-management-and-billing | /hotel-management-software/ | Published |
| 8 | hotel-room-management-software-features | /room-management-software/ | Published |
| 9 | resort-management-software-guide | /resort-management-software/ | Published |
| 10 | restaurant-hotel-operations-one-platform | /resort-management-software/ | Published |
| 11 | hotel-restaurant-billing-together | /resort-management-software/ | Published |
| 12 | hospitality-management-software-growing-businesses | /resort-management-software/ | Published |

Refresh cadence suggestion (owner): update quarterly with Search Console query insights—**no fabricated volumes**.
`,
);

console.log("Blog generation complete");
