(function() {
    function fetchText(url) {
        return fetch(url, { cache: 'no-cache' }).then(function(res) {
            if (!res.ok) throw new Error('Failed to fetch ' + url + ' (' + res.status + ')');
            return res.text();
        });
    }

    function inject(selector, html) {
        var container = document.querySelector(selector);
        if (container) {
            container.outerHTML = html; // replace placeholder element entirely
        }
    }

    function loadPartials() {
        var headerPlaceholder = document.querySelector('[data-include="header"]');
        var footerPlaceholder = document.querySelector('[data-include="footer"]');
        var promises = [];

        if (headerPlaceholder) {
            promises.push(
                fetchText('partials/header.html').then(function(html) {
                    inject('[data-include="header"]', html);
                })
            );
        }

        if (footerPlaceholder) {
            promises.push(
                fetchText('partials/footer.html').then(function(html) {
                    inject('[data-include="footer"]', html);
                })
            );
        }

        return Promise.all(promises);
    }

    // Load on DOMContentLoaded to ensure placeholders exist
    document.addEventListener('DOMContentLoaded', function() {
        loadPartials()
            .then(function() {
                document.dispatchEvent(new CustomEvent('partials:ready'));
            })
            .catch(function(err) {
                console.error(err);
                document.dispatchEvent(new CustomEvent('partials:error', { detail: err }));
            });
    });
})();


