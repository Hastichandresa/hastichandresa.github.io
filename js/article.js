(function() {
    function getQueryParam(name) {
        var m = new RegExp('(?:^|&)' + name + '=([^&]*)').exec(window.location.search.slice(1));
        return m ? decodeURIComponent(m[1]) : null;
    }

    function loadMarkdown(slug) {
        var candidates = ['blogs/' + slug + '.md', 'blogs/' + slug + '.mdx'];
        function tryNext(i) {
            if (i >= candidates.length) return Promise.reject(new Error('Not found'));
            return fetch(candidates[i])
                .then(function(r){ if (!r.ok) throw new Error('bad'); return r.text(); })
                .catch(function(){ return tryNext(i+1); });
        }
        return tryNext(0);
    }

    function extractTitle(markdown) {
        var m = markdown.match(/^\s*#\s+(.+)$/m);
        return m ? m[1].trim() : null;
    }

    function extractFrontMatter(markdown) {
        const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
        const match = markdown.match(frontMatterRegex);
        let frontMatter = {};

        if (match) {
            const frontMatterContent = match[1];
            const lines = frontMatterContent.split('\n');
            lines.forEach(line => {
                const [key, ...value] = line.split(':');
                frontMatter[key.trim()] = value.join(':').trim().replace(/^"|"$/g, '');
            });
        }
        return frontMatter;
    }

        

    function render(markdown) {
        const frontMatter = extractFrontMatter(markdown);

        const content = markdown.replace(/^\s*---\n([\s\S]*?)\n---/, ''); //
        var html = window.marked ? window.marked.parse(content) : content;
        document.getElementById('article-content').innerHTML = html;
        var title = extractTitle(markdown) || 'Article';
        document.getElementById('article-title').textContent = title;
        document.title = 'Luther — ' + title;
    }

    function showError(msg) {
        document.getElementById('article-content').innerHTML = '<p>' + msg + '</p>';
    }

    function init() {
        var slug = getQueryParam('slug');
        if (!slug) {
            showError('No article specified.');
            return;
        }
        loadMarkdown(slug)
            .then(render)
            .catch(function(){ showError('Article not found. Make sure a matching .md or .mdx exists in blogs/.'); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


