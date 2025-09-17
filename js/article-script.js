(function() {
    function getQueryParam(name) {
        var m = new RegExp('(?:^|&)' + name + '=([^&]*)').exec(window.location.search.slice(1));
        return m ? decodeURIComponent(m[1]) : null;
    }

    function loadFile(slug) {
        var candidates = ['scripts/' + slug + '.fountain'];
        function tryNext(i) {
            if (i >= candidates.length) return Promise.reject(new Error('Not found'));
            return fetch(candidates[i])
                .then(function(r) { if (!r.ok) throw new Error('bad'); return r.text(); })
                .catch(function() { return tryNext(i + 1); });
        }
        return tryNext(0);
    }

    function render(content) {
        let output;
        output = fountain.parse(content);
        
        document.getElementById('article-script-content').innerHTML = output.html.script;
        document.getElementById('article-script-title').textContent = output.title;
        document.title = 'Hasti — ' + output.title;
    }

    function showError(msg) {
        document.getElementById('article-script-content').innerHTML = '<p>' + msg + '</p>';
    }

    function init() {
        var slug = getQueryParam('slug');
        if (!slug) {
            showError('No article specified.');
            return;
        }
        loadFile(slug)
            .then(function(content) {
                render(content);
            })
            .catch(function(e) { showError(`Article not found. Make sure a matching .md, .mdx, or .fountain exists in blogs/. ${e}`); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
