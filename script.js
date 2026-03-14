/* ============================================
   MAKEYOURWEB.XYZ — PREMIUM SCRIPTS
   ============================================ */

// ---- PARTICLE CANVAS ----
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H, animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      color: ['#6c63ff', '#ff6584', '#43e97b'][Math.floor(Math.random() * 3)]
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 120 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });
    ctx.globalAlpha = 1;

    // Draw subtle connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#6c63ff';
          ctx.globalAlpha = (1 - dist / 120) * 0.12;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { cancelAnimationFrame(animId); init(); draw(); });
  init();
  draw();
})();


// ---- NAVBAR SCROLL ----
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();


// ---- HAMBURGER MENU ----
(function () {
  const btn   = document.getElementById('hamburger');
  const menu  = document.getElementById('mobileMenu');
  const links = menu.querySelectorAll('.mob-link, .mob-cta');

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
})();


// ---- SCROLL REVEAL ----
(function () {
  const els = document.querySelectorAll('.reveal-up');

  const delays = [0, 80, 160, 240, 320];

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = delays[parseInt(el.dataset.delay) || 0] || 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
})();


// ---- COUNTDOWN TIMER ----
(function () {
  const hEl = document.getElementById('timerH');
  const mEl = document.getElementById('timerM');
  const sEl = document.getElementById('timerS');
  if (!hEl) return;

  // Persist end time in localStorage so it doesn't reset on page refresh
  const key = 'myw_offer_end';
  let endTime = localStorage.getItem(key);

  if (!endTime) {
    endTime = Date.now() + 23 * 3600000 + 59 * 60000 + 59000;
    localStorage.setItem(key, endTime);
  } else {
    endTime = parseInt(endTime);
    if (endTime < Date.now()) {
      endTime = Date.now() + 23 * 3600000 + 59 * 60000 + 59000;
      localStorage.setItem(key, endTime);
    }
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = endTime - Date.now();
    if (diff <= 0) {
      hEl.textContent = '00';
      mEl.textContent = '00';
      sEl.textContent = '00';
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const newH = pad(h), newM = pad(m), newS = pad(s);

    if (hEl.textContent !== newH) { hEl.textContent = newH; pulse(hEl); }
    if (mEl.textContent !== newM) { mEl.textContent = newM; pulse(mEl); }
    if (sEl.textContent !== newS) { sEl.textContent = newS; pulse(sEl); }
  }

  function pulse(el) {
    el.style.transform = 'scale(1.15)';
    el.style.color = '#fff';
    setTimeout(() => {
      el.style.transform = 'scale(1)';
      el.style.color = '';
    }, 150);
  }

  tick();
  setInterval(tick, 1000);
})();


// ---- TESTIMONIAL SLIDER ----
(function () {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testiDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testi-card');
  const count = cards.length;
  let current = 0;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getCardWidth() {
    const card = cards[0];
    const style = getComputedStyle(track);
    const gap = parseFloat(style.gap) || 24;
    return card.offsetWidth + gap;
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, count - 1));
    track.style.transform = `translateX(-${current * getCardWidth()}px)`;
    updateDots();
  }

  // Auto-scroll
  let autoTimer = setInterval(() => {
    goTo((current + 1) % count);
  }, 4000);

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo((current + 1) % count), 4000);
  }

  // Drag to scroll
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    scrollLeft = current;
    track.style.transition = 'none';
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 60) {
      goTo(diff > 0 ? current - 1 : current + 1);
    } else {
      goTo(current);
    }
    resetAuto();
  });

  // Touch
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current - 1 : current + 1);
      resetAuto();
    }
  }, { passive: true });
})();


// ---- CONTACT FORM ----
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate async submit (replace with real endpoint if needed)
    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('show');

      // WhatsApp fallback redirect
      const name  = form.querySelector('input[type="text"]').value;
      const phone = form.querySelector('input[type="tel"]').value;
      const biz   = form.querySelector('select').value;
      const msg   = form.querySelector('textarea').value;
      const waText = encodeURIComponent(
        `Hi! I'm ${name} (${phone}). Business: ${biz}. Message: ${msg}`
      );
      // Open WhatsApp after short delay
      setTimeout(() => {
        window.open(`https://wa.me/918287034496?text=${waText}`, '_blank');
      }, 1500);
    }, 1000);
  });
})();


// ---- SMOOTH ACTIVE NAV LINKS ----
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === '#' + current) {
        a.style.color = '#fff';
      }
    });
  }, { passive: true });
})();


// ---- CURSOR GLOW (desktop only) ----
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(108,99,255,.08) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left .12s ease, top .12s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();


// ---- BUTTON RIPPLE ----
(function () {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px; top: ${y}px;
        width: 0; height: 0;
        border-radius: 50%;
        background: rgba(255,255,255,.25);
        transform: translate(-50%, -50%);
        animation: rippleAnim .6s ease-out forwards;
        pointer-events: none;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = `
      @keyframes rippleAnim {
        to { width: 200px; height: 200px; opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();


// ---- NUMBERS COUNTER ANIMATION ----
(function () {
  const stats = document.querySelectorAll('.stat strong');
  let done = false;

  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !done) {
      done = true;
      stats.forEach(el => {
        const text = el.textContent;
        const num  = parseFloat(text.replace(/[^0-9.]/g, ''));
        const prefix = text.match(/^[^0-9]*/)[0];
        const suffix = text.match(/[^0-9.]*$/)[0];
        if (!num) return;
        let start = 0;
        const duration = 1400;
        const step = 16;
        const steps = Math.ceil(duration / step);
        const inc = num / steps;
        const timer = setInterval(() => {
          start = Math.min(start + inc, num);
          el.textContent = prefix + (Number.isInteger(num) ? Math.round(start) : start.toFixed(1)) + suffix;
          if (start >= num) clearInterval(timer);
        }, step);
      });
    }
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) obs.observe(heroStats);
})();
