# Transserve SEO — Initial Audit

**Date:** 2026-11-20  
**Project:** `C:\Users\pc\Desktop\landing`  
**Backup before SEO work:** `backup-pre-seo/`

---

## 1. Project structure (current)

```
landing/
├── index.html              # Single-page marketing site
├── CNAME                   # Contains: transserve.in
├── css/main.css            # Design system (no Tailwind)
├── css/transserve.css      # Legacy (not linked)
├── js/main.js              # Nav, FAQ, CFG CTAs, reveals
├── js/transserve-ui.js     # Legacy (not linked)
├── img/                    # Logo, mark, favicon, legacy assets
├── screenshots/            # UX validation captures
├── backup-pre-full-ux/     # Pre-redesign backup
└── *.md                    # Prior UX reports
```

**Pages today:** 1 (`index.html` only)  
**Languages today:** English only  
**Frameworks:** HTML / CSS / vanilla JS (preserve)

---

## 2. Verified configuration

| Item | Value | Confidence |
|------|-------|------------|
| Production hostname | `transserve.in` (from `CNAME`) | Verified in repo |
| Canonical origin (assumed) | `https://transserve.in` | Hostname verified; HTTPS scheme assumed for public site |
| Owner login / register | `https://portal.transserve.in/` (+ `/subscription-checkout`) | Present in `js/main.js` CFG |
| Contact email | `support@transserve.in` | Present in CFG |
| Captain APK | Expo build URL in CFG | Present |
| WhatsApp business number | **Not found** | **OWNER INPUT REQUIRED** |
| GA4 Measurement ID | **Not found** | **OWNER INPUT REQUIRED** |
| Demo form backend | **Not found** | Report — no working demo API |
| Privacy / Terms URLs | Empty in CFG | Optional later |
| Hosting type | Static site + CNAME (typical GitHub Pages / similar) | Inferred from CNAME; not otherwise confirmed |

---

## 3. Current SEO status

| Area | Status |
|------|--------|
| Unique title | Partial (homepage only) |
| Meta description | Present on homepage |
| Canonical | Missing |
| robots.txt | Missing |
| XML sitemap | Missing |
| hreflang | Missing |
| Open Graph | Partial (relative `og:image`) |
| Structured data | Missing |
| Multi-page commercial SEO | Missing |
| Hindi site | Missing |
| Blog | Missing |
| Analytics | Missing |
| Search Console prep | Missing |

**Keyword targeting today:** Broad hospitality copy on homepage only — no dedicated pages for POS, hotel HMS, room management, resort, or pricing.

---

## 4. Technical SEO problems

1. Single URL cannot rank for many commercial intents without thin stuffing.
2. No `robots.txt` / sitemap for crawl discovery.
3. No canonical / hreflang.
4. Relative `og:image` weak for social crawlers.
5. No FAQ/Organization/SoftwareApplication schema.
6. No language alternate for Hindi searchers.
7. Internal linking limited to same-page anchors.
8. Register URL still on Render subdomain (functional but not brand domain).
9. Illustrative dashboard mock labeled sample — do not present as live screenshot proof in SEO claims beyond “illustrative preview”.

---

## 5. Missing SEO / acquisition assets

- Commercial landing pages (restaurant / POS / hotel / room / resort)
- Pricing page (plan education without inventing prices if unknown)
- Demo enquiry page/flow
- WhatsApp CTA (blocked until number verified)
- Blog hub + articles
- Hindi equivalents
- GA4 + conversion events
- Local city pages (defer — no verified local coverage content)

---

## 6. Conversion paths (current)

| Path | Status |
|------|--------|
| Direct registration | Wired via `data-cfg="register"` |
| Owner login | Wired via `data-cfg="login"` |
| Email contact | Footer mailto from CFG |
| Demo request form | **Absent / no backend** |
| WhatsApp | **Absent — no verified number** |

---

## 7. Performance notes (pre-change)

- Google Fonts (Sora + Manrope) via CDN — watch LCP
- QRCode.js from cdnjs on homepage
- CSS animations / IntersectionObserver — keep; respect `prefers-reduced-motion`
- No image CDN / responsive `srcset` yet
- Lab CWV scores to be measured after implementation (not fabricated)

---

## 8. Product claims allowed (from live site copy)

**Restaurant:** live orders, billing/POS, tables, menu, Captain app, payments, offers/discounts, sales overview  
**Hotel:** rooms, bookings/check-in, guest profiles, room QR, room billing/folio  
**Resort:** restaurant + hotel under one tenant; plan-based entitlements  
**Do not claim:** Channel Manager as available (Coming Soon / planned only)  
**Do not invent:** ratings, customer counts, testimonials, integrations, certifications, prices

---

## 9. Recommended implementation sequence

1. Site config (`SITE_ORIGIN`, placeholders for GA4 / WhatsApp)
2. Shared SEO chrome (nav, footer, language switcher, CTAs)
3. Homepage metadata + internal links to new hubs
4. Five EN commercial pages + pricing + demo page
5. Hindi homepage + matching commercial pages
6. Blog hub + 12 complete EN articles + HI localized versions
7. robots.txt + sitemap.xml + JSON-LD
8. GA4 loader (inactive until ID set) + event helpers
9. Browser validation + owner-actions checklist
10. **Do not deploy** without explicit approval

---

## 10. Owner actions required (cannot invent)

1. Confirm production URL scheme and final brand login domains.
2. Provide verified WhatsApp Business number for India.
3. Provide GA4 Measurement ID.
4. Confirm demo intake method (email-only vs form backend).
5. Confirm Search Console property ownership for verification.
6. Confirm any public phone / address before Local SEO / GBP.
