/* ═══════════════════════════════════════════════════════════
   THE OLD CATHOLIC UNIVERSITY — nav.js
   Inject shared nav + footer HTML, then wire up all behaviour.

   WHY NO FLASH:
   • styles.css sets body { opacity:0; background:--cream }
     so the page is invisible until .ready fires — but the
     background is already cream so section backgrounds match
     immediately when opacity fades in.
   • Nav HTML is injected synchronously (no DOMContentLoaded
     wait) so the nav bar renders on first paint.
   • .ready is added after fonts are available (or 300ms max),
     whichever comes first — prevents a long invisible wait.

   WHY NO TEXT JUMP:
   • body.page-out fades opacity to 0 BEFORE navigation.
     The new page starts at opacity:0 and fades in after the
     same font-ready check. Visible content is always either
     fading in or fading out — never snapping.
═══════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   NAV HTML — injected immediately, synchronously
════════════════════════════════════════════════════════ */
const NAV_HTML = `
<nav id="nav">
  <div class="nav-left">
    <a href="index.html">
      <img src="logo.png" alt="The Old Catholic University" class="nav-logo-img">
    </a>
    <div class="nav-wordmark">
      The Old Catholic University
      <span>Fiat Lux &middot; Theological Education &middot; Ministerial Formation</span>
    </div>
  </div>
  <ul class="nav-links">
    <li><a href="about.html">About</a></li>
    <li><a href="programs.html">Programs</a></li>
    <li><a href="seminary.html">Seminary</a></li>
    <li><a href="faculty.html">Faculty</a></li>
    <li><a href="life.html">Student Life</a></li>
    <li><a href="admissions.html">Admissions</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
  <button class="nav-menu-btn" id="nav-menu-btn" aria-label="Open menu" aria-expanded="false">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect y="3"    width="20" height="1.8" rx=".9" fill="currentColor"/>
      <rect y="9.1"  width="20" height="1.8" rx=".9" fill="currentColor"/>
      <rect y="15.2" width="20" height="1.8" rx=".9" fill="currentColor"/>
    </svg>
  </button>
  <a href="admissions.html" class="nav-apply">Apply Now</a>
</nav>
<div id="nav-drawer" role="dialog" aria-modal="false" aria-label="Site navigation">
  <ul>
    <li><a href="about.html">About</a></li>
    <li><a href="programs.html">Programs</a></li>
    <li><a href="seminary.html">Seminary</a></li>
    <li><a href="faculty.html">Faculty</a></li>
    <li><a href="life.html">Student Life</a></li>
    <li><a href="admissions.html">Admissions</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
  <a href="admissions.html" class="nav-drawer-apply">Apply Now</a>
</div>`;

/* ════════════════════════════════════════════════════════
   FOOTER HTML
════════════════════════════════════════════════════════ */
const FOOTER_HTML = `
<footer id="site-footer">
  <div class="footer-grid container">
    <div class="footer-brand">
      <img src="logo.png" alt="TOCU Seal" class="footer-logo">
      <div class="nav-wordmark" style="color:var(--gold-light);margin-bottom:.9rem;">
        The Old Catholic University
        <span>Est. in the Tradition of the Holy Undivided Church</span>
      </div>
      <p>A center of theological education and spiritual formation within the ministry of The Old Catholic Church and its Patriarchate.</p>
      <a href="admissions.html" class="btn-gold" style="margin-top:1.4rem;font-size:9.5px;padding:10px 20px;">Apply Now</a>
    </div>
    <div class="footer-col">
      <h4>Academic</h4>
      <a href="programs.html">Degree Programs</a>
      <a href="programs.html#areas">Areas of Study</a>
      <a href="seminary.html">St. Matthew Seminary</a>
      <a href="programs.html#catalog">Academic Catalog</a>
    </div>
    <div class="footer-col">
      <h4>University</h4>
      <a href="about.html">Our Identity</a>
      <a href="about.html#values">Core Values</a>
      <a href="faculty.html">Leadership</a>
      <a href="life.html">Academic Life</a>
    </div>
    <div class="footer-col">
      <h4>Connect</h4>
      <a href="admissions.html">Admissions</a>
      <a href="contact.html">Contact Us</a>
      <a href="https://theoldcatholic.church" target="_blank" rel="noopener">The Old Catholic Church</a>
      <a href="https://theoldcatholic.church/documents" target="_blank" rel="noopener">Documents</a>
    </div>
  </div>
  <div class="footer-bottom container">
    <p>&copy; 2026 The Old Catholic University &middot; All Rights Reserved</p>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="rgba(184,146,42,.3)">
      <rect x="4.5" y="0" width="3" height="12"/>
      <rect x="0"   y="4.5" width="12" height="3"/>
    </svg>
    <p>Catholic but not Roman &middot; Orthodox but not Eastern</p>
  </div>
</footer>`;

/* ════════════════════════════════════════════════════════
   INJECT — synchronous, before DOMContentLoaded
   body.firstChild may be a text node; insertAdjacentHTML
   is safer than prepend for cross-browser consistency.
════════════════════════════════════════════════════════ */
document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);

/* ════════════════════════════════════════════════════════
   FADE-IN
   Wait for fonts (max 350ms) then reveal the page.
   This prevents the "unstyled text → styled text" jump.
════════════════════════════════════════════════════════ */
function revealPage() {
  document.body.classList.add('ready');
}

// Use FontFace observer if available; otherwise a short timeout
const fontTimeout = setTimeout(revealPage, 350);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    clearTimeout(fontTimeout);
    revealPage();
  });
}

/* ════════════════════════════════════════════════════════
   PAGE TRANSITIONS
   Intercept internal .html link clicks: fade out → navigate.
   The new page starts at opacity:0 and fades in via revealPage.
════════════════════════════════════════════════════════ */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href');
  // Internal HTML pages only — not anchors, not external, not new-tab
  const isInternal =
    href &&
    !href.startsWith('http') &&
    !href.startsWith('mailto') &&
    !href.startsWith('#') &&
    !link.hasAttribute('target') &&
    (href.endsWith('.html') || href.includes('.html#'));

  if (!isInternal) return;

  e.preventDefault();
  document.body.classList.remove('ready');
  document.body.classList.add('page-out');

  // Navigate after the fade-out transition (18ms declared in CSS, give 220ms)
  setTimeout(() => { window.location.href = href; }, 220);
}, true); // capture phase so it fires before any onclick

/* ════════════════════════════════════════════════════════
   ACTIVE NAV LINK
════════════════════════════════════════════════════════ */
(function markActive() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#nav .nav-links a, #nav-drawer a').forEach(a => {
    if ((a.getAttribute('href') || '').split('#')[0] === page) {
      a.classList.add('active');
    }
  });
})();

/* ════════════════════════════════════════════════════════
   SCROLL: nav shadow
════════════════════════════════════════════════════════ */
(function setupScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const tick = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

/* ════════════════════════════════════════════════════════
   MOBILE DRAWER
════════════════════════════════════════════════════════ */
(function setupDrawer() {
  const btn    = document.getElementById('nav-menu-btn');
  const drawer = document.getElementById('nav-drawer');
  if (!btn || !drawer) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const open = drawer.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', e => {
    if (!drawer.contains(e.target) && e.target !== btn) {
      drawer.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ════════════════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════════════════ */
(function setupReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();
