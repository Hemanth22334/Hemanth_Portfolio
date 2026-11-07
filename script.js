'use strict';

const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-label');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function applyTheme(theme) {
  root.dataset.theme = theme;
  const dark = theme === 'dark';
  themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeLabel.textContent = dark ? 'Dark' : 'Light';
  themeMeta.setAttribute('content', dark ? '#10131c' : '#f7f8fc');
}

let savedTheme = null;
try { savedTheme = localStorage.getItem('portfolio-theme'); } catch { /* Storage may be unavailable. */ }
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

themeToggle.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  try { localStorage.setItem('portfolio-theme', nextTheme); } catch { /* Theme still works for this visit. */ }
});

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  navLinks.classList.remove('is-open');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navLinks.classList.toggle('is-open', !isOpen);
});
navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', (event) => {
  if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const revealTargets = document.querySelectorAll('.section-heading, .about-copy, .skill-card, .project-card, .timeline-item, .extra-card');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// GSAP + ScrollTrigger add refined motion as progressive enhancement. If the
// CDN is unavailable, the page still animates with the native observer below.
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function enhanceMotion() {
  if (reduceMotion || !revealTargets.length) return false;
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
    if (!window.gsap || !window.ScrollTrigger) return false;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-copy > *', {
      y: 22,
      opacity: 0,
      duration: 0.75,
      stagger: 0.09,
      ease: 'power2.out',
      clearProps: 'all',
      delay: 0.12
    });
    gsap.from('.hero-art > *', {
      y: 12,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power2.out',
      clearProps: 'all',
      delay: 0.35
    });
    revealTargets.forEach((element) => {
      gsap.from(element, {
        y: 22,
        opacity: 0,
        duration: 0.65,
        ease: 'power2.out',
        clearProps: 'all',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true }
      });
    });
    return true;
  } catch (error) {
    // Keep the site fully usable when an external animation library is blocked.
    return false;
  }
}

function useNativeReveal() {
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  revealTargets.forEach((element) => element.classList.add('js-reveal'));
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((element) => observer.observe(element));
}

enhanceMotion().then((gsapLoaded) => {
  if (!gsapLoaded) useNativeReveal();
});
