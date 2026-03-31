/* ═══════════════════════════════════════════
   MAKEYOURWEB.XYZ — SCRIPTS v2
═══════════════════════════════════════════ */

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('out');
  }, 2400);
});

/* ── CUSTOM CURSOR (desktop only) ── */
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) {
    document.getElementById('cur-dot').style.display = 'none';
    document.getElementById('cur-ring').style.display = 'none';
    return;
  }
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function animate() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(1.8)';
      ring.style.transform = 'translate(-50%,-50%) scale(1.4)';
      ring.style.opacity   = '.3';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(1)';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.opacity   = '.6';
    });
  });
})();

/* ── NAVBAR SCROLL ── */
(function () {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ── HAMBURGER ── */
(function () {
  const btn  = document.getElementById('burger');
  const menu = document.getElementById('mobNav');
  btn.addEventListener('click', () => {
    btn.classList.toggle('on');
    menu.classList.toggle('on');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('on');
      menu.classList.remove('on');
    });
  });
})();

/* ── HERO PARTICLE CANVAS ── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [], animId;
  const COLORS = ['#7c3aed', '#f43f5e', '#10b981', '#fbbf24'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  }

  function mkPt() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      a: Math.random() * .45 + .1,
      c: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  }

  function init() { resize(); pts = Array.from({ length: 110 }, mkPt); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.globalAlpha = (1 - d/110) * .1;
          ctx.strokeStyle = '#7c3aed';
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    // dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });
    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { cancelAnimationFrame(animId); init(); draw(); });
  init(); draw();
})();

/* ── SCROLL REVEAL ── */
(function () {
  const ELS = document.querySelectorAll('.fade-up');
  const delays = [0, 90, 180, 270, 360];

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const d = delays[parseInt(el.dataset.d) || 0] || 0;
      setTimeout(() => el.classList.add('in'), d);
      obs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  ELS.forEach(el => obs.observe(el));

  // Expose globally so dynamic demo cards injected after page load can use this observer
  window._mywObserver = obs;
})();

/* ── COUNTER ANIMATION ── */
(function () {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let val = 0;
      const step = Math.ceil(target / 60);
      const t = setInterval(() => {
        val = Math.min(val + step, target);
        el.textContent = val + '+';
        if (val >= target) {
          el.textContent = target + '+';
          clearInterval(t);
        }
      }, 25);
    });
  }, { threshold: .5 });

  nums.forEach(el => obs.observe(el));
})();

/* ── COUNTDOWN TIMER ── */
(function () {
  const hEl = document.getElementById('tH');
  const mEl = document.getElementById('tM');
  const sEl = document.getElementById('tS');
  if (!hEl) return;

  const KEY = 'myw_end_v2';
  let end = parseInt(localStorage.getItem(KEY) || '0');
  if (!end || end < Date.now()) {
    end = Date.now() + 23*3600000 + 59*60000 + 59000;
    localStorage.setItem(KEY, end);
  }

  function pad(n) { return String(n).padStart(2,'0'); }
  function pulse(el) {
    el.style.transform = 'scale(1.2)';
    el.style.color = '#fff';
    setTimeout(() => { el.style.transform = ''; el.style.color = ''; }, 180);
  }
  let ph = '', pm = '', ps = '';

  setInterval(() => {
    const diff = Math.max(0, end - Date.now());
    const h = pad(Math.floor(diff/3600000));
    const m = pad(Math.floor(diff%3600000/60000));
    const s = pad(Math.floor(diff%60000/1000));
    if (h!==ph){hEl.textContent=h;pulse(hEl);ph=h;}
    if (m!==pm){mEl.textContent=m;pulse(mEl);pm=m;}
    if (s!==ps){sEl.textContent=s;pulse(sEl);ps=s;}
  }, 1000);
})();

/* ── TESTIMONIAL SLIDER ── */
(function () {
  const track  = document.getElementById('testiTrack');
  const dotsEl = document.getElementById('testiDots');
  if (!track) return;
  const cards = track.querySelectorAll('.testi-card');
  const N = cards.length;
  let cur = 0, auto, startX = 0;

  cards.forEach((_,i) => {
    const d = document.createElement('div');
    d.className = 'testi-dot' + (i===0?' on':'');
    d.onclick = () => { goTo(i); resetAuto(); };
    dotsEl.appendChild(d);
  });

  function cardW() {
    return cards[0].offsetWidth + parseFloat(getComputedStyle(track).gap);
  }
  function goTo(i) {
    cur = Math.max(0, Math.min(i, N-1));
    track.style.transform = `translateX(-${cur * cardW()}px)`;
    dotsEl.querySelectorAll('.testi-dot').forEach((d,j) => d.classList.toggle('on',j===cur));
  }
  function resetAuto() {
    clearInterval(auto);
    auto = setInterval(() => goTo((cur+1)%N), 4200);
  }
  resetAuto();

  // drag
  track.addEventListener('mousedown', e => { startX = e.clientX; track.style.transition='none'; });
  window.addEventListener('mouseup', e => {
    track.style.transition = '';
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 60) goTo(diff > 0 ? cur-1 : cur+1);
    else goTo(cur);
    resetAuto();
  });
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive:true });
  track.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) { goTo(diff>0?cur-1:cur+1); resetAuto(); }
  }, { passive:true });
})();

/* ── CONTACT FORM ── */
(function () {
  const form = document.getElementById('contactForm');
  const suc  = document.getElementById('cfSuccess');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Sending…'; btn.disabled = true;
    setTimeout(() => {
      form.style.display = 'none';
      suc.classList.add('show');
      const n  = form.querySelector('input[type=text]').value;
      const ph = form.querySelector('input[type=tel]').value;
      const bz = form.querySelector('select').value;
      const ms = form.querySelector('textarea').value;
      const wa = encodeURIComponent(`Hi! I'm ${n} (${ph}). Business: ${bz}. Message: ${ms}`);
      setTimeout(() => window.open(`https://wa.me/918287034496?text=${wa}`, '_blank'), 1500);
    }, 900);
  });
})();

/* ── WHATSAPP FLOAT TOOLTIP ── */
(function () {
  const btn = document.getElementById('waFloat');
  const tip = document.getElementById('waTooltip');
  if (!btn||!tip) return;
  setTimeout(() => { tip.classList.add('show'); }, 3500);
  setTimeout(() => { tip.classList.remove('show'); }, 7000);
  btn.addEventListener('mouseenter', () => tip.classList.add('show'));
  btn.addEventListener('mouseleave', () => tip.classList.remove('show'));
})();

/* ── BUTTON RIPPLE ── */
(function () {
  const style = document.createElement('style');
  style.textContent = '@keyframes rippleOut{to{width:200px;height:200px;opacity:0;}}';
  document.head.appendChild(style);

  document.querySelectorAll('.btn-primary,.btn-ghost,.btn-wa').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect();
      const s = document.createElement('span');
      s.style.cssText = `
        position:absolute;left:${e.clientX-r.left}px;top:${e.clientY-r.top}px;
        width:0;height:0;border-radius:50%;
        background:rgba(255,255,255,.22);
        transform:translate(-50%,-50%);
        animation:rippleOut .6s ease-out forwards;
        pointer-events:none;
      `;
      btn.appendChild(s);
      setTimeout(() => s.remove(), 650);
    });
  });
})();

/* ── ACTIVE NAV HIGHLIGHT ── */
(function () {
  const secs = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 250) cur = s.id; });
    links.forEach(a => {
      const active = a.getAttribute('href') === '#'+cur;
      a.style.color = active ? '#fff' : '';
    });
  }, { passive:true });
})();

/* ── CURSOR GLOW TRAIL (desktop only) ── */
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position:'fixed',pointerEvents:'none',zIndex:'9990',
    width:'350px',height:'350px',borderRadius:'50%',
    background:'radial-gradient(circle,rgba(108,99,255,.06) 0%,transparent 70%)',
    transform:'translate(-50%,-50%)',
    transition:'left .15s ease,top .15s ease',
    willChange:'left,top'
  });
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive:true });
})();

/* ── DYNAMIC DEMO ENGINE (GLOBAL) ── */
window._myw_loadDemos = async function (containerId, limit = 0) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  function h2r(h) {
    let r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return r ? `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}` : "124,58,237";
  }

  const FALLBACK_DEMOS = [
    { id:'f-hotel', title:'LUMIÈRE Luxury Hotel', slug:'demos/hotel', category:'Hotel & Resort', color:'#C9A84C', desc:'Elegant rooms, gold aesthetic, fine dining showcase.', status:'live' },
    { id:'f-gym', title:'IRONVAULT Gym', slug:'demos/gym', category:'Gym & Fitness', color:'#e8ff00', desc:'Dark neon-yellow hardcore aesthetic. Membership plans.', status:'live' },
    { id:'f-rest', title:'EMBER & ASH Restaurant', slug:'demos/restaurant', category:'Restaurant & Café', color:'#c0622a', desc:'Warm dark fine-dining theme. Full menu & reservation.', status:'live' },
    { id:'f-clin', title:'SERENOVA Health', slug:'demos/clinic', category:'Clinic & Hospital', color:'#0891b2', desc:'Clean teal-white medical design. Appointment booking.', status:'live' }
  ];

  function createCard(d) {
    const hex = d.color || '#7c3aed';
    const rgb = h2r(hex);
    const a1 = rgb ? `rgba(${rgb},.1)` : 'rgba(124,58,237,.1)';
    const link = d.externalUrl || (d.slug ? (d.slug.startsWith('demos/') ? d.slug : 'demos/' + d.slug) + '/index.html' : '#');
    
    const card = document.createElement('div');
    card.className = 'demo-card fade-up';
    card.innerHTML = `
      <a href="${link}" target="_blank" class="demo-preview">
        <div class="dp-browser">
          <div class="dp-bar"><span></span><span></span><span></span></div>
          <div class="dp-screen" style="background:#03050c">
            <div class="dp-placeholder" style="color:${hex};">
              <i class="fas fa-desktop" style="font-size:2rem;margin-bottom:1rem;display:block;"></i>
              <span style="font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;">${d.title}</span>
            </div>
          </div>
        </div>
        <div class="demo-hover-cta">Open Live Demo <i class="fa fa-external-link-alt"></i></div>
      </a>
      <div class="demo-info">
        <div class="di-row">
          <span class="di-tag" style="--tc:${hex};--tb:${a1}">${d.category || 'Business'}</span>
        </div>
        <h4>${d.title}</h4>
        <p>${d.desc || 'A premium business website demo.'}</p>
        <a href="${link}" target="_blank" class="di-link">View Demo <i class="fa fa-arrow-right"></i></a>
      </div>
    `;
    return card;
  }

  try {
    const res = await fetch('demos.json');
    if (!res.ok) throw new Error('Fetch failed');
    const responseData = await res.json();
    if (Array.isArray(responseData)) {
      container.innerHTML = '';
      let data = responseData.filter(d => d.status === 'live');
      if (limit > 0) data = data.slice(0, limit);
      data.forEach(d => container.appendChild(createCard(d)));
    } else { throw new Error('Invalid format'); }
  } catch (e) {
    console.warn('Portfolio fetch error, trying local cache...', e);
    const s = localStorage.getItem('myw_demos');
    if (s) {
      container.innerHTML = '';
      let data = JSON.parse(s).filter(d => d.status === 'live');
      if (limit > 0) data = data.slice(0, limit);
      data.forEach(d => container.appendChild(createCard(d)));
    } else {
      console.warn('Local cache empty, using built-in fallback.');
      container.innerHTML = '';
      let data = FALLBACK_DEMOS;
      if (limit > 0) data = data.slice(0, limit);
      data.forEach(d => container.appendChild(createCard(d)));
    }
  }
};

/* ── DOM READY TRIGGER ── */
document.addEventListener('DOMContentLoaded', () => {
  // Auto-load demos if we're on the home page
  if (document.getElementById('demoGrid')) {
    window._myw_loadDemos('demoGrid', 6);
  }
});
