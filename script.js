/* ═══════════════════════════════════════════
   MAKEYOURWEB.XYZ — PREMIUM ENGINE v3
═══════════════════════════════════════════ */

const DEMOS_KEY = 'myw_demos';

// ── UTILS ──
const h2r = (h) => {
  let r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  return r ? `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}` : null;
};

/* ── LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('out');
      initAnimations();
    }, 1800);
  }
});

/* ── SCROLL PROGRESS ── */
window.addEventListener('scroll', () => {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  bar.style.width = scrolled + "%";
}, { passive: true });

/* ── CUSTOM CURSOR ── */
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  if(!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  const animate = () => {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animate);
  };
  animate();

  document.querySelectorAll('a, button, .df-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(2.5)';
      ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
      dot.style.background = 'var(--acc2)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(1)';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      dot.style.background = 'var(--acc)';
    });
  });
})();

/* ── NAVIGATION ── */
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const mobNav = document.getElementById('mobNav');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

if (burger && mobNav) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('on');
    mobNav.classList.toggle('on');
  });
  mobNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('on');
      mobNav.classList.remove('on');
    });
  });
}

/* ── HERO CANVAS ── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];
  const COLORS = ['#7c3aed', '#f43f5e', '#10b981', '#fbbf24'];

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  };

  const mkPt = () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
    a: Math.random() * .4 + .1,
    c: COLORS[Math.floor(Math.random() * COLORS.length)]
  });

  const init = () => { resize(); pts = Array.from({ length: 80 }, mkPt); };
  init(); window.addEventListener('resize', resize);

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
})();

/* ── GSAP ANIMATIONS ── */
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Fade Up reveals
  gsap.utils.toArray('.fade-up').forEach((el) => {
    gsap.from(el, {
      y: 60, opacity: 0, duration: 1, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    });
  });

  // Hero staggered reveal
  const heroTl = gsap.timeline();
  heroTl.from('.hero-pill', { y: 20, opacity: 0, duration: .8, ease: 'back.out' }, '+=0.2')
        .from('.hero-h1', { y: 30, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.4')
        .from('.hero-p', { y: 20, opacity: 0, duration: .8 }, '-=0.6')
        .from('.hero-actions', { y: 20, opacity: 0, duration: .8 }, '-=0.6')
        .from('.hstat', { scale: 0.8, opacity: 0, duration: .6, stagger: 0.1 }, '-=0.4');

  // Stats Counter
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    ScrollTrigger.create({
      trigger: el, start: 'top 90%',
      onEnter: () => {
        let curr = 0;
        const itv = setInterval(() => {
          curr += Math.ceil(target / 40);
          if (curr >= target) { el.textContent = target; clearInterval(itv); }
          else { el.textContent = curr; }
        }, 30);
      }
    });
  });
}

/* ── DYNAMIC DEMOS ── */
const createDemoCard = (d, i) => {
  const hex = d.color || '#7c3aed';
  const rgb = h2r(hex);
  const a1 = rgb ? `rgba(${rgb},.1)` : 'rgba(124,58,237,.1)';
  const a2 = rgb ? `rgba(${rgb},.2)` : 'rgba(124,58,237,.2)';
  const a3 = rgb ? `rgba(${rgb},.3)` : 'rgba(124,58,237,.3)';
  const link = d.externalUrl || (d.slug ? (d.slug.startsWith('demos/') ? d.slug : 'demos/' + d.slug) + '/index.html' : '#');

  const card = document.createElement('div');
  card.className = 'demo-card fade-up tilt-parent';
  card.setAttribute('data-cat', d.category || '');
  card.innerHTML = `
    <a href="${link}" target="_blank" class="demo-preview" style="--bg1:#03050c;--bg2:#080b1d;--ac:${hex}">
      <div class="dp-browser">
        <div class="dp-bar"><span></span><span></span><span></span></div>
        <div class="dp-screen tilt-child">
          <div class="dp-nav" style="background:${a1};border-color:${a2}">
            <div class="dp-logo" style="color:${hex}">${(d.title || '').toUpperCase().substring(0, 14)}</div>
            <div class="dp-nav-links"><div></div><div></div><div></div></div>
          </div>
          <div class="dp-hero" style="background:linear-gradient(135deg,#03050c,#080b1d)">
            <div class="dp-hero-text">
              <div class="dp-h-sub" style="color:${hex}">${(d.category || '').toUpperCase()}</div>
              <div class="dp-h-title" style="color:#f8fafc">${d.title || 'Portfolio Project'}</div>
              <div class="dp-h-btn" style="background:${hex};color:#fff">View Project</div>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-hover-cta">Explore Live Site <i class="fa fa-external-link-alt"></i></div>
    </a>
    <div class="demo-info">
      <div class="di-row">
        <span class="di-tag" style="--tc:${hex};--tb:${a1}">${d.category || 'Premium'}</span>
        <span class="di-live">● Live Now</span>
      </div>
      <h4>${d.title || ''}</h4>
      <p>${d.desc || 'A premium website experience by Make Your Web.'}</p>
      <a href="${link}" target="_blank" class="di-link">Visit Website <i class="fa fa-arrow-right"></i></a>
    </div>
  `;
  return card;
};

async function fetchDemos() {
  const grid = document.getElementById('demoGrid');
  if (!grid) return;

  try {
    const res = await fetch('demos.json');
    const data = await res.json();
    if (Array.isArray(data) && data.length) {
      grid.innerHTML = '';
      data.filter(d => d.status === 'live').forEach((d, i) => {
        grid.appendChild(createDemoCard(d, i));
      });
      // Initialize Tilt
      if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.demo-card'), { max: 8, speed: 400, glare: true, 'max-glare': 0.1 });
      }
    }
  } catch (err) {
    // Fallback to localStorage if available
    const saved = localStorage.getItem(DEMOS_KEY);
    if(saved) {
      grid.innerHTML = '';
      JSON.parse(saved).filter(d => d.status === 'live').forEach((d, i) => {
        grid.appendChild(createDemoCard(d, i));
      });
    }
  }
}
fetchDemos();

/* ── FILTERS ── */
document.querySelectorAll('.df-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.df-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.demo-card').forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.style.display = show ? '' : 'none';
      if(show) gsap.from(card, { scale: 0.9, opacity: 0, duration: 0.4 });
    });
  });
});

/* ── FAQ ── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ── FORMS ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    
    setTimeout(() => {
      contactForm.style.display = 'none';
      document.getElementById('cfSuccess').style.display = 'block';
    }, 1500);
  });
}

/* ── OFFER TIMER ── */
(function() {
  const h = document.getElementById('tH'), m = document.getElementById('tM'), s = document.getElementById('tS');
  if(!h) return;
  let time = 86400; // 24 hours
  setInterval(() => {
    time--;
    if(time < 0) time = 86400;
    const hours = Math.floor(time / 3600);
    const mins  = Math.floor((time % 3600) / 60);
    const secs  = time % 60;
    h.textContent = String(hours).padStart(2, '0');
    m.textContent = String(mins).padStart(2, '0');
    s.textContent = String(secs).padStart(2, '0');
  }, 1000);
})();
