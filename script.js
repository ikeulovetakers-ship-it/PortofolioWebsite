/* ═══════════════════════════════════════════
   LOADER
═══════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1600);
});

/* ═══════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════ */
const dot  = document.createElement('div');
const ring = document.createElement('div');
dot.className  = 'cursor-dot';
ring.className = 'cursor-ring';
document.body.appendChild(dot);
document.body.appendChild(ring);

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

(function animateCursor() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, .about-card, .skill-card, .hobby-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width  = '56px';
    ring.style.height = '56px';
    ring.style.borderColor = 'rgba(231,76,60,1)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width  = '36px';
    ring.style.height = '36px';
    ring.style.borderColor = 'rgba(231,76,60,0.6)';
  });
});

/* ═══════════════════════════════════════════
   PARTICLE BACKGROUND
═══════════════════════════════════════════ */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.r  = Math.random() * 2.2 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    const hue = Math.random() < 0.7 ? 0 : 20;
    this.color = `hsla(${hue}, 90%, ${40 + Math.random() * 30}%, ${this.alpha})`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.floor((canvas.width * canvas.height) / 9000);
  particles = Array.from({ length: count }, () => new Particle());
}
initParticles();

// Connect nearby particles with lines
function connectParticles() {
  const max = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < max) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(139,0,0,${0.18 * (1 - dist / max)})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ═══════════════════════════════════════════
   NAVBAR SCROLL & HAMBURGER
═══════════════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('scrollTop').classList.toggle('show', window.scrollY > 400);
});

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ═══════════════════════════════════════════
   SCROLL-TO-TOP
═══════════════════════════════════════════ */
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ═══════════════════════════════════════════
   SCROLL REVEAL (Intersection Observer)
═══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      siblings.forEach((el, idx) => {
        setTimeout(() => el.classList.add('visible'), idx * 120);
      });
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════
   SKILL BAR ANIMATION
═══════════════════════════════════════════ */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        const target = fill.dataset.width;
        setTimeout(() => { fill.style.width = target; }, 300);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('#skills').forEach(s => barObserver.observe(s));

/* ═══════════════════════════════════════════
   ACTIVE NAV LINK (scroll spy)
═══════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => spyObserver.observe(s));

/* ═══════════════════════════════════════════
   PARALLAX HERO
═══════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const heroContent = document.querySelector('.hero-content');
  const heroAvatar  = document.querySelector('.hero-avatar');
  const offset = window.scrollY;
  if (heroContent) heroContent.style.transform = `translateY(${offset * 0.18}px)`;
  if (heroAvatar)  heroAvatar.style.transform  = `translateY(${offset * 0.1}px)`;
});

/* ═══════════════════════════════════════════
   MOUSE REPEL ON CARDS (subtle tilt)
═══════════════════════════════════════════ */
document.querySelectorAll('.project-card, .about-card, .hobby-card, .skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ═══════════════════════════════════════════
   TYPING EFFECT – hero sub text
═══════════════════════════════════════════ */
const phrases = [
  'Turning ideas into digital experiences.',
  'Building creative web projects.',
  'Always learning. Always growing.'
];

const heroSub = document.querySelector('.hero-sub');
let pIdx = 0, cIdx = 0, deleting = false;

function type() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    heroSub.textContent = phrase.slice(0, cIdx++);
    if (cIdx > phrase.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    heroSub.textContent = phrase.slice(0, cIdx--);
    if (cIdx < 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; cIdx = 0; }
  }
  setTimeout(type, deleting ? 50 : 70);
}

setTimeout(type, 2200);
