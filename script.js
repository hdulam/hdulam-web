// HDulam — Blue Edition

/* =====================================================
   REGIONES
   Todo lo que cambia por país vive aquí: contacto, moneda y precios.
   Para actualizar un precio, solo edita el valor de abajo.
   `null` en un paquete de marketing = se muestra "Consultar".
   ===================================================== */
const REGIONS = {
    gt: {
        lang: 'es-GT',
        country: 'Guatemala',
        whatsapp: '50234427911',
        phone: '+502 3442-7911',
        money: (amount) => `Q${amount}`,
        currency: 'Q',
        webPrice: '5,638.70',
        marketing: {
            Emprende: '1,595',
            Construye: '1,950',
            Lidera: '2,495'
        },
        quoteLabel: 'Consultar'
    },
    ar: {
        lang: 'es-AR',
        country: 'Argentina',
        whatsapp: '5491128153592',
        phone: '+54 9 11 2815 3592',
        money: (amount) => `US$ ${amount}`,
        currency: 'US$',
        webPrice: '726.50',
        marketing: {
            Emprende: '205.50',
            Construye: '251.24',
            Lidera: '321.46'
        },
        quoteLabel: 'Consultar'
    }
};

const DEFAULT_REGION = 'gt';
const REGION_STORAGE_KEY = 'hdulam-region';

/* Zona horaria del dispositivo: es una pista aproximada, sin pedir permisos */
const AR_TIMEZONE = /^America\/(Argentina\/|Buenos_Aires$|Cordoba$|Catamarca$|Jujuy$|Mendoza$|Rosario$)/;

const guessRegionFromTimezone = (timeZone) => {
    if (AR_TIMEZONE.test(timeZone || '')) return 'ar';
    if (timeZone === 'America/Guatemala') return 'gt';
    return null;
};

document.addEventListener('DOMContentLoaded', () => {

    /* Navbar scroll state */
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        if (window.scrollY > 24) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Mobile menu */
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');

    const openMenu = () => mobileMenu.classList.add('open');
    const closeMenu = () => mobileMenu.classList.remove('open');

    navToggle?.addEventListener('click', openMenu);
    mobileClose?.addEventListener('click', closeMenu);
    mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    /* FAQ accordion */
    const faqItems = document.querySelectorAll('.faq-item');

    const setAnswerHeight = (item, open) => {
        const answer = item.querySelector('.faq-answer');
        if (open) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = '0px';
        }
    };

    const refreshFaqHeights = () => {
        faqItems.forEach(item => {
            if (item.classList.contains('open')) setAnswerHeight(item, true);
        });
    };

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        setAnswerHeight(item, item.classList.contains('open'));

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            faqItems.forEach(other => {
                other.classList.remove('open');
                setAnswerHeight(other, false);
            });

            if (!isOpen) {
                item.classList.add('open');
                setAnswerHeight(item, true);
            }
        });
    });

    window.addEventListener('load', refreshFaqHeights);
    window.addEventListener('resize', refreshFaqHeights);

    /* Country version (Guatemala / Argentina) */
    const regionButtons = document.querySelectorAll('.region-btn');
    const planTabs = document.querySelectorAll('.plan-tab');
    const planName = document.getElementById('planName');
    const planPriceTag = document.getElementById('planPriceTag');
    const planCurrency = document.getElementById('planCurrency');
    const planPrice = document.getElementById('planPrice');
    const planNote = document.getElementById('planNote');
    const planPosts = document.getElementById('planPosts');
    const planReels = document.getElementById('planReels');
    const planReelsLabel = document.getElementById('planReelsLabel');
    const planCta = document.getElementById('planCta');
    const webCta = document.getElementById('webCta');

    let region = DEFAULT_REGION;
    let plan = 'Emprende';
    let regionLocked = false; // ya definido (bandera, URL o zona horaria): la IP no lo cambia

    const waLink = (message) =>
        `https://wa.me/${REGIONS[region].whatsapp}?text=${encodeURIComponent(message)}`;

    const renderPlan = () => {
        const r = REGIONS[region];
        const activeTab = document.querySelector(`.plan-tab[data-plan="${plan}"]`);
        const { posts, reels } = activeTab.dataset;
        const price = r.marketing[plan];
        const hasPrice = price !== null && price !== undefined;

        planTabs.forEach(tab => tab.classList.toggle('active', tab === activeTab));

        planName.textContent = plan;
        planPosts.textContent = posts;
        planReels.textContent = reels;
        planReelsLabel.textContent = Number(reels) === 1 ? 'reel editado' : 'reels editados';

        planPriceTag.classList.toggle('is-quote', !hasPrice);
        planCurrency.textContent = r.currency;
        planPrice.textContent = hasPrice ? price : r.quoteLabel;
        planNote.textContent = hasPrice ? 'Facturado mensualmente' : 'Escríbenos y te pasamos el precio';

        planCta.href = waLink(
            hasPrice
                ? `Hola, me interesa el paquete de Marketing ${plan} por ${r.money(price)}/mes`
                : `Hola, me interesa el paquete de Marketing ${plan}. ¿Me pasan el precio?`
        );
    };

    const renderRegion = () => {
        const r = REGIONS[region];

        document.documentElement.lang = r.lang;
        document.documentElement.dataset.region = region;

        regionButtons.forEach(btn => {
            const isActive = btn.dataset.region === region;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });

        document.querySelectorAll('[data-bind]').forEach(el => {
            el.textContent = r[el.dataset.bind];
        });

        document.querySelectorAll('[data-wa]').forEach(link => {
            link.href = waLink(link.dataset.wa);
        });

        webCta.href = waLink(`Hola, me interesa la página web de ${r.money(r.webPrice)}`);

        renderPlan();
        refreshFaqHeights();
    };

    const saveRegion = (code) => {
        try {
            localStorage.setItem(REGION_STORAGE_KEY, code);
        } catch (e) { /* sin almacenamiento: no pasa nada */ }
    };

    const readSavedRegion = () => {
        try {
            const saved = localStorage.getItem(REGION_STORAGE_KEY);
            return REGIONS[saved] ? saved : null;
        } catch (e) {
            return null;
        }
    };

    // País aproximado por IP. Solo se usa si la zona horaria no lo aclara.
    const lookupCountryByIp = async () => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2500);
        try {
            const response = await fetch('https://api.country.is/', { signal: controller.signal });
            const data = await response.json();
            return data.country;
        } catch (e) {
            return null;
        } finally {
            clearTimeout(timer);
        }
    };

    regionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            region = btn.dataset.region;
            regionLocked = true;
            saveRegion(region);
            renderRegion();
        });
    });

    planTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            plan = tab.dataset.plan;
            renderPlan();
        });
    });

    // Prioridad: ?pais=ar|gt  >  elección guardada  >  zona horaria  >  IP  >  Guatemala
    const queryRegion = new URLSearchParams(window.location.search).get('pais')?.toLowerCase();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const startRegion =
        (REGIONS[queryRegion] ? queryRegion : null) ||
        readSavedRegion() ||
        guessRegionFromTimezone(timezone);

    if (startRegion) {
        region = startRegion;
        regionLocked = true;
    }

    renderRegion();

    if (!startRegion) {
        lookupCountryByIp().then(country => {
            const detected = { AR: 'ar', GT: 'gt' }[country];
            if (regionLocked || !detected || detected === region) return;
            region = detected;
            renderRegion();
        });
    }

    /* Reveal on scroll */
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));

});
