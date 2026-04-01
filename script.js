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
  const COLORS = ['#6c63ff', '#ff6584', '#43e97b', '#f5c842'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
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
          ctx.strokeStyle = '#6c63ff';
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
