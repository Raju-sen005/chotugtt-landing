# Transserve — GA4 & Google Search Console Setup

## GA4

1. Create a GA4 property for `transserve.in`.
2. Copy the Measurement ID (`G-XXXXXXXXXX`).
3. Paste it into `js/site-config.js` → `ga4MeasurementId`.
4. Leave empty until ready — the site will **not** load gtag without a real ID.

### Events implemented (no PII)

| Event | When |
|-------|------|
| `page_context` | On load (category + language) |
| `restaurant_page_view` | Restaurant commercial pages |
| `hotel_page_view` | Hotel / room pages |
| `resort_page_view` | Resort pages |
| `pricing_view` | Pricing pages |
| `demo_request_click` | Demo CTA click |
| `demo_form_submit` | Demo form submit (business_type only) |
| `whatsapp_click` | WhatsApp CTA (when number configured) |
| `signup_click` | Register CTA click |
| `language_switch` | EN/HI switch |

**Not implemented on click:** `registration_complete` — must fire only after confirmed registration success inside the product app (out of scope for this static site).

---

## Google Search Console

**Do not claim verification until the owner completes it.**

1. Add property: Domain `transserve.in` (DNS TXT) or URL prefix `https://transserve.in/`.
2. Verify ownership with DNS / HTML file / meta tag as Google instructs.
3. Submit sitemap: `https://transserve.in/sitemap.xml`
4. Use URL Inspection on `/`, `/hi/`, and each commercial URL.
5. Monitor Index coverage, hreflang in International Targeting (if shown), and Enhancements.
6. After traffic arrives, map Search Console queries back to `TRANSERVE_KEYWORD_RESEARCH_AND_MAPPING.md`.

### Indexability checklist

- [ ] HTTPS live on `transserve.in`
- [ ] `robots.txt` reachable
- [ ] Sitemap returns 200 and lists only canonical URLs
- [ ] No `noindex` on commercial pages
- [ ] EN/HI hreflang pairs reciprocal
- [ ] Soft 404s absent for `/path/` folders with `index.html`
