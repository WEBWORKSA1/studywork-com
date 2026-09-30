#!/usr/bin/env python3
"""StudyWork static site generator.
Pages live in _build/pages/**.html with a small meta header:
<!--
title: Page title
description: Meta description
keywords: comma, separated
-->
Body HTML follows. Macros: {{R}} = relative root, {{AD:slot}} = ad slot,
{{LEADFORM}} = full multi-step counselling form, {{NEWS}} = newsletter band.
Run:  python3 _build/build.py   (outputs into the repo root)
"""
import json, os, re, glob, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = os.path.join(ROOT, "_build", "pages")
SITE = "https://studywork.com"
UPDATED = "September 2026"
TODAY = datetime.date.today().isoformat()

NAV = [("countries.html", "Countries"), ("scholarships.html", "Scholarships"), ("jobs.html", "Jobs"),
       ("tools.html", "Tools"), ("guides.html", "Guides"), ("videos.html", "Videos"),
       ("contests.html", "Contests"), ("donate.html", "Support")]

LOGO = '''<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4338ca"/><stop offset="1" stop-color="#0f9d94"/></linearGradient></defs><rect width="40" height="40" rx="11" fill="url(#lg)"/><path d="M9 14.5 20 9l11 5.5-11 5.5z" fill="#fff"/><path d="M13 17.5v5.2c0 1.8 3.1 3.3 7 3.3s7-1.5 7-3.3v-5.2l-7 3.5z" fill="#fff" opacity=".85"/><rect x="15" y="27.5" width="10" height="5.5" rx="1.6" fill="#fde68a"/><rect x="18" y="26" width="4" height="2.4" rx="1" fill="none" stroke="#fde68a" stroke-width="1.2"/></svg>'''

LEADFORM = '''
<form class="sw-form multistep form" data-subject="Free counselling request" data-ok="You're in! A StudyWork advisor will contact you within 1–2 business days with your personalised study-and-work plan." novalidate>
  <div class="steps-bar" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
  <input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
  <div class="step" data-auto>
    <p class="small muted" style="margin:0">Step 1 of 4 · What are you planning?</p>
    <div class="options">
      <label class="opt"><input type="radio" name="goal" value="Study abroad + part-time work" required><span>🎓 Study abroad + work part-time</span></label>
      <label class="opt"><input type="radio" name="goal" value="Scholarship / funding"><span>💰 Win a scholarship</span></label>
      <label class="opt"><input type="radio" name="goal" value="Post-study work visa / career"><span>🧳 Post-study work & career</span></label>
      <label class="opt"><input type="radio" name="goal" value="Education loan"><span>🏦 Education loan</span></label>
      <label class="opt"><input type="radio" name="goal" value="Online study while working"><span>💻 Online study while working</span></label>
      <label class="opt"><input type="radio" name="goal" value="Internship / student job"><span>🧑‍💼 Internship or student job</span></label>
    </div>
  </div>
  <div class="step">
    <p class="small muted" style="margin:0">Step 2 of 4 · Where & when?</p>
    <div class="row">
      <div><label for="lf-dest">Preferred destination</label><select id="lf-dest" name="destination" required><option value="">Choose…</option><option>Canada</option><option>United Kingdom</option><option>Australia</option><option>United States</option><option>Germany</option><option>Ireland</option><option>New Zealand</option><option>France</option><option>Other Europe</option><option>Not sure yet</option></select></div>
      <div><label for="lf-intake">Intake</label><select id="lf-intake" name="intake" required><option value="">Choose…</option><option>Within 6 months</option><option>6–12 months</option><option>12–24 months</option><option>Just exploring</option></select></div>
    </div>
    <div class="row">
      <div><label for="lf-level">Study level</label><select id="lf-level" name="level" required><option value="">Choose…</option><option>Diploma / Certificate</option><option>Bachelor's</option><option>Master's</option><option>MBA</option><option>PhD / Research</option><option>Language / Foundation</option></select></div>
      <div><label for="lf-field">Field of study</label><input id="lf-field" name="field" placeholder="e.g. Data Science, Nursing, Business" required></div>
    </div>
    <div class="step-nav"><button type="button" class="btn btn-ghost" data-prev>← Back</button><button type="button" class="btn btn-primary" data-next>Continue →</button></div>
  </div>
  <div class="step">
    <p class="small muted" style="margin:0">Step 3 of 4 · Your profile (helps us match funding)</p>
    <div class="row">
      <div><label for="lf-edu">Highest qualification</label><select id="lf-edu" name="qualification" required><option value="">Choose…</option><option>High school (12th grade)</option><option>Diploma</option><option>Bachelor's degree</option><option>Master's degree</option><option>Working professional</option></select></div>
      <div><label for="lf-score">Grades (%, CGPA or GPA)</label><input id="lf-score" name="grades" placeholder="e.g. 78% or 8.1 CGPA"></div>
    </div>
    <div class="row">
      <div><label for="lf-eng">English test</label><select id="lf-eng" name="english_test"><option>Not taken yet</option><option>IELTS</option><option>TOEFL</option><option>PTE</option><option>Duolingo English Test</option><option>Exempt / native</option></select></div>
      <div><label for="lf-budget">Total budget (per year, USD)</label><select id="lf-budget" name="budget" required><option value="">Choose…</option><option>Under $10,000</option><option>$10,000–$20,000</option><option>$20,000–$35,000</option><option>$35,000–$50,000</option><option>$50,000+</option><option>Need full funding</option></select></div>
    </div>
    <div class="step-nav"><button type="button" class="btn btn-ghost" data-prev>← Back</button><button type="button" class="btn btn-primary" data-next>Continue →</button></div>
  </div>
  <div class="step">
    <p class="small muted" style="margin:0">Step 4 of 4 · Where should we send your plan?</p>
    <div class="row">
      <div><label for="lf-name">Full name</label><input id="lf-name" name="name" autocomplete="name" required></div>
      <div><label for="lf-email">Email</label><input id="lf-email" type="email" name="email" autocomplete="email" required></div>
    </div>
    <div class="row">
      <div><label for="lf-phone">Phone / WhatsApp (with country code)</label><input id="lf-phone" type="tel" name="phone" autocomplete="tel" placeholder="+91 98xxxxxxx" required></div>
      <div><label for="lf-country">Your country of residence</label><input id="lf-country" name="residence" autocomplete="country-name" required></div>
    </div>
    <div><label for="lf-time">Best time to call</label><select id="lf-time" name="call_time"><option>Any time</option><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Email only, please</option></select></div>
    <label class="check"><input type="checkbox" name="consent" value="yes" required> I agree to be contacted by StudyWork and, if I choose, by vetted partner institutions/lenders about my request. See the <a href="{{R}}privacy.html">Privacy Policy</a>.</label>
    <div class="step-nav"><button type="button" class="btn btn-ghost" data-prev>← Back</button><button type="submit" class="btn btn-primary">Get my free plan ✓</button></div>
  </div>
  <div class="form-msg" role="status" aria-live="polite"></div>
</form>'''

NEWS = '''
<section><div class="container"><div class="band reveal"><div class="split">
  <div><h2>Get the weekly StudyWork brief</h2><p>New scholarships, visa and work-rule changes, student-job openings and contest alerts — one short email every week. Free forever.</p></div>
  <form class="sw-form form" data-subject="Newsletter subscription" data-ok="Subscribed! Watch your inbox for the next StudyWork brief.">
    <input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="row"><div><label for="nw-name" style="color:#dfe3ff">First name</label><input id="nw-name" name="name" required></div><div><label for="nw-email" style="color:#dfe3ff">Email</label><input id="nw-email" type="email" name="email" required></div></div>
    <div><label for="nw-int" style="color:#dfe3ff">I'm most interested in</label><select id="nw-int" name="interest"><option>Scholarships</option><option>Part-time jobs & internships</option><option>Visa & work-rule updates</option><option>Contests & prizes</option><option>Everything</option></select></div>
    <button class="btn btn-amber" type="submit">Subscribe free</button>
    <div class="form-msg" role="status" aria-live="polite"></div>
  </form>
</div></div></div></section>'''

def ad(slot):
    return (f'<div class="ad-slot" data-slot="{slot}" aria-label="Advertisement"><span class="ad-label">Advertisement</span>'
            f'<div class="ad-inner">Ad space · <a href="{{{{R}}}}advertise.html">&nbsp;advertise with StudyWork</a></div></div>')

def layout(meta, body, path):
    depth = path.count("/")
    R = "../" * depth
    title = meta["title"]
    full_title = title if "StudyWork" in title else f"{title} | StudyWork"
    desc = meta.get("description", "")
    url = f"{SITE}/{path}".replace("/index.html", "/")
    nav = "".join(f'<li><a href="{R}{h}">{t}</a></li>' for h, t in NAV)
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Organization", "name": "StudyWork", "url": SITE, "logo": f"{SITE}/assets/img/logo.svg"},
        {"@type": "WebSite", "name": "StudyWork", "url": SITE,
         "potentialAction": {"@type": "SearchAction", "target": f"{SITE}/scholarships.html?q={{query}}", "query-input": "required name=query"}}]}
    if meta.get("type") == "article":
        ld["@graph"].append({"@type": "Article", "headline": title, "description": desc, "dateModified": TODAY,
                             "author": {"@type": "Organization", "name": "StudyWork Editorial Team"},
                             "publisher": {"@type": "Organization", "name": "StudyWork"}, "mainEntityOfPage": url})
    body = body.replace("{{LEADFORM}}", LEADFORM).replace("{{NEWS}}", NEWS)
    body = re.sub(r"\{\{AD:(\w+)\}\}", lambda m: ad(m.group(1)), body)
    body = body.replace("{{UPDATED}}", UPDATED)
    html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{full_title}</title>
<meta name="description" content="{desc}">
<meta name="keywords" content="{meta.get("keywords","study abroad, work while studying, scholarships, student jobs")}">
<link rel="canonical" href="{url}">
<meta name="robots" content="{meta.get("robots","index,follow")}">
<meta name="theme-color" content="#4338ca">
<meta property="og:type" content="{"article" if meta.get("type")=="article" else "website"}">
<meta property="og:site_name" content="StudyWork">
<meta property="og:title" content="{full_title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/assets/img/og.svg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{R}assets/img/logo.svg" type="image/svg+xml">
<link rel="manifest" href="{R}manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{R}assets/css/style.css">
<script>try{{var t=localStorage.getItem("sw_theme");if(t)document.documentElement.setAttribute("data-theme",JSON.parse(t))}}catch(e){{}}</script>
<noscript><style>.reveal{{opacity:1;transform:none}}</style></noscript>
<script type="application/ld+json">{json.dumps(ld)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="topbar" role="note">Contact, if you are interested in this <a href="https://web.works/contact" target="_blank" rel="noopener">website / domain name / Sponsorship / Advertisement / Partnership</a></div>
<header class="site-header"><div class="container nav">
  <a class="logo" href="{R}index.html" aria-label="StudyWork home">{LOGO}<span>Study<b>Work</b></span></a>
  <button class="icon-btn menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">☰</button>
  <ul class="nav-links" id="nav-links">{nav}
    <li><button class="icon-btn theme-toggle" type="button" aria-label="Toggle dark mode"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button></li>
    <li class="nav-cta"><a class="btn btn-primary btn-sm" href="{R}counselling.html">Free Counselling</a></li>
  </ul>
</div></header>
<main id="main">
{body}
</main>
<script src="{R}assets/js/layout.js" data-root="{R}"></script>
<script src="{R}assets/js/config.js"></script>
<script src="{R}assets/js/data.js"></script>
<script src="{R}assets/js/search-index.js"></script>
<script src="{R}assets/js/main.js" defer></script>
</body>
</html>
'''
    return html.replace("{{R}}", R)

CHROME_TPL = r"""<footer class="site-footer"><div class="container">
  <div class="foot-grid">
    <div><a class="logo" href="{{R}}index.html" style="color:#fff">__LOGO__<span>Study<b style="color:#a5b4fc">Work</b></span></a>
      <p class="small" style="margin-top:12px">The independent guide to studying abroad <em>and</em> working while you study — scholarships, part-time work rules, post-study visas, student jobs and free planning tools.</p>
      <form class="sw-form" data-subject="Footer newsletter" data-ok="Subscribed — thank you!"><input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true"><div class="newsletter"><label class="sr-only" for="ft-email">Email</label><input id="ft-email" type="email" name="email" placeholder="Your email" required><button class="btn btn-amber btn-sm" type="submit">Join</button></div><div class="form-msg" role="status" style="margin-top:8px"></div></form>
    </div>
    <div><h4>Explore</h4><ul><li><a href="{{R}}countries.html">Study & work by country</a></li><li><a href="{{R}}scholarships.html">Scholarship finder</a></li><li><a href="{{R}}jobs.html">Student jobs & internships</a></li><li><a href="{{R}}tools.html">Free calculators</a></li><li><a href="{{R}}guides.html">Guides</a></li><li><a href="{{R}}videos.html">Video hub</a></li></ul></div>
    <div><h4>Get involved</h4><ul><li><a href="{{R}}counselling.html">Free counselling</a></li><li><a href="{{R}}contests.html">Contests & prizes</a></li><li><a href="{{R}}donate.html">Support StudyWork</a></li><li><a href="{{R}}careers.html">Careers & ambassadors</a></li><li><a href="{{R}}jobs.html#post">Post a job</a></li></ul></div>
    <div><h4>Partners</h4><ul><li><a href="{{R}}advertise.html">Advertise</a></li><li><a href="{{R}}advertise.html#partners">Universities & lenders</a></li><li><a href="{{R}}advertise.html#sponsor">Sponsor a contest</a></li><li><a href="https://web.works/contact" target="_blank" rel="noopener">Acquire this domain</a></li></ul></div>
    <div><h4>Company</h4><ul><li><a href="{{R}}about.html">About</a></li><li><a href="{{R}}contact.html">Contact</a></li><li><a href="{{R}}privacy.html">Privacy</a></li><li><a href="{{R}}terms.html">Terms</a></li><li><a href="{{R}}disclaimer.html">Disclaimer & trademarks</a></li><li><a href="{{R}}sitemap.xml">Sitemap</a></li></ul>
      <ul style="display:flex;gap:10px;margin-top:10px"><li><a data-social="x" href="#">X</a></li><li><a data-social="instagram" href="#">Instagram</a></li><li><a data-social="linkedin" href="#">LinkedIn</a></li><li><a data-social="facebook" href="#">Facebook</a></li><li><a data-social="tiktok" href="#">TikTok</a></li><li><a data-yt-channel href="#">YouTube</a></li></ul></div>
  </div>
  <div class="foot-bottom">
    <p style="margin:0">© <span class="year">2026</span> StudyWork. All rights reserved. Original content and design; third-party names, marks and logos belong to their respective owners and are used for identification only. StudyWork is an independent information service and is not affiliated with, endorsed by or acting for any government, immigration authority, university or any similarly named program or company. <a href="{{R}}disclaimer.html">Full disclaimer & trademark notice</a>.</p>
    <p style="margin:0">Visa and work rules change frequently. Information last reviewed __UPDATED__. Always confirm with the official source before making decisions. Not legal, immigration or financial advice.</p>
  </div>
</div></footer>
<a class="btn btn-primary fab" href="{{R}}counselling.html" data-open-lead>🎓 Free study & work plan</a>
<div class="cookie" role="dialog" aria-label="Cookie consent"><p style="margin:0 0 10px"><b>Cookies & ads.</b> We use essential cookies, and — with your consent — analytics and advertising cookies (including Google) to keep StudyWork free. <a href="{{R}}privacy.html#cookies">Learn more</a>.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" data-consent="all">Accept all</button><button class="btn btn-ghost btn-sm" data-consent="essential">Essential only</button></div></div>
<div class="modal" id="lead-modal" role="dialog" aria-modal="true" aria-labelledby="lm-title"><div class="form-card">
  <button class="icon-btn close" aria-label="Close">✕</button>
  <span class="eyebrow">Free · 2 minutes</span>
  <h2 id="lm-title" style="font-size:1.5rem">Get your personalised study-and-work plan</h2>
  <p class="muted small">Tell us your goal — we'll send scholarships you qualify for, the work rules for your destination and a realistic budget.</p>
  <form class="sw-form form" data-subject="Quick lead (popup)" data-ok="Done! Your plan request is in — check your inbox within 1–2 business days.">
    <input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="row"><div><label for="m-name">Name</label><input id="m-name" name="name" required autocomplete="name"></div><div><label for="m-email">Email</label><input id="m-email" type="email" name="email" required autocomplete="email"></div></div>
    <div class="row"><div><label for="m-phone">Phone / WhatsApp</label><input id="m-phone" type="tel" name="phone" placeholder="+country code" autocomplete="tel"></div><div><label for="m-dest">Destination</label><select id="m-dest" name="destination" required><option value="">Choose…</option><option>Canada</option><option>United Kingdom</option><option>Australia</option><option>United States</option><option>Germany</option><option>Ireland</option><option>New Zealand</option><option>France</option><option>Not sure</option></select></div></div>
    <div><label for="m-goal">Main goal</label><select id="m-goal" name="goal"><option>Study + part-time work</option><option>Scholarship</option><option>Post-study work visa</option><option>Education loan</option><option>Internship / job</option></select></div>
    <label class="check"><input type="checkbox" name="consent" value="yes" required> I agree to be contacted about my request (<a href="{{R}}privacy.html">privacy</a>).</label>
    <button class="btn btn-primary btn-block" type="submit">Send me my free plan</button>
    <div class="form-msg" role="status" aria-live="polite"></div>
  </form>
</div></div>"""

def write_chrome():
    html = CHROME_TPL.replace("__LOGO__", LOGO).replace("__UPDATED__", UPDATED)
    js = ("(function(){var s=document.currentScript,R=s.getAttribute('data-root')||'';"
          "var h=" + json.dumps(html) + ";s.insertAdjacentHTML('beforebegin',h.split('{{R}}').join(R))})();\n")
    open(os.path.join(ROOT, "assets", "js", "layout.js"), "w", encoding="utf-8").write(js)

def parse(fp):
    raw = open(fp, encoding="utf-8").read()
    m = re.match(r"\s*<!--(.*?)-->", raw, re.S)
    meta = {}
    for line in m.group(1).strip().splitlines():
        k, _, v = line.partition(":")
        meta[k.strip()] = v.strip()
    return meta, raw[m.end():]

def main():
    write_chrome()
    files = sorted(glob.glob(os.path.join(PAGES, "**", "*.html"), recursive=True))
    index, urls = [], []
    for fp in files:
        rel = os.path.relpath(fp, PAGES).replace(os.sep, "/")
        meta, body = parse(fp)
        out = os.path.join(ROOT, rel)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "w", encoding="utf-8").write(layout(meta, body, rel))
        if meta.get("robots", "").startswith("noindex"):
            continue
        urls.append(rel)
        text = re.sub(r"<[^>]+>", " ", body)
        heads = " ".join(re.findall(r"<h[23][^>]*>(.*?)</h[23]>", body))
        index.append({"u": rel, "t": meta["title"], "d": meta.get("description", ""),
                      "k": (meta.get("keywords", "") + " " + re.sub(r"<[^>]+>|\s+", " ", heads))[:600]})
    with open(os.path.join(ROOT, "assets", "js", "search-index.js"), "w") as f:
        f.write("window.SW_INDEX=" + json.dumps(index, separators=(",", ":")) + ";\n")
        # search links are root-relative; fix for nested pages at runtime
        f.write('(function(){var d=(location.pathname.match(/\\/guides\\//)?"../":"");window.SW_INDEX.forEach(function(p){p.u=d+p.u})})();\n')
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        loc = f"{SITE}/" + ("" if u == "index.html" else u)
        pr = "1.0" if u == "index.html" else ("0.7" if u.startswith("guides/") else "0.8")
        sm.append(f"  <url><loc>{loc}</loc><lastmod>{TODAY}</lastmod><priority>{pr}</priority></url>")
    sm.append("</urlset>")
    open(os.path.join(ROOT, "sitemap.xml"), "w").write("\n".join(sm) + "\n")
    print(f"Built {len(files)} pages")

if __name__ == "__main__":
    main()
