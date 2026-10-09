/* ===== CONFIGURACIÓN ===== */
const VIDEO_SRC="";        // ej. "video/miramar.mp4"
const VIDEO_EMBED="";      // ej. "https://www.youtube.com/embed/XXXX"
const FORM_ENDPOINT="";    // URL que reciba el POST JSON (ej. Flask /api/lead)
const WHATSAPP="";         // ej. "5218991234567"
/* ========================= */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
addEventListener('load',()=>setTimeout(()=>$('#pre').classList.add('off'),900));
setTimeout(()=>$('#pre').classList.add('off'),2500);
$('#stars').innerHTML=Array.from({length:40},()=>`<span style="left:${Math.random()*100}%;top:${Math.random()*55}%;animation-delay:${Math.random()*3}s"></span>`).join('');
if(WHATSAPP){$('#wa').href=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, me interesa Miramar Punta Sur')}`;$('#wa').classList.add('show')}
const nav=$('#nav'),sun=$('#sun'),bar=$('#bar');let tick=false;
addEventListener('scroll',()=>{if(tick)return;tick=true;requestAnimationFrame(()=>{
 const y=scrollY;nav.classList.toggle('solid',y>60);sun.style.transform=`translateY(${y*.25}px) scale(${1+y/2500})`;
 const c=$('#contacto').getBoundingClientRect();bar.classList.toggle('on',y>innerHeight*.8&&c.top>innerHeight*.6);tick=false})},{passive:true});
const play=()=>{const box=$('#video');
 if(VIDEO_SRC)box.innerHTML=`<video src="${VIDEO_SRC}" controls autoplay playsinline></video>`;
 else if(VIDEO_EMBED)box.innerHTML=`<iframe src="${VIDEO_EMBED}?autoplay=1" allow="autoplay;fullscreen" allowfullscreen></iframe>`};
$('#ph').addEventListener('click',play);$('#ph').addEventListener('keydown',e=>{if(e.key==='Enter')play()});
$$('.tab').forEach(t=>t.onclick=()=>{$$('.tab').forEach(x=>x.classList.toggle('on',x===t));$('#m-v').classList.toggle('on',t.dataset.t==='v');$('#m-a').classList.toggle('on',t.dataset.t==='a')});
[['pago','pago_otro'],['proyecto','proyecto_otro']].forEach(([s,o])=>$('#'+s).addEventListener('change',e=>{const on=e.target.value==='otro';$('#'+o).classList.toggle('show',on);if(on)$('#'+o).focus()}));
/* lightbox */
const imgs=$$('.gal img,.g img,.mos img,.plan img');let ci=0;const lb=$('#lb'),li=lb.querySelector('img');
const show=i=>{ci=(i+imgs.length)%imgs.length;li.src=imgs[ci].src;lb.classList.add('on')};
imgs.forEach((im,i)=>im.addEventListener('click',()=>show(i)));
lb.querySelector('.x').onclick=()=>lb.classList.remove('on');lb.querySelector('.p').onclick=e=>{e.stopPropagation();show(ci-1)};lb.querySelector('.n').onclick=e=>{e.stopPropagation();show(ci+1)};
lb.onclick=e=>{if(e.target===lb)lb.classList.remove('on')};
addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='Escape')lb.classList.remove('on');if(e.key==='ArrowRight')show(ci+1);if(e.key==='ArrowLeft')show(ci-1)});
/* reveal + counters */
const count=el=>{const n=+el.dataset.n,d=+(el.dataset.d||0),t0=performance.now();const f=t=>{const p=Math.min((t-t0)/1400,1),v=n*(1-Math.pow(1-p,3));el.textContent=v.toFixed(d);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('[data-n]').forEach(count);io.unobserve(e.target)}}),{threshold:.15});
$$('.reveal').forEach(el=>io.observe(el));
/* form */
$('#form').addEventListener('submit',async e=>{
 e.preventDefault();const f=e.target;if(f.web.value)return;
 const need=[f.nombre,f.pago,f.ciudad,f.proyecto];if(f.pago.value==='otro')need.push($('#pago_otro'));if(f.proyecto.value==='otro')need.push($('#proyecto_otro'));
 need.forEach(x=>x.classList.remove('err'));const bad=need.filter(x=>!x.value.trim());
 if(bad.length){bad.forEach(x=>x.classList.add('err'));bad[0].focus();return}
 const u=new URLSearchParams(location.search);
 const d={nombre:f.nombre.value.trim(),forma_pago:f.pago.value==='otro'?$('#pago_otro').value.trim():f.pago.value,ciudad:f.ciudad.value.trim(),
  proyecto_compra:f.proyecto.value==='otro'?$('#proyecto_otro').value.trim():f.proyecto.value,utm_source:u.get('utm_source'),utm_campaign:u.get('utm_campaign'),fecha:new Date().toISOString()};
 const b=$('#sub');b.disabled=true;b.textContent='Enviando…';
 try{
  if(FORM_ENDPOINT){const r=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});if(!r.ok)throw 0}
  else if(WHATSAPP){window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola, quiero iniciar la compraventa en Miramar Punta Sur.\nNombre: ${d.nombre}\nForma de pago: ${d.forma_pago}\nCiudad: ${d.ciudad}\nProyecto: ${d.proyecto_compra}`)}`,'_blank')}
  f.style.display='none';$('#ok').style.display='block';
 }catch(err){b.disabled=false;b.textContent='Reintentar';}
});