// =========================================================
// RISE360LATAM — main.js
// Menú móvil, tracking de clics WhatsApp (Meta Pixel + GA4),
// y manejo de placeholders de fotos/videos.
// =========================================================

(function () {
  "use strict";

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Tracking de clics en botones de WhatsApp ----------
     Cada botón/enlace con la clase "whatsapp-cta" dispara:
       - Meta Pixel: evento estándar "Contact"
       - Google Analytics 4: evento "whatsapp_click" con la etiqueta (data-goal)
     Esto permite medir qué secciones/objetivos generan más reservas
     y optimizar campañas de Meta Ads.
  ------------------------------------------------------------- */
  document.querySelectorAll(".whatsapp-cta").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var label = btn.getAttribute("data-goal") || btn.getAttribute("data-location") || "general";

      if (typeof fbq === "function") {
        fbq("track", "Contact", { content_name: label });
      }
      if (typeof gtag === "function") {
        gtag("event", "whatsapp_click", {
          event_category: "engagement",
          event_label: label,
        });
      }
    });
  });

  /* ---------- Tracking de clics hacia la comunidad de Skool ----------
     Mide cuánta gente sale del sitio hacia Skool, para saber qué tan
     bien está convirtiendo cada lugar donde se promociona.
  ------------------------------------------------------------- */
  document.querySelectorAll(".skool-cta").forEach(function (link) {
    link.addEventListener("click", function () {
      var label = link.getAttribute("data-goal") || "skool";
      if (typeof gtag === "function") {
        gtag("event", "skool_click", {
          event_category: "engagement",
          event_label: label,
        });
      }
    });
  });

  /* ---------- Placeholders de fotos/videos ----------
     La imagen/video real siempre se dibuja encima de la etiqueta de
     placeholder (ver z-index en css/styles.css). Si el archivo no existe
     (404), aquí se oculta para que la etiqueta quede visible debajo.
  ------------------------------------------------------------- */
  document.querySelectorAll(".media-slot img").forEach(function (img) {
    img.addEventListener("error", function () {
      img.style.display = "none";
    });
  });

  document.querySelectorAll(".media-slot video").forEach(function (video) {
    video.addEventListener("error", function () {
      video.style.display = "none";
    });
  });

  /* ---------- Header: sombra al hacer scroll ---------- */
  var header = document.querySelector(".header");
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 8 ? "0 8px 24px rgba(0,0,0,0.4)" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Año dinámico en el footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
