// =============================================
// TYCOON FITNESS — main.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ─── HAMBURGER / MOBILE MENU ───────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Cierra el menú al hacer clic en un enlace dentro de él
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── NEWSLETTER / FORM SUBMIT ──────────────
  const nlForm = document.querySelector('.nl-form');
  if (nlForm) {
    const nlBtn = nlForm.querySelector('button');
    const nlInput = nlForm.querySelector('input');

    nlBtn.addEventListener('click', () => {
      const email = nlInput.value.trim();
      if (!email || !email.includes('@')) {
        nlInput.style.borderColor = '#E53E3E';
        nlInput.focus();
        return;
      }
      nlInput.style.borderColor = '';
      nlBtn.textContent = '¡Suscrito! ✓';
      nlBtn.style.background = '#2D7A47';
      nlInput.value = '';
      setTimeout(() => {
        nlBtn.textContent = 'Suscribirse';
        nlBtn.style.background = '';
      }, 3000);
    });
  }

  // ─── CERT FORM SUBMIT ─────────────────────
  const certBtn = document.querySelector('.cert-form .btn-primary');
  if (certBtn) {
    certBtn.addEventListener('click', () => {
      const inputs = document.querySelectorAll('.cert-form input, .cert-form select');
      let valid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#E53E3E';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });
      if (!valid) return;

      certBtn.textContent = 'Enviado ✓';
      certBtn.style.background = '#2D7A47';
      inputs.forEach(input => { input.value = ''; input.style.borderColor = ''; });
      setTimeout(() => {
        certBtn.textContent = 'Enviar Solicitud →';
        certBtn.style.background = '';
      }, 3000);
    });
  }

  // ─── SMOOTH SCROLL para enlaces de anclaje ─
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ─── NAVBAR sombra al hacer scroll ────────
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)';
    } else {
      navbar.style.boxShadow = '';
    }
  });

});
