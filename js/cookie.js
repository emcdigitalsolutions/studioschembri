/**
 * Studio Schembri - Cookie Consent GDPR
 * Gestione banner cookie, preferenze e caricamento condizionale Google Maps
 */

(function () {
    'use strict';

    var COOKIE_KEY = 'ss_cookie_consent';
    var COOKIE_EXPIRY_DAYS = 180;

    var banner = document.getElementById('cookieBanner');
    var modalOverlay = document.getElementById('cookieModalOverlay');
    var thirdPartyToggle = document.getElementById('cookieThirdParty');

    var btnAcceptAll = document.getElementById('cookieAcceptAll');
    var btnNecessary = document.getElementById('cookieNecessary');
    var btnSettings = document.getElementById('cookieSettings');
    var btnModalReject = document.getElementById('cookieModalReject');
    var btnModalSave = document.getElementById('cookieModalSave');

    function getConsent() {
        try {
            var stored = localStorage.getItem(COOKIE_KEY);
            if (!stored) return null;

            var consent = JSON.parse(stored);
            if (consent.expiry && Date.now() > consent.expiry) {
                localStorage.removeItem(COOKIE_KEY);
                return null;
            }
            return consent;
        } catch (e) {
            return null;
        }
    }

    function saveConsent(thirdParty) {
        var consent = {
            technical: true,
            thirdParty: thirdParty,
            expiry: Date.now() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    }

    function showBanner() {
        if (banner) {
            setTimeout(function () {
                banner.classList.add('show');
            }, 1500);
        }
    }

    function hideBanner() {
        if (banner) {
            banner.classList.remove('show');
        }
    }

    function showModal() {
        if (modalOverlay) {
            modalOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    function hideModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    function loadGoogleMaps() {
        // Sede 1 - Campobello di Licata
        loadMapEmbed(
            'mapContainer1',
            'mapPlaceholder1',
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3170.0!2d13.9159!3d37.2614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x131139b0b0e3f6b7%3A0x0!2sVia+Girgenti+33%2C+92023+Campobello+di+Licata+AG!5e0!3m2!1sit!2sit',
            'Google Maps - Studio Schembri, Via Girgenti 33, Campobello di Licata'
        );

        // Sede 2 - Ravanusa
        loadMapEmbed(
            'mapContainer2',
            'mapPlaceholder2',
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3170.0!2d13.9670!3d37.2680!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x131139c0c0e3f6b7%3A0x0!2sVia+Giuseppe+Mazzini+42%2C+92029+Ravanusa+AG!5e0!3m2!1sit!2sit',
            'Google Maps - Studio Schembri, Via Giuseppe Mazzini 42, Ravanusa'
        );
    }

    function loadMapEmbed(containerId, placeholderId, src, title) {
        var container = document.getElementById(containerId);
        var placeholder = document.getElementById(placeholderId);
        if (!container || !placeholder) return;

        var iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';
        iframe.style.position = 'absolute';
        iframe.style.inset = '0';
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.setAttribute('allowfullscreen', '');
        iframe.title = title;

        placeholder.style.display = 'none';
        container.appendChild(iframe);
    }

    function showMapPlaceholders() {
        ['mapPlaceholder1', 'mapPlaceholder2'].forEach(function (id) {
            var placeholder = document.getElementById(id);
            if (placeholder) placeholder.style.display = 'flex';
        });

        ['mapContainer1', 'mapContainer2'].forEach(function (id) {
            var container = document.getElementById(id);
            if (container) {
                var existing = container.querySelector('iframe');
                if (existing) existing.remove();
            }
        });
    }

    function applyConsent(consent) {
        if (consent && consent.thirdParty) {
            loadGoogleMaps();
        } else {
            showMapPlaceholders();
        }
    }

    function handleAccept(thirdParty) {
        saveConsent(thirdParty);
        hideBanner();
        hideModal();
        applyConsent({ thirdParty: thirdParty });
    }

    function init() {
        var consent = getConsent();

        if (consent) {
            applyConsent(consent);
        } else {
            showBanner();
            showMapPlaceholders();
        }

        if (btnAcceptAll) {
            btnAcceptAll.addEventListener('click', function () {
                handleAccept(true);
            });
        }

        if (btnNecessary) {
            btnNecessary.addEventListener('click', function () {
                handleAccept(false);
            });
        }

        if (btnSettings) {
            btnSettings.addEventListener('click', function () {
                if (thirdPartyToggle) {
                    var current = getConsent();
                    thirdPartyToggle.checked = current ? current.thirdParty : false;
                }
                hideBanner();
                showModal();
            });
        }

        if (btnModalReject) {
            btnModalReject.addEventListener('click', function () {
                handleAccept(false);
            });
        }

        if (btnModalSave) {
            btnModalSave.addEventListener('click', function () {
                var thirdParty = thirdPartyToggle ? thirdPartyToggle.checked : false;
                handleAccept(thirdParty);
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', function (e) {
                if (e.target === modalOverlay) {
                    hideModal();
                    showBanner();
                }
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('show')) {
                hideModal();
                showBanner();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
