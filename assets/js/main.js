/* StudyWork — core interactions (vanilla JS, no dependencies) */
(function(){
  "use strict";
  var C = window.SW_CONFIG || {};
  var $ = function(s,r){return (r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var store = {
    get:function(k,d){try{var v=localStorage.getItem("sw_"+k);return v===null?d:JSON.parse(v)}catch(e){return d}},
    set:function(k,v){try{localStorage.setItem("sw_"+k,JSON.stringify(v))}catch(e){}}
  };
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
  function fmt(n,d){return Number(n).toLocaleString(undefined,{maximumFractionDigits:d==null?0:d,minimumFractionDigits:d||0})}

  /* ---------- contact route (never rendered as text) ---------- */
  function route(){
    var a=window.SW_R||[],k=[23,91,7,142,61],o="";
    for(var i=0;i<a.length;i++){o+=String.fromCharCode((a[i]-i*3)^k[i%5])}
    return o.split("").reverse().join("");
  }
  function endpoint(){return "https://formsubmit.co/ajax/"+(C.formAlias||route())}
  $$("[data-mail]").forEach(function(el){
    el.setAttribute("href","contact.html");
    el.addEventListener("click",function(e){
      e.preventDefault();
      var s=el.getAttribute("data-mail")||"StudyWork enquiry";
      window.location.href="mai"+"lto:"+route()+"?subject="+encodeURIComponent(s);
    });
  });

  /* ---------- theme ---------- */
  var root=document.documentElement,saved=store.get("theme",null);
  if(saved)root.setAttribute("data-theme",saved);
  $$(".theme-toggle").forEach(function(b){b.addEventListener("click",function(){
    var dark=root.getAttribute("data-theme")==="dark"||(!root.getAttribute("data-theme")&&matchMedia("(prefers-color-scheme: dark)").matches);
    var next=dark?"light":"dark";root.setAttribute("data-theme",next);store.set("theme",next);
  })});

  /* ---------- nav ---------- */
  var mb=$(".menu-btn"),nl=$(".nav-links");
  if(mb&&nl){mb.addEventListener("click",function(){var o=nl.classList.toggle("open");mb.setAttribute("aria-expanded",o)})}
  var here=location.pathname.split("/").pop()||"index.html";
  $$(".nav-links a").forEach(function(a){if(a.getAttribute("href")===here)a.setAttribute("aria-current","page")});
  $$(".year").forEach(function(y){y.textContent=new Date().getFullYear()});

  /* ---------- reveal + counters ---------- */
  var io="IntersectionObserver" in window?new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;e.target.classList.add("in");
    var c=e.target.querySelector("[data-count]")||(e.target.hasAttribute("data-count")?e.target:null);
    if(c&&!c._done){c._done=1;var t=+c.getAttribute("data-count"),s=performance.now();
      (function step(n){var p=Math.min(1,(n-s)/1100);c.textContent=fmt(Math.round(t*p))+(c.getAttribute("data-suffix")||"");if(p<1)requestAnimationFrame(step)})(s)}
    io.unobserve(e.target)})},{threshold:.15}):null;
  $$(".reveal,[data-count]").forEach(function(el){io?io.observe(el):el.classList.add("in")});

  /* ---------- ads ---------- */
  function loadScript(src,attrs){var s=document.createElement("script");s.async=true;s.src=src;for(var k in (attrs||{}))s.setAttribute(k,attrs[k]);document.head.appendChild(s);return s}
  if(C.adsenseClient){
    loadScript("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+C.adsenseClient,{crossorigin:"anonymous"});
    $$(".ad-slot").forEach(function(s){
      var slot=(C.adSlots||{})[s.getAttribute("data-slot")]||"";
      s.classList.add("live");
      s.querySelector(".ad-inner").innerHTML='<ins class="adsbygoogle" style="display:block" data-ad-client="'+esc(C.adsenseClient)+'"'+(slot?' data-ad-slot="'+esc(slot)+'"':"")+' data-ad-format="auto" data-full-width-responsive="true"></ins>';
      try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){}
    });
  }

  /* ---------- cookie consent + analytics ---------- */
  function startGA(){if(!C.ga4)return;loadScript("https://www.googletagmanager.com/gtag/js?id="+C.ga4);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config",C.ga4)}
  var ck=$(".cookie"),consent=store.get("consent",null);
  if(consent==="all")startGA();
  if(ck&&!consent){setTimeout(function(){ck.classList.add("show")},900)}
  $$("[data-consent]").forEach(function(b){b.addEventListener("click",function(){var v=b.getAttribute("data-consent");store.set("consent",v);ck.classList.remove("show");if(v==="all")startGA()})});
  function track(name,params){try{if(window.gtag)gtag("event",name,params||{})}catch(e){}}

  /* ---------- forms ---------- */
  function serialize(form){
    var d={};new FormData(form).forEach(function(v,k){if(k.charAt(0)==="_")return;d[k]=d[k]?d[k]+", "+v:v});return d;
  }
  $$("form.sw-form").forEach(function(form){
    form.addEventListener("submit",function(e){
      e.preventDefault();
      var msg=form.querySelector(".form-msg"),btn=form.querySelector("[type=submit]");
      if(!form.checkValidity()){form.reportValidity();return}
      var hp=form.querySelector("[name=_honey]");if(hp&&hp.value)return;
      var data=serialize(form);
      data._subject="[StudyWork] "+(form.getAttribute("data-subject")||"Website form")+(data.name?" — "+data.name:"");
      data._template="table";data._captcha="false";
      data.page=location.href;data.submitted=new Date().toISOString();
      var src=store.get("utm",null);if(src)data.source=src;
      if(btn){btn.disabled=true;btn._t=btn.textContent;btn.textContent="Sending…"}
      fetch(endpoint(),{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(data)})
        .then(function(r){return r.json().catch(function(){return {}}).then(function(j){if(!r.ok||j.success==="false")throw new Error(j.message||"Failed");return j})})
        .then(function(){
          if(msg){msg.className="form-msg ok";msg.textContent=form.getAttribute("data-ok")||"Thank you! Your message has been received. We'll get back to you shortly."}
          track("generate_lead",{form:form.getAttribute("data-subject")});
          form.reset();$$(".step",form).forEach(function(s,i){s.classList.toggle("active",i===0)});updateBar(form,0);
        })
        .catch(function(){if(msg){msg.className="form-msg err";msg.textContent="Sorry — the message could not be sent right now. Please try again in a minute."}})
        .finally(function(){if(btn){btn.disabled=false;btn.textContent=btn._t}});
    });
  });
  /* capture UTM for lead attribution */
  (function(){var q=new URLSearchParams(location.search),u=["utm_source","utm_medium","utm_campaign"].map(function(k){return q.get(k)}).filter(Boolean);if(u.length)store.set("utm",u.join(" / "))})();

  /* ---------- multi-step forms ---------- */
  function updateBar(form,i){$$(".steps-bar span",form).forEach(function(s,j){s.classList.toggle("on",j<=i)})}
  $$("form.multistep").forEach(function(form){
    var steps=$$(".step",form),i=0;
    function go(n){
      if(n>i){var cur=steps[i],bad=$$("input,select,textarea",cur).filter(function(f){return !f.checkValidity()});
        if(bad.length){bad[0].reportValidity();return}}
      i=Math.max(0,Math.min(steps.length-1,n));steps.forEach(function(s,j){s.classList.toggle("active",j===i)});updateBar(form,i);
      var f=steps[i].querySelector("input:not([type=hidden]),select,textarea");if(f&&n!==0)f.focus({preventScroll:true});
    }
    $$("[data-next]",form).forEach(function(b){b.addEventListener("click",function(){go(i+1)})});
    $$("[data-prev]",form).forEach(function(b){b.addEventListener("click",function(){go(i-1)})});
    $$(".opt input[type=radio]",form).forEach(function(r){r.addEventListener("change",function(){if(r.closest(".step").hasAttribute("data-auto"))setTimeout(function(){go(i+1)},180)})});
    go(0);
  });

  /* ---------- modal (lead capture) ---------- */
  var modal=$("#lead-modal");
  function openModal(){if(!modal)return;modal.classList.add("show");var f=modal.querySelector("input,select");if(f)f.focus()}
  function closeModal(){if(modal)modal.classList.remove("show")}
  $$("[data-open-lead]").forEach(function(b){b.addEventListener("click",function(e){e.preventDefault();openModal()})});
  if(modal){modal.addEventListener("click",function(e){if(e.target===modal||e.target.closest(".close"))closeModal()});
    document.addEventListener("keydown",function(e){if(e.key==="Escape")closeModal()});
    if(!store.get("exit_seen",false)&&matchMedia("(pointer:fine)").matches){
      document.addEventListener("mouseout",function h(e){if(!e.relatedTarget&&e.clientY<8){store.set("exit_seen",true);openModal();document.removeEventListener("mouseout",h)}});
    }}

  /* ---------- country helpers ---------- */
  var CT=window.SW_COUNTRIES||[];
  function byCode(c){for(var i=0;i<CT.length;i++)if(CT[i].code===c)return CT[i];return CT[0]}
  $$("select[data-countries]").forEach(function(s){s.innerHTML=CT.map(function(c){return '<option value="'+c.code+'">'+c.flag+" "+esc(c.name)+"</option>"}).join("")});

  /* comparison table */
  var ctab=$("#compare-table");
  if(ctab){ctab.innerHTML='<table><thead><tr><th>Country</th><th>Work during term</th><th>Work during breaks</th><th>Post-study work</th><th>Official source</th></tr></thead><tbody>'+
    CT.map(function(c){return '<tr id="c-'+c.code+'"><td><b>'+c.flag+" "+esc(c.name)+'</b></td><td>'+esc(c.termRule)+'</td><td>'+esc(c.breakRule)+'</td><td>'+esc(c.psw)+'</td><td><a href="'+c.source+'" target="_blank" rel="noopener nofollow">Official page ↗</a></td></tr>'}).join("")+'</tbody></table>'}
  var hc=$("#hero-countries");
  if(hc){hc.innerHTML=CT.slice(0,6).map(function(c){return '<div class="mini-row"><span><span class="flag">'+c.flag+'</span>'+esc(c.name)+'</span><b>'+(c.code==="DE"?"140 days/yr":c.code==="US"?"20h on-campus":c.code==="AU"?"48h / 2 wks":c.termHours+" h/week")+'</b></div>'}).join("")}

  /* ---------- tools ---------- */
  $$(".tool-tabs").forEach(function(tabs){
    var btns=$$("button",tabs);
    function show(id){btns.forEach(function(b){b.setAttribute("aria-selected",b.getAttribute("data-tool")===id)});$$(".tool").forEach(function(t){t.classList.toggle("active",t.id===id)});if(history.replaceState)history.replaceState(null,"","#"+id)}
    btns.forEach(function(b){b.addEventListener("click",function(){show(b.getAttribute("data-tool"))})});
    var h=location.hash.slice(1);show(btns.some(function(b){return b.getAttribute("data-tool")===h})?h:btns[0].getAttribute("data-tool"));
  });
  function onInput(form,fn){if(!form)return;form.addEventListener("input",fn);form.addEventListener("change",fn);fn()}

  /* 1. Work-rights checker */
  var wr=$("#tool-rights form");
  onInput(wr,function(){
    var c=byCode(wr.country.value),out=$("#rights-out"),ft=wr.fulltime.value==="yes",lvl=wr.level.value;
    var h='<h3>'+c.flag+" "+esc(c.name)+'</h3>';
    if(!ft){h+='<p><b>Caution:</b> most countries only grant work rights to <b>full-time</b> students. Part-time students usually cannot work off-campus. Check the official page before accepting any job.</p>'}
    else{h+='<p><b>During term:</b> '+esc(c.termRule)+(c.code==="UK"&&lvl==="below"?" — <b>below degree level the limit is 10 hrs/week.</b>":"")+'</p><p><b>During breaks:</b> '+esc(c.breakRule)+'</p>'}
    h+='<p><b>After graduation:</b> '+esc(c.psw)+'</p><p class="small"><b>Typical conditions:</b></p><ul class="small">'+c.conditions.map(function(x){return "<li>"+esc(x)+"</li>"}).join("")+'</ul><p class="small">Source: <a href="'+c.source+'" target="_blank" rel="noopener nofollow">official government page ↗</a>. Rules change — always verify.</p>';
    out.innerHTML=h;
  });

  /* 2. Earnings estimator */
  var ee=$("#tool-earn form");
  if(ee){ee.country.addEventListener("change",function(){var c=byCode(ee.country.value);ee.wage.value=c.wage;ee.hours.value=c.termHours;ee.living.value=c.living;$("#wage-note").textContent=c.wageNote})}
  onInput(ee,function(){
    var c=byCode(ee.country.value);if(!ee._init){ee._init=1;ee.wage.value=c.wage;ee.hours.value=c.termHours;ee.living.value=c.living;$("#wage-note").textContent=c.wageNote}
    var w=+ee.wage.value||0,h=Math.min(+ee.hours.value||0,60),tw=+ee.termweeks.value||0,bw=+ee.breakweeks.value||0,bh=+ee.breakhours.value||0,liv=+ee.living.value||0;
    var gross=w*h*tw+w*bh*bw,month=gross/12,cover=liv?Math.min(100,month/liv*100):0;
    $("#earn-out").innerHTML='<b class="big">'+c.sym+fmt(gross)+' '+c.cur+' / year</b><span class="muted">≈ '+c.sym+fmt(month)+' per month before tax</span><div class="meter" aria-hidden="true"><i style="width:'+cover+'%"></i></div><p class="small">Covers about <b>'+fmt(cover)+'%</b> of your estimated living costs ('+c.sym+fmt(liv)+'/month). '+(h>c.termHours?'<b style="color:var(--rose)">Warning: '+h+' hrs/week exceeds the usual term limit for '+esc(c.name)+'.</b>':'')+'</p>';
  });

  /* 3. Budget / funding gap */
  var bg=$("#tool-budget form");
  onInput(bg,function(){
    var t=+bg.tuition.value||0,l=(+bg.living.value||0)*12,x=+bg.extras.value||0,s=+bg.savings.value||0,sc=+bg.schol.value||0,wk=+bg.work.value||0,y=+bg.years.value||1;
    var need=(t+l+x)*y,have=s+sc*y+wk*12*y,gap=need-have;
    $("#budget-out").innerHTML='<b class="big">'+(gap>0?"Gap: "+fmt(gap):"Surplus: "+fmt(-gap))+'</b><span class="muted">Total cost '+fmt(need)+' vs. funding '+fmt(have)+' over '+y+' year(s)</span><div class="meter"><i style="width:'+Math.min(100,need?have/need*100:0)+'%"></i></div>'+(gap>0?'<p class="small">Close the gap: search <a href="scholarships.html">scholarships</a>, compare <a href="tools.html#tool-loan">education loans</a> or <a href="counselling.html">get a free funding plan</a>.</p>':'<p class="small">Your plan looks funded. Keep a 10–15% buffer for currency swings.</p>');
  });

  /* 4. Loan EMI */
  var ln=$("#tool-loan form");
  onInput(ln,function(){
    var P=+ln.amount.value||0,r=(+ln.rate.value||0)/1200,n=(+ln.years.value||1)*12,g=+ln.grace.value||0;
    var Pg=P*Math.pow(1+r,g),emi=r?Pg*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):Pg/n,tot=emi*n;
    $("#loan-out").innerHTML='<b class="big">'+fmt(emi)+' / month</b><span class="muted">Total repaid '+fmt(tot)+' · Interest '+fmt(tot-P)+(g?' · includes '+g+' months of grace-period interest':'')+'</span><p class="small">Want lender quotes? <a href="counselling.html#loan">Request a free loan comparison</a>.</p>';
  });

  /* 5. GPA converter */
  var gp=$("#tool-gpa form");
  onInput(gp,function(){
    var v=+gp.score.value||0,s=gp.scale.value;
    var sc={pct:[100,40],cgpa10:[10,4],gpa4:[4,2],gpa5:[5,2]}[s],max=sc[0],min=sc[1];
    v=Math.max(0,Math.min(max,v));
    var gpa4=Math.min(4,v/max*4),pct=v/max*100;
    var de=v<min?null:Math.max(1,Math.min(4,1+3*(max-v)/(max-min)));
    $("#gpa-out").innerHTML='<b class="big">'+gpa4.toFixed(2)+' / 4.0</b><span class="muted">Proportional equivalent · '+fmt(pct,1)+'% of scale · German grade (modified Bavarian formula, pass mark '+min+') ≈ <b>'+(de?de.toFixed(1):"not a pass")+'</b></span><p class="small">Indicative only. Universities and credential evaluators (e.g. WES) apply their own country-specific conversions — always check the admissions page.</p>';
  });

  /* 6. ROI / payback */
  var roi=$("#tool-roi form");
  onInput(roi,function(){
    var cost=+roi.cost.value||0,before=+roi.before.value||0,after=+roi.after.value||0,save=(+roi.saverate.value||0)/100;
    var uplift=after-before,years=uplift>0&&save>0?cost/(uplift*save):Infinity;
    $("#roi-out").innerHTML='<b class="big">'+(isFinite(years)?fmt(years,1)+" years to pay back":"No payback at these numbers")+'</b><span class="muted">Salary uplift '+fmt(uplift)+'/year · you set aside '+fmt(save*100)+'% of it</span><p class="small">10-year net gain ≈ <b>'+fmt(uplift*10-cost)+'</b> (before tax, ignoring raises and inflation).</p>';
  });

  /* ---------- scholarships ---------- */
  var sl=$("#sch-list");
  if(sl){
    var S=window.SW_SCHOLARSHIPS||[],q=$("#sch-q"),cf=$("#sch-country"),lf=$("#sch-level"),ff=$("#sch-fund"),sv=$("#sch-saved"),saved=store.get("saved",[]);
    var countries=S.map(function(s){return s.c}).filter(function(v,i,a){return a.indexOf(v)===i}).sort();
    cf.innerHTML='<option value="">All destinations</option>'+countries.map(function(c){return "<option>"+esc(c)+"</option>"}).join("");
    var pre=new URLSearchParams(location.search).get("q");if(pre)q.value=pre;
    function render(){
      var t=(q.value||"").toLowerCase(),out=S.filter(function(s){
        return (!t||(s.n+" "+s.c+" "+s.who).toLowerCase().indexOf(t)>-1)&&(!cf.value||s.c===cf.value)&&(!lf.value||s.l.indexOf(lf.value)>-1)&&(!ff.value||s.f===ff.value)&&(!sv.checked||saved.indexOf(s.n)>-1)});
      $("#sch-count").textContent=out.length+" of "+S.length+" scholarships";
      sl.innerHTML=out.length?out.map(function(s){var on=saved.indexOf(s.n)>-1;return '<article class="card item"><div class="top"><h3>'+esc(s.n)+'</h3><button class="save-btn" type="button" aria-pressed="'+on+'" data-save="'+esc(s.n)+'" title="Save to shortlist">'+(on?"★":"☆")+'</button></div><div class="meta">📍 '+esc(s.c)+'</div><div>'+s.l.map(function(l){return '<span class="tag brand">'+esc(l)+"</span>"}).join("")+'<span class="tag '+(s.f==="Full"?"teal":"amber")+'">'+s.f+' funding</span></div><p class="small" style="margin:0">'+esc(s.who)+'</p><a class="card-link" href="'+s.u+'" target="_blank" rel="noopener nofollow">Official website & deadlines ↗</a></article>'}).join(""):'<div class="empty card">No matches. Try clearing filters.</div>';
    }
    sl.addEventListener("click",function(e){var b=e.target.closest("[data-save]");if(!b)return;var n=b.getAttribute("data-save"),i=saved.indexOf(n);if(i>-1)saved.splice(i,1);else saved.push(n);store.set("saved",saved);render()});
    [q,cf,lf,ff,sv].forEach(function(el){el.addEventListener("input",render);el.addEventListener("change",render)});
    render();
  }

  /* ---------- videos (lite embed) ---------- */
  $$("[data-videos]").forEach(function(box){
    var V=(C.videos||[]).slice(0,+box.getAttribute("data-videos")||99),slots=+box.getAttribute("data-min")||0,html="";
    V.forEach(function(v){html+='<div class="card" style="padding:14px"><button class="video" type="button" data-yt="'+esc(v.id)+'" aria-label="Play: '+esc(v.title)+'"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/'+esc(v.id)+'/hqdefault.jpg"><span class="play"><i></i></span></button><h3 style="margin:12px 0 4px;font-size:1rem">'+esc(v.title)+'</h3><p class="small" style="margin:0">'+esc(v.source||"")+(v.cat?' · <span class="tag">'+esc(v.cat)+"</span>":"")+'</p></div>'});
    for(var i=V.length;i<slots;i++)html+='<div class="card" style="padding:14px"><div class="video placeholder"><div><b>Video coming soon</b><br><span class="small">Creators: <a style="color:#fde68a" href="careers.html">pitch a video</a></span></div></div><h3 style="margin:12px 0 4px;font-size:1rem">StudyWork original series</h3><p class="small" style="margin:0">Subscribe to be notified</p></div>';
    box.innerHTML=html;
  });
  document.addEventListener("click",function(e){var b=e.target.closest("[data-yt]");if(!b)return;b.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(b.getAttribute("data-yt"))+'?autoplay=1&rel=0" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';track("video_play")});
  $$("[data-yt-channel]").forEach(function(a){if(C.youtubeChannel)a.href=C.youtubeChannel;else a.setAttribute("href","videos.html#subscribe")});

  /* ---------- site search ---------- */
  var IDX=window.SW_INDEX||[];
  $$("[data-search]").forEach(function(form){
    var inp=form.querySelector("input"),res=document.getElementById(form.getAttribute("data-search"));
    function run(){var t=inp.value.trim().toLowerCase();if(!res)return;if(t.length<2){res.innerHTML="";return}
      var words=t.split(/\s+/),hits=IDX.map(function(p){var h=(p.t+" "+p.d+" "+p.k).toLowerCase(),s=0;words.forEach(function(w){if(h.indexOf(w)>-1)s+=p.t.toLowerCase().indexOf(w)>-1?3:1});return {p:p,s:s}}).filter(function(x){return x.s>0}).sort(function(a,b){return b.s-a.s}).slice(0,6);
      res.innerHTML=hits.length?hits.map(function(x){return '<a href="'+x.p.u+'"><b>'+esc(x.p.t)+'</b><br><span class="small muted">'+esc(x.p.d)+"</span></a>"}).join(""):'<p class="small muted">No pages found. Try “scholarship”, “Canada”, “part-time jobs”.</p>'}
    inp.addEventListener("input",run);form.addEventListener("submit",function(e){e.preventDefault();run();var a=res&&res.querySelector("a");if(a)location.href=a.getAttribute("href")});
  });
  $$(".chip[data-fill]").forEach(function(c){c.addEventListener("click",function(){var i=$(c.getAttribute("data-target"));if(i){i.value=c.getAttribute("data-fill");i.dispatchEvent(new Event("input"))}})});

  /* ---------- donations ---------- */
  var D=C.donate||{};
  $$("[data-donate]").forEach(function(a){var u=D[a.getAttribute("data-donate")];if(u){a.href=u;a.target="_blank";a.rel="noopener"}else a.style.display="none"});
  var anyDonate=Object.keys(D).some(function(k){return D[k]});
  $$("[data-if-no-donate]").forEach(function(el){el.style.display=anyDonate?"none":""});
  $$(".amounts").forEach(function(g){var input=document.getElementById(g.getAttribute("data-for"));$$("button",g).forEach(function(b){b.addEventListener("click",function(){$$("button",g).forEach(function(x){x.classList.remove("active")});b.classList.add("active");if(input)input.value=b.getAttribute("data-amt")})})});

  /* ---------- countdown ---------- */
  $$("[data-countdown]").forEach(function(el){
    var end=new Date(el.getAttribute("data-countdown")).getTime();
    function tick(){var d=Math.max(0,end-Date.now()),u=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60];
      el.innerHTML=["Days","Hours","Mins","Secs"].map(function(l,i){return "<div><b>"+String(u[i]).padStart(2,"0")+"</b><span>"+l+"</span></div>"}).join("")}
    tick();setInterval(tick,1000);
  });

  /* ---------- social links ---------- */
  $$("[data-social]").forEach(function(a){var u=(C.social||{})[a.getAttribute("data-social")];if(u)a.href=u;else a.parentNode.style.display="none"});
})();
