/**
 * Transserve site configuration — single source for marketing site CTAs & SEO.
 * OWNER: replace placeholders before launch. Empty WhatsApp / GA4 stay inactive.
 */
window.TRANSERVE_CONFIG = {
  siteOrigin: "https://transserve.in",
  defaultLang: "en",
  contactEmail: "support@transserve.in",
  loginUrl: "https://portal.transserve.in/",
  registerUrl: "https://portal.transserve.in/subscription-checkout",
  captainLoginUrl: "",
  apkUrl:
    "https://expo.dev/accounts/raju005/projects/captain-app/builds/25829aac-479a-465b-8443-23094ae79b02",
  privacyUrl: "",
  termsUrl: "",
  /* OWNER INPUT REQUIRED — leave empty to hide WhatsApp CTAs */
  whatsappNumber: "9636015439",
  /* OWNER INPUT REQUIRED — leave empty to skip GA4 load (e.g. G-XXXXXXXXXX) */
  ga4MeasurementId: "",
  /* Demo intake: mailto until a form backend exists */
  demoMailto: "support@transserve.in",
};