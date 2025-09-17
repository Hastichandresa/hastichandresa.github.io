(function() {
    function isOnIndexLike() {
        var p = location.pathname || '';
        return p.endsWith('/') || p.endsWith('/index.html') || p === '' || p.endsWith('index.html');
    }

    function resolveHref(item) {
        if (!item.on || item.on.length === 0) return item.href;
        return item.on.indexOf(location.pathname) >= 0 ? item.href : (item.href.startsWith('#') ? ('index.html' + item.href) : item.href);
    }

    function buildNavigation() {
        var navList = document.getElementById('nav-list');
        if (!navList || !window.SITE_CONFIG) return;

        // Remove all except the first home link item which is already present
        var items = Array.prototype.slice.call(navList.querySelectorAll('li'));
        for (var i = 1; i < items.length; i++) items[i].remove();

        window.SITE_CONFIG.navigation.forEach(function(item) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.textContent = item.label;
            a.href = resolveHref(item);
            if (item.label === 'Blog' && /blog\.html$/.test(location.pathname)) li.classList.add('current');
            if (item.label === 'Scripts' && /screenplay\.html$/.test(location.pathname)) li.classList.add('current');
            if (item.href && item.href.startsWith('#') && isOnIndexLike()) {
                a.classList.add('smoothscroll');
            }
            li.appendChild(a);
            navList.appendChild(li);
        });
    }

    function populateConfigBindings() {
        if (!window.SITE_CONFIG) return;
        var textBindings = document.querySelectorAll('[data-config]');
        Array.prototype.forEach.call(textBindings, function(el) {
            var key = el.getAttribute('data-config');
            if (!key) return;
            if (key === 'siteTag' || key === 'siteName' || key === 'description' || key === 'author' || key === 'email' || key === 'phone') {
                var value = window.SITE_CONFIG[key] || '';
                if (el.tagName === 'A' && (key === 'email')) {
                    el.href = 'mailto:' + value;
                    el.textContent = value;
                } else if (el.tagName === 'A' && key === 'phone') {
                    el.href = 'tel:' + value.replace(/\s+/g, '');
                    el.textContent = value;
                } else {
                    el.textContent = value;
                }
            }
        });

        // Intro socials
        var introSocial = document.querySelector('.intro-social');
        if (introSocial && window.SITE_CONFIG.socials) {
            introSocial.innerHTML = '';
            window.SITE_CONFIG.socials.forEach(function(s) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.href = s.url;
                a.textContent = s.name;
                li.appendChild(a);
                introSocial.appendChild(li);
            });
        }

        // Contact section bindings
        var contactEmail = document.querySelector('[data-config="email"]');
        if (contactEmail) {
            contactEmail.href = 'mailto:' + window.SITE_CONFIG.email;
            contactEmail.textContent = window.SITE_CONFIG.email;
        }
        var contactPhone = document.querySelector('[data-config="phone"]');
        if (contactPhone) {
            contactPhone.href = 'tel:' + window.SITE_CONFIG.phone.replace(/\s+/g, '');
            contactPhone.textContent = window.SITE_CONFIG.phone;
        }
        var contactSocial = document.querySelector('.contact-social');
        if (contactSocial && window.SITE_CONFIG.socials) {
            contactSocial.innerHTML = '';
            window.SITE_CONFIG.socials.forEach(function(s) {
                var li2 = document.createElement('li');
                var a2 = document.createElement('a');
                a2.href = s.url;
                a2.textContent = s.name;
                li2.appendChild(a2);
                contactSocial.appendChild(li2);
            });
        }

        // Intro headline and pretitle
        if (window.SITE_CONFIG.profile) {
            var pre = document.getElementById('intro-pretitle');
            if (pre) pre.textContent = window.SITE_CONFIG.profile.introPretitle || '';

            var title = document.getElementById('intro-title');
            if (title) {
                var name = window.SITE_CONFIG.profile.name || window.SITE_CONFIG.siteName || '';
                var roles = window.SITE_CONFIG.profile.roles || [];
                var location = window.SITE_CONFIG.profile.location || '';
                // Simple template preserving original line breaks
                title.innerHTML = 'I am <span>' + name + '</span>, <br>\n' +
                    (roles[0] ? 'a ' + roles[0] + ' <br>\n' : '') +
                    (roles[1] ? '&  ' + roles[1] + ' based <br>\n' : '& frontend <br>\n') +
                    'in ' + location + '.';
            }
        }

        // About text and CV
        if (window.SITE_CONFIG.about) {
            var aboutText = document.getElementById('about-text');
            if (aboutText) aboutText.textContent = window.SITE_CONFIG.about.text || '';
            var cv = document.getElementById('about-cv');
            if (cv && window.SITE_CONFIG.about.cv) {
                cv.href = window.SITE_CONFIG.about.cv.url || '#0';
                cv.textContent = window.SITE_CONFIG.about.cv.label || 'Download CV';
            }
        }

        // Expertise list
        var expList = document.getElementById('expertise-list');
        if (expList && Array.isArray(window.SITE_CONFIG.expertise)) {
            expList.innerHTML = '';
            window.SITE_CONFIG.expertise.forEach(function(item) {
                var li = document.createElement('li');
                li.textContent = item;
                expList.appendChild(li);
            });
        }

        // Experience timeline
        var expTimeline = document.getElementById('experience-timeline');
        if (expTimeline && Array.isArray(window.SITE_CONFIG.experience)) {
            expTimeline.innerHTML = '';
            window.SITE_CONFIG.experience.forEach(function(job) {
                var block = document.createElement('div');
                block.className = 'timeline__block';
                block.innerHTML = '\n<div class="timeline__bullet"></div>\n' +
                    '<div class="timeline__header">\n' +
                    '  <h4 class="timeline__title">' + (job.company || '') + '</h4>\n' +
                    '  <h5 class="timeline__meta">' + (job.role || '') + '</h5>\n' +
                    '  <p class="timeline__timeframe">' + (job.timeframe || '') + '</p>\n' +
                    '</div>\n' +
                    '<div class="timeline__desc">\n' +
                    '  <p>' + (job.description || '') + '</p>\n' +
                    '</div>';
                expTimeline.appendChild(block);
            });
        }

        // Education timeline
        var eduTimeline = document.getElementById('education-timeline');
        if (eduTimeline && Array.isArray(window.SITE_CONFIG.education)) {
            eduTimeline.innerHTML = '';
            window.SITE_CONFIG.education.forEach(function(edu) {
                var block2 = document.createElement('div');
                block2.className = 'timeline__block';
                block2.innerHTML = '\n<div class="timeline__bullet"></div>\n' +
                    '<div class="timeline__header">\n' +
                    '  <h4 class="timeline__title">' + (edu.school || '') + '</h4>\n' +
                    '  <h5 class="timeline__meta">' + (edu.degree || '') + '</h5>\n' +
                    '  <p class="timeline__timeframe">' + (edu.timeframe || '') + '</p>\n' +
                    '</div>\n' +
                    '<div class="timeline__desc">\n' +
                    '  <p>' + (edu.description || '') + '</p>\n' +
                    '</div>';
                eduTimeline.appendChild(block2);
            });
        }
    }

    function updateHeadMeta() {
        if (!window.SITE_CONFIG) return;
        var titleEl = document.querySelector('head title');
        if (titleEl && /Luther/.test(titleEl.textContent)) {
            // replace base name
            titleEl.textContent = titleEl.textContent.replace('Luther', window.SITE_CONFIG.siteName);
        }
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && !metaDesc.getAttribute('content')) {
            metaDesc.setAttribute('content', window.SITE_CONFIG.description || '');
        }
        var metaAuthor = document.querySelector('meta[name="author"]');
        if (metaAuthor && !metaAuthor.getAttribute('content')) {
            metaAuthor.setAttribute('content', window.SITE_CONFIG.author || '');
        }
    }

    function init() {
        buildNavigation();
        populateConfigBindings();
        updateHeadMeta();
    }

    document.addEventListener('partials:ready', init);
})();


