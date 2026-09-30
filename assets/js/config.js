/* =====================================================================
   StudyWork — site configuration (edit this file only; no build needed)
   ===================================================================== */
window.SW_CONFIG = {
  siteName: "StudyWork",
  siteUrl: "https://studywork.com",
  interestUrl: "https://web.works/contact",

  /* Google AdSense — paste your publisher ID (e.g. "ca-pub-1234567890123456").
     Leave empty and the site shows neutral placeholders instead of ads.
     Also update /ads.txt with the same ID.                                   */
  adsenseClient: "",
  adSlots: { header: "", inContent: "", sidebar: "", footer: "" },

  /* Google Analytics 4 measurement ID (optional), e.g. "G-XXXXXXX" */
  ga4: "",

  /* Form delivery. Forms post via FormSubmit (free, works on GitHub Pages).
     After the FIRST submission FormSubmit sends one activation email; click it.
     It then gives you a random alias string — paste it here to stop using the
     encoded address entirely.                                                */
  formAlias: "",

  /* Donation links — paste any you create. Empty links are hidden and
     donors are routed to the pledge form instead.                           */
  donate: {
    paypal: "",        // e.g. https://www.paypal.com/donate/?hosted_button_id=XXXX
    stripe: "",        // Stripe Payment Link
    buyMeACoffee: "",  // https://buymeacoffee.com/yourname
    githubSponsors: "",// https://github.com/sponsors/yourname
    upi: ""            // e.g. upi://pay?pa=name@bank&pn=StudyWork
  },

  /* YouTube — channel link + videos shown in the Video Hub and homepage */
  youtubeChannel: "",  // e.g. https://www.youtube.com/@studywork
  videos: [
    { id: "0Az6AK6-e8k", title: "IRCC Explains: Working and studying in Canada", source: "Immigration, Refugees and Citizenship Canada", cat: "Canada" }
  ],

  social: { x: "", instagram: "", linkedin: "", facebook: "", tiktok: "" }
};

/* encoded contact route (not human-readable by design) */
window.SW_R = [122,55,106,169,93,141,76,127,257,152,68,91,152,268,121,165,92,152,289,131];
