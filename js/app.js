/**
 * Studio Schembri - Main Application
 * Navbar morph, scroll reveal, counters, parallax, mobile menu, form
 */

(function () {
    'use strict';

    // ========== NAVBAR MORPH ==========
    function initNavbar() {
        var navbar = document.getElementById('navbar');
        var hero = document.getElementById('hero');
        if (!navbar || !hero) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navbar.classList.remove('scrolled');
                } else {
                    navbar.classList.add('scrolled');
                }
            });
        }, { threshold: 0, rootMargin: '-80px 0px 0px 0px' });

        observer.observe(hero);
    }

    // ========== SCROLL REVEAL ==========
    function initScrollReveal() {
        var elements = document.querySelectorAll('[data-reveal]');
        if (!elements.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
                    setTimeout(function () {
                        entry.target.classList.add('revealed');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        elements.forEach(function (el) {
            observer.observe(el);
        });
    }

    // ========== COUNTER ANIMATION ==========
    function initCounters() {
        var counters = document.querySelectorAll('[data-counter]');
        if (!counters.length) return;

        var animated = false;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    counters.forEach(function (counter) {
                        animateCounter(counter);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(document.getElementById('numeri'));
    }

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-counter'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 2000;
        var start = 0;
        var startTime = null;

        function ease(t) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var current = Math.floor(ease(progress) * target);
            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        }

        requestAnimationFrame(step);
    }

    // ========== HERO PARALLAX (disabled - static composition) ==========
    function initParallax() {
        // Parallax disabled: logo composition remains static
    }

    // ========== MOBILE MENU ==========
    function initMobileMenu() {
        var menuBtn = document.getElementById('menuBtn');
        var overlay = document.getElementById('mobileOverlay');
        if (!menuBtn || !overlay) return;

        var isOpen = false;
        var focusableElements = overlay.querySelectorAll('a');
        var firstFocusable = focusableElements[0];
        var lastFocusable = focusableElements[focusableElements.length - 1];

        function openMenu() {
            isOpen = true;
            menuBtn.classList.add('open');
            overlay.classList.add('open');
            menuBtn.setAttribute('aria-expanded', 'true');
            menuBtn.setAttribute('aria-label', 'Chiudi menu');
            document.body.style.overflow = 'hidden';
            setTimeout(function () {
                firstFocusable && firstFocusable.focus();
            }, 400);
        }

        function closeMenu() {
            isOpen = false;
            menuBtn.classList.remove('open');
            overlay.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.setAttribute('aria-label', 'Apri menu');
            document.body.style.overflow = '';
        }

        menuBtn.addEventListener('click', function () {
            isOpen ? closeMenu() : openMenu();
        });

        // Close on link click
        overlay.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) {
                closeMenu();
                menuBtn.focus();
            }

            // Focus trap
            if (e.key === 'Tab' && isOpen) {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });

        // Expose globally for inline onclick
        window.closeMobileMenu = closeMenu;
    }

    // ========== ACTIVE LINK ==========
    function initActiveLink() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-links a');
        if (!sections.length || !navLinks.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.getAttribute('id');
                    navLinks.forEach(function (link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' });

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    // ========== SMOOTH SCROLL ==========
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (href === '#') return;

                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    var navbarHeight = 80;
                    var targetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    window.scrollTo({ top: targetTop, behavior: 'smooth' });
                }
            });
        });
    }

    // ========== FORM ==========
    function initForm() {
        var form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('formName');
            var email = document.getElementById('formEmail');
            var message = document.getElementById('formMessage');
            var privacy = document.getElementById('formPrivacy');
            var phone = document.getElementById('formPhone');

            // Reset errors
            [name, email, message].forEach(function (input) {
                input.style.borderColor = 'rgba(255,255,255,0.2)';
            });

            var errors = [];

            if (!name.value.trim()) {
                errors.push(name);
            }
            if (!email.value.trim() || !isValidEmail(email.value)) {
                errors.push(email);
            }
            if (!message.value.trim()) {
                errors.push(message);
            }
            if (!privacy.checked) {
                errors.push(privacy);
            }

            if (errors.length > 0) {
                errors.forEach(function (input) {
                    if (input.type !== 'checkbox') {
                        input.style.borderColor = '#ef4444';
                    }
                });
                errors[0].focus();
                return;
            }

            // Build mailto
            var subject = encodeURIComponent('Richiesta informazioni da ' + name.value.trim());
            var body = encodeURIComponent(
                'Nome: ' + name.value.trim() + '\n' +
                'Telefono: ' + (phone.value.trim() || 'Non specificato') + '\n' +
                'Email: ' + email.value.trim() + '\n\n' +
                'Messaggio:\n' + message.value.trim()
            );

            window.location.href = 'mailto:info@studioschembri.it?subject=' + subject + '&body=' + body;
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ========== INIT ==========
    function init() {
        initNavbar();
        initScrollReveal();
        initCounters();
        initParallax();
        initMobileMenu();
        initActiveLink();
        initSmoothScroll();
        initForm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
