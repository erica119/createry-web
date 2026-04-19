const APP_URL = 'https://easymealplanning.netlify.app/?creator=test';

function goToApp() { window.open(APP_URL, '_blank'); }
function openLink(url) { window.open(url, '_blank'); }

// Nav scroll
const nav = document.querySelector('.nav');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));

// Hamburger
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
  mobileNav.querySelectorAll('a, button').forEach(el => el.addEventListener('click', () => mobileNav.classList.remove('open')));
}

// Fade-up animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Creator application form
async function submitApply() {
  const btn = document.getElementById('apply-btn');
  if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
  const body = {
    name: document.getElementById('a-name')?.value,
    email: document.getElementById('a-email')?.value,
    brand: document.getElementById('a-brand')?.value,
    platform: document.getElementById('a-platform')?.value,
    audience: document.getElementById('a-audience')?.value,
    link: document.getElementById('a-link')?.value,
    message: document.getElementById('a-msg')?.value,
    _subject: 'New Plate Creator Application'
  };
  try {
    await fetch('https://formspree.io/f/meepbwjz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch(e) { console.log('Form submission error:', e); }
  document.getElementById('apply-form')?.style.setProperty('display', 'none');
  const s = document.getElementById('apply-success');
  if (s) s.classList.add('visible');
}

// Contact form
async function submitContact() {
  const btn = document.getElementById('contact-btn');
  if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
  const body = {
    name: document.getElementById('c-name')?.value,
    email: document.getElementById('c-email')?.value,
    type: document.getElementById('c-type')?.value,
    subject: document.getElementById('c-subject')?.value,
    message: document.getElementById('c-msg')?.value,
    _subject: 'New Plate Contact Form Message'
  };
  try {
    await fetch('https://formspree.io/f/maqlgzyn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch(e) { console.log('Form submission error:', e); }
  document.getElementById('contact-form')?.style.setProperty('display', 'none');
  const s = document.getElementById('contact-success');
  if (s) s.classList.add('visible');
}
