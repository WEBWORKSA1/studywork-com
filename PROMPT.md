# StudyWork.com — Concept, Revenue Model & Phase-wise Build Prompt

## 1. Chosen idea

**StudyWork = "Study abroad + work while you study" hub for international students.**

It covers legal work-hour rules, post-study work visas, scholarships, student jobs and internships, and free money calculators. There is a dedicated lead-generation funnel for free counselling, loan comparison and scholarship matching.

### Why this concept beat the alternatives

| Concept for "Study Work" | Search demand | Commercial intent / CPC | Lead value | Competition | Verdict |
|---|---|---|---|---|---|
| **Study abroad + work while studying (chosen)** | Very high, global, year-round | High: education, loans, visas, housing | $5–$150 per lead (counselling, lenders, universities) | High, but no one owns the "study + work" angle | **Best** |
| US Federal Work-Study info site | Medium, US only, seasonal | Low | Low | .gov dominates | Weak, and a trademark/confusion risk |
| Homework help / study tools | Very high | Low CPC, AI has made it a commodity | Near zero | Very high | Weak |
| Remote jobs for students | Medium | Medium | Low–medium | Medium | Good sub-section, not the core |
| Online degrees for working adults | Medium | High | High | High | Kept as a content vertical |

**Why this angle wins:** most students who plan to study abroad ask "can I work to pay for it?" The big platforms (IDP, Leverage Edu, Studyportals, Yocket) treat work rights as a footnote. StudyWork makes it the headline, and the domain name says it exactly.

## 2. Revenue model (assumption-based; validate with real traffic)

| Stream | Mechanism | Share of revenue at scale |
|---|---|---|
| **Lead generation** | Counselling, loan and scholarship-matching forms. Sell consent-based leads to universities, study-abroad agencies and lenders (CPL) or earn referral commissions | **60–75%** |
| Google AdSense | Display ads on guides, tools and listing pages | 10–20% |
| Affiliates | Education loans, student housing, insurance, money transfer, eSIM, test prep | 5–15% |
| Sponsorships | Featured listings, sponsored contests and scholarships, newsletter placements | 5–15% |
| YouTube | Channel ad revenue plus sponsored integrations; embeds drive dwell time | Growth lever |
| Donations | Pledges and payment links; fund prizes, hiring and outreach | Small but brand-positive |

**Illustrative month 12 (150k sessions per month; mix of 60% emerging markets and 40% tier-1):**

- **AdSense:** about 270k pageviews at a blended $3–5 RPM gives about $0.8k–1.4k.
- **Leads:** 1.5% conversion is about 2,250 leads. If 30% are sellable at an average of $15, that is about $10k.
- **Affiliates and sponsors:** about $2k–6k.

**Takeaway:** AdSense sets the floor, and leads are the business. Every page should push toward a form.

## 3. Features benchmarked (36 sites reviewed)

**Sites reviewed:**

- **Study-abroad platforms:** Leverage Edu, IDP, Mastersportal/Studyportals, TopUniversities, Shiksha Study Abroad, Yocket, ApplyBoard, upGrad Abroad, LeapScholar, University Living, Study International, educations.com
- **Scholarships and jobs:** Scholarships.com, Fastweb, Bold.org, ScholarshipPortal, InternationalStudent.com, Handshake, Internshala, Idealist, WayUp, StudentJob, Prospects, GoAbroad
- **Official and finance:** Canada.ca, Study Australia, Study.eu, Bachelorsportal, DAAD, EducationUSA, Study UK (British Council), Prodigy Finance, MPOWER, BigFuture, Khan Academy, Coursera

**Patterns adopted:**

- Multi-step lead form (goal → destination → profile → contact) plus a callback-time preference
- Repeated counselling CTA (hero, inline, floating button, exit-intent modal)
- Calculators as lead magnets (earnings, funding gap, loan EMI, GPA, ROI, work rights)
- Scholarship database with filters and a saved shortlist
- Country comparison matrix that cites official sources
- Separate funnels for students, employers, partners and sponsors
- In-house contests (lead magnet plus sponsor product) and a newsletter
- Trust signals: dated reviews, source links, clear labelling of sponsored content, privacy-first consent

## 4. Phase-wise build prompt (reusable)

> **Phase 0 — Positioning.** Build "StudyWork", an independent study-abroad + work-while-studying hub for international students (primary markets: India, South Asia, Africa, SE Asia → Canada, UK, Australia, USA, Germany, Ireland, NZ, France). Tone: data-driven, honest, source-linked. Brand: indigo #4338CA + teal #0F9D94 + amber #E58A00, Plus Jakarta Sans, light/dark mode.
>
> **Phase 1 — Foundation.** Static multi-page site deployable on GitHub Pages free plan (no server). Shared header/footer via a tiny Python generator. Every page top bar: "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership" → https://web.works/contact. SEO: unique titles/descriptions, canonical, OG, JSON-LD (Organization, WebSite+SearchAction, Article), sitemap.xml, robots.txt, ads.txt, manifest, 404.
>
> **Phase 2 — Core content.** Pages: Home, Countries (comparison matrix), Scholarships (filterable DB, saved list), Jobs (categories, featured slots, job alerts, employer posting form, scam warnings), Tools (6 calculators), Guides hub + 8 long-form guides, Video hub (lite YouTube embeds, config-driven), About (editorial policy + corrections form).
>
> **Phase 3 — Lead generation.** Dedicated Counselling page with 4-step form (goal → destination/intake/level/field → qualification/grades/English test/budget → name/email/phone/residence/call time/consent). Loan comparison form. Scholarship-matching form. Exit-intent + floating CTA modal. UTM capture on every lead. All forms deliver by email via FormSubmit AJAX with honeypot; the destination email is never shown in text or plain source (encoded, assembled at runtime; replaceable by FormSubmit alias).
>
> **Phase 4 — Monetization.** AdSense slots (header, in-content, sidebar) toggled by one config value; consent banner; GA4 after consent. Advertise/Partners page with packages + media-kit form. Donations page (tiers, allocation, pledge form, configurable PayPal/Stripe/BMAC/GitHub Sponsors/UPI links). Contests page (categories, countdown, entry form, official rules). Careers page (writers, creators, ambassadors, advisors, growth) with application form.
>
> **Phase 5 — Legal & trust.** Privacy (AdSense cookie language, rights by region), Terms, Disclaimer with trademark/copyright notice, non-affiliation statement (incl. U.S. Federal Work-Study), affiliate disclosure, DMCA-style process. No third-party logos, photos or copied text.
>
> **Phase 6 — Launch & growth.** Point studywork.com DNS to GitHub Pages, add CNAME, apply for AdSense, submit sitemap to Search Console, launch YouTube channel and add video IDs to config, activate FormSubmit, then scale content: one page per country × (work rules, jobs, costs, scholarships), nationality-specific pages ("Indian students in Canada"), city cost pages, and a monthly "rule changes" roundup.
>
> **Phase 7 — Scale (optional).** Migrate forms to a CRM (HubSpot/Airtable), add accounts/saved plans, a lead-routing partner portal, programmatic scholarship pages, and multilingual versions (Hindi, Urdu, Bengali, Swahili, Arabic, Portuguese).

## 5. Trademark / copyright notes

- "Study" and "work" are generic. The site uses StudyWork descriptively and publishes a non-affiliation notice. See `disclaimer.html`.
- **Before investing in the brand,** run a trademark search for "STUDYWORK" (USPTO, CIPO, UKIPO, EUIPO, WIPO Global Brand DB, Indian TM registry) in classes 35, 41 and 42. **This was not verified during the build.**
- All code, copy and graphics are original. Scholarship and program names are used nominatively and link to official sites.
