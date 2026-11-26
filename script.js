"use strict";
const inventory=[{item:"Laptop",category:"IT Equipment",status:"In Stock",quantity:12,value:8400},{item:"Monitor",category:"IT Equipment",status:"Low Stock",quantity:3,value:900},{item:"Office Chair",category:"Furniture",status:"In Stock",quantity:8,value:1200},{item:"Printer",category:"IT Equipment",status:"Out of Stock",quantity:0,value:0},{item:"USB-C Cable",category:"Accessories",status:"In Stock",quantity:25,value:375},{item:"Wireless Mouse",category:"Accessories",status:"Low Stock",quantity:4,value:180},{item:"Standing Desk",category:"Furniture",status:"In Stock",quantity:5,value:2250},{item:"Keyboard",category:"Accessories",status:"Out of Stock",quantity:0,value:0}];
const menu=document.querySelector(".menu"),nav=document.querySelector("#navlinks");menu.addEventListener("click",()=>{const open=menu.getAttribute("aria-expanded")==="true";menu.setAttribute("aria-expanded",String(!open));nav.classList.toggle("open",!open)});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}));
const search=document.querySelector("#inventory-search"),cat=document.querySelector("#category-filter"),stat=document.querySelector("#status-filter"),body=document.querySelector("#inventory-body"),empty=document.querySelector("#empty"),money=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});function statusClass(v){return v==="In Stock"?"in":v==="Low Stock"?"low":"out"}function render(){const q=search.value.toLowerCase().trim(),rows=inventory.filter(r=>(r.item.toLowerCase().includes(q)||r.category.toLowerCase().includes(q))&&(cat.value==="all"||r.category===cat.value)&&(stat.value==="all"||r.status===stat.value));body.innerHTML=rows.map(r=>`<tr><td>${r.item}</td><td>${r.category}</td><td><span class="status ${statusClass(r.status)}">${r.status}</span></td><td>${r.quantity}</td><td>${money.format(r.value)}</td></tr>`).join("");empty.hidden=rows.length>0}[search,cat,stat].forEach(x=>x.addEventListener("input",render));render();
const form=document.querySelector("#project-form"),feedback=document.querySelector("#feedback"),message=form.elements.message,count=document.querySelector("#count");message.addEventListener("input",()=>count.textContent=message.value.length);function validate(field){const e=field.closest("label")?.querySelector(".error"),ok=field.checkValidity();field.classList.toggle("invalid",!ok);field.setAttribute("aria-invalid",String(!ok));if(e)e.textContent=ok?"":field.validity.valueMissing?"This field is required.":field.validity.typeMismatch?"Enter a valid email address.":`Enter at least ${field.minLength} characters.`;return ok}form.querySelectorAll("input:not([type=hidden]):not([type=checkbox]),select,textarea").forEach(f=>f.addEventListener("blur",()=>validate(f)));
form.addEventListener("submit",async e=>{e.preventDefault();const fields=[...form.querySelectorAll("input:not([type=hidden]):not([type=checkbox]),select,textarea")],ok=fields.map(validate).every(Boolean),consent=form.elements.consent,button=form.querySelector("button");if(!ok||!consent.checked){feedback.className="feedback fail";feedback.textContent=consent.checked?"Please correct the highlighted fields.":"Please confirm that your information may be used to respond to this enquiry.";form.querySelector(":invalid")?.focus();return}button.disabled=true;button.textContent="Sending…";feedback.className="feedback";feedback.textContent="";try{const response=await fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(new FormData(form)).toString()});if(!response.ok)throw new Error();feedback.className="feedback success";feedback.textContent="Thank you for your enquiry. Your message has been submitted to Nexora Solutions. We’ll reply using the email address you provided.";form.reset();count.textContent="0"}catch{feedback.className="feedback fail";feedback.innerHTML='The enquiry could not be submitted. Please try again or email <a href="mailto:nexora-solutions2026@outlook.ph">nexora-solutions2026@outlook.ph</a>.'}finally{button.disabled=false;button.textContent="Send Enquiry →"}});
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(e=>observer.observe(e));const sections=[...document.querySelectorAll("main section[id]")],links=[...nav.querySelectorAll("a")];new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle("active",a.hash===`#${e.target.id}`))}),{rootMargin:"-35% 0px -55%"}).observe?.(sections[0]);sections.slice(1).forEach(s=>new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle("active",a.hash===`#${e.target.id}`))}),{rootMargin:"-35% 0px -55%"}).observe(s));document.querySelector("#year").textContent=new Date().getFullYear();




// Light-glass hero motion: subtle pointer depth and scroll-linked lift, disabled for reduced motion.
const motionOK=!window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroGlass=document.querySelector("#hero-glass"),heroRoot=document.querySelector(".hero");
if(motionOK&&heroGlass&&window.matchMedia("(hover:hover) and (pointer:fine)").matches){
  const stage=heroGlass.closest(".hero-art");
  stage.addEventListener("pointermove",e=>{
    const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    heroGlass.style.animationPlayState="paused";
    heroGlass.style.transform=`translateY(-4px) rotateX(${-y*5}deg) rotateY(${x*7}deg)`;
  });
  stage.addEventListener("pointerleave",()=>{heroGlass.style.animationPlayState="running";heroGlass.style.transform=""});
}
if(motionOK&&heroGlass&&heroRoot){
  let queued=false;
  const updateHeroMotion=()=>{
    const rect=heroRoot.getBoundingClientRect(),range=Math.max(1,heroRoot.offsetHeight-window.innerHeight),p=Math.min(1,Math.max(0,-rect.top/range));
    heroGlass.style.setProperty("--scroll-progress",p.toFixed(3));
    if(!window.matchMedia("(hover:hover) and (pointer:fine)").matches)heroGlass.style.transform=`translateY(${p*-20}px) scale(${1+p*.035})`;
    queued=false;
  };
  window.addEventListener("scroll",()=>{if(!queued){requestAnimationFrame(updateHeroMotion);queued=true}},{passive:true});
}


// Accessible product preview tabs (click, arrow keys, Home and End).
const previewTabs=[...document.querySelectorAll(".showcase-tab")];
const previewPanels=[...document.querySelectorAll(".preview-panel")];
function activatePreviewTab(tab,moveFocus=false){
  previewTabs.forEach(item=>{const active=item===tab;item.classList.toggle("active",active);item.setAttribute("aria-selected",String(active));item.tabIndex=active?0:-1});
  previewPanels.forEach(panel=>{panel.hidden=panel.id!==tab.getAttribute("aria-controls")});
  if(moveFocus)tab.focus();
}
previewTabs.forEach((tab,index)=>{
  tab.addEventListener("click",()=>activatePreviewTab(tab));
  tab.addEventListener("keydown",event=>{
    let next=index;
    if(event.key==="ArrowRight")next=(index+1)%previewTabs.length;
    else if(event.key==="ArrowLeft")next=(index-1+previewTabs.length)%previewTabs.length;
    else if(event.key==="Home")next=0;
    else if(event.key==="End")next=previewTabs.length-1;
    else return;
    event.preventDefault();activatePreviewTab(previewTabs[next],true);
  });
});


// Full-page motion pass: stagger section details when they enter view.
(()=>{
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const groups=[...document.querySelectorAll(".service-grid,.pairs,.steps,.summary,.showcase-ui,.about-grid,.contact-grid")];
  groups.forEach(group=>[...group.children].forEach((child,index)=>child.style.setProperty("--motion-delay",(Math.min(index,5)*95)+"ms")));
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add("motion-stagger");
    [...entry.target.children].forEach(child=>{child.style.transitionDelay=child.style.getPropertyValue("--motion-delay")||"0ms";child.classList.add("motion-in")});
    observer.unobserve(entry.target);
  }),{threshold:.16,rootMargin:"0px 0px -5% 0px"});
  groups.forEach(group=>observer.observe(group));
  if(window.matchMedia("(hover:hover) and (pointer:fine)").matches){
    document.querySelectorAll(".service").forEach(card=>{
      card.addEventListener("pointermove",event=>{
        const r=card.getBoundingClientRect(),x=(event.clientX-r.left)/r.width-.5,y=(event.clientY-r.top)/r.height-.5;
        card.style.transform="translateY(-7px) rotateX("+(-y*2.8)+"deg) rotateY("+(x*3.2)+"deg)";
      });
      card.addEventListener("pointerleave",()=>{card.style.transform=""});
    });
  }
})();
