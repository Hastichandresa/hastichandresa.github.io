(function() {
    function sanitize(text) {
        var div = document.createElement('div');
        div.innerText = text || '';
        return div.innerHTML;
    }

    function toSlug(filename) {
        return filename.replace(/\.(md|mdx|fountain)$/i, '');
    }

    function titleFromSlug(slug) {
        return slug
            .split('-')
            .map(function(part) { return part.charAt(0).toUpperCase() + part.slice(1); })
            .join(' ');
    }

    function renderList(posts) {
        var list = document.getElementById('script-list');
        var empty = document.getElementById('script-empty');
        if (!posts || posts.length === 0) {
            empty.style.display = '';
            return;
        }
        empty.style.display = 'none';
        posts.forEach(function(post) {
            var slug = toSlug(post.file || post);
            var title = sanitize(post.title || titleFromSlug(slug));
            var desc = sanitize(post.description || '');
            var li = document.createElement('li');
            li.className = 'folio-list__item column';
            li.innerHTML = '' +
                '<a class="folio-list__item-link" href="script.html?slug=' + encodeURIComponent(slug) + '">' +
                '  <div class="folio-list__item-text">' +
                '    <div class="folio-list__item-cat">Script</div>' + // Changed from Article to Script
                '    <div class="folio-list__item-title">' + title + '</div>' +
                (desc ? '    <p style="margin-top: .5rem">' + desc + '</p>' : '') +
                '  </div>' +
                '</a>';
            list.appendChild(li);
        });
    }


    function fetchIndexJson() {
        return fetch('scripts/index.json', { cache: 'no-cache' })
            .then(function(r) { if (!r.ok) throw new Error('not ok'); return r.json(); });
    }

    function attemptDirectoryProbe() {
        // Static hosts often disallow directory listing; try common filenames as a minimal fallback
        var common = ['hello-world.md', 'welcome.mdx', 'Big-Fish.fountain'];
        var checks = common.map(function(name) {
            return fetch('scripts/' + name, { method: 'HEAD' })
                .then(function(r){ return r.ok ? name : null; })
                .catch(function(){ return null; });
        });
        return Promise.all(checks).then(function(found){
            return found.filter(Boolean);
        });
    }

    function init() {
        fetchIndexJson()
            .then(function(index){ renderList(index.posts || index); })
            .catch(function(){
                attemptDirectoryProbe().then(function(files){
                    renderList(files.map(function(f){ return { file: f }; }));
                });
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
