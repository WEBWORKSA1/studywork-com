# StudyWork.com

A static website for international students who want to study abroad and work while they study. It covers scholarships, student jobs, post-study work visas and free calculators, and it includes lead-generation, donation, contest, hiring and advertising funnels.

The site is plain HTML, CSS and JS with no build step needed to host it. It runs on the **GitHub Pages free plan**.

The strategy, revenue model and phase-wise build prompt are in [`PROMPT.md`](PROMPT.md).

## Structure
```
/                     generated HTML pages (served by GitHub Pages)
/guides/              long-form SEO guides
/assets/css/style.css design system (light + dark)
/assets/js/config.js  ← the ONLY file you normally edit (AdSense, donations, YouTube, socials)
/assets/js/data.js    countries + scholarships data
/assets/js/main.js    interactions, forms, calculators
/_build/pages/        page sources  → run `python3 _build/build.py` to regenerate HTML
```

## Go-live checklist
1. **Forms:** submit any form once. FormSubmit then sends an activation email to the site inbox; click it to activate. Optional: paste the alias from that email into `formAlias` in `config.js`.
2. **Custom domain:** in Settings → Pages, set `studywork.com`, then add DNS records.
   - Apex A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` CNAME: `webworksa1.github.io`
   - Tick "Enforce HTTPS".
3. **AdSense:** once the custom domain is live, apply at adsense.google.com. Put your `ca-pub-…` ID in `config.js` → `adsenseClient`, and edit `ads.txt`. EEA/UK traffic needs a Google-certified CMP.
4. **Donations:** paste your PayPal, Stripe, Buy Me a Coffee, GitHub Sponsors or UPI links into `config.js` → `donate`.
5. **YouTube:** set `youtubeChannel` and add video IDs to `videos` in `config.js`.
6. **Search Console:** verify the domain and submit `sitemap.xml`.

## Contact routing
All forms deliver to the owner's inbox through FormSubmit. The address is never displayed on the site: it is encoded in `config.js` and only assembled at submit time. Domain, sponsorship and partnership enquiries link to https://web.works/contact.

© StudyWork. See `disclaimer.html` for the trademark and copyright notice.
