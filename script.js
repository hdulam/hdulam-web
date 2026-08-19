// HDulam — Blue Edition

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

    /* Marketing plan selector */
    const planTabs = document.querySelectorAll('.plan-tab');
    const planName = document.getElementById('planName');
    const planPrice = document.getElementById('planPrice');
    const planPosts = document.getElementById('planPosts');
    const planReels = document.getElementById('planReels');
    const planReelsLabel = document.getElementById('planReelsLabel');
    const planCta = document.getElementById('planCta');

    planTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            planTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const { plan, price, posts, reels } = tab.dataset;

            if (planName) planName.textContent = plan;
            if (planPrice) planPrice.textContent = price;
            if (planPosts) planPosts.textContent = posts;
            if (planReels) planReels.textContent = reels;
            if (planReelsLabel) {
                planReelsLabel.textContent = Number(reels) === 1 ? 'reel editado' : 'reels editados';
            }

            if (planCta) {
                const message = encodeURIComponent(
                    `Hola, me interesa el paquete de Marketing ${plan} por Q${price}/mes`
                );
                planCta.href = `https://wa.me/50234427911?text=${message}`;
            }
        });
    });

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
