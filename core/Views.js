
const seo = require('./SEO');

module.exports = {
    layout(title, content, head = '', article = null) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${title} | Insight News</title>
    ${seo.generateTags(article)}
    ${head}
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@400;500;600;800&display=swap" rel="stylesheet">
</head>
<body>
    <div id="progress-bar"></div>
    <header class="main-header">
        <nav class="container">
            <div class="logo"><a href="/">Insight<span>Daily</span></a></div><div class="nav-right">
                <a href="/search?q=Tech" class="nav-link">Tech</a>
                <a href="/search?q=Design" class="nav-link">Design</a>
                <button class="icon-btn" onclick="toggleSearch()"><i class="fas fa-search"></i></button>
                <button class="icon-btn" onclick="toggleTheme()"><i class="fas fa-adjust"></i></button>
            </div>
        </nav>
    </header>

    <div class="search-modal" id="searchModal">
        <div class="modal-content">
            <input type="text" id="searchInput" placeholder="Type to search stories..." onkeyup="handleSearch(event)">
            <button onclick="toggleSearch()">Close</button>
        </div>
    </div>

    <main class="container fade-in">${content}</main>

    <div class="mobile-tabs">
        <a href="/"><i class="fas fa-layer-group"></i><span>Feed</span></a>
        <a href="/search?q=Trending"><i class="fas fa-bolt"></i><span>Hot</span></a>
        <a href="/search?q=Tech"><i class="fas fa-microchip"></i><span>Tech</span></a></div>

    <script>
        function toggleSearch() {
            const m = document.getElementById('searchModal');
            m.classList.toggle('active');
            if(m.classList.contains('active')) document.getElementById('searchInput').focus();
        }
        function handleSearch(e) {
            if(e.key === 'Enter') window.location.href = '/search?q=' + e.target.value;
        }
        function toggleTheme() {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        }
        if(localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
        
        window.onscroll = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            document.getElementById("progress-bar").style.width = (winScroll / height) * 100 + "%";
        };
    </script>
</body>
</html>`;
    },
    articleList(articles) {
        if (!articles.length) return '<div class="empty-state"><h2>No stories found.</h2><p>Try exploring other categories.</p></div>';
        const featured = articles[0];
        const rest = articles.slice(1);
        return `
            <section class="featured-block">
                <div class="featured-label">Top Story</div>
                <h1><a href="/article?id=${featured.id}">${featured.title}</a></h1>
                <p>${featured.content.substring(0, 200)}...</p>
                <div class="meta">${featured.date} &bull; ${featured.category}</div>
            </section>
            <div class="news-grid">
                ${rest.map(a => `
                <article class="news-item">
                    <div class="item-cat">${a.category}</div>
                    <h3><a href="/article?id=${a.id}">${a.title}</a></h3>
                    <div class="item-meta">${a.date} &bull; ${Math.ceil(a.content.length / 600)} min read</div>
                </article>`).join('')}
            </div>`;
    },
    singleArticle(a, related = []) {
        return `
            <article class="article-full">
                <header>
                    <div class="breadcrumb"><a href="/">Home</a> / ${a.category}</div>
                    <h1>${a.title}</h1>
                    <div class="author-box">
                        <div class="avatar">ID</div>
                        <div class="author-info">
                            <strong>Insight Editorial</strong>
                            <span>${a.date} &bull; ${Math.ceil(a.content.length / 600)} min read</span>
                        </div>
                    </div>
                </header>
                <div class="article-content">${a.content.replace(/\n/g, '<br><br>')}</div>
                
                <footer class="article-footer">
                    <h3>Read Next</h3>
                    <div class="related-grid">
                        ${related.map(r => `<a href="/article?id=${r.id}">${r.title}</a>`).join('')}
                    </div>
                </footer>
            </article>`;
    },
    adminLogin(error = '') {
        return `<div class="admin-wrapper"><div class="admin-card"><h2>Management Login</h2><form action="/api/login" method="POST"><input type="text" name="user" placeholder="Username" required>
                        <input type="password" name="pass" placeholder="Password" required><button type="submit">Login</button></form></div></div>`;
    },
    adminPanel(error = '', stats = {}) {const statsHtml = Object.entries(stats).map(([url, count]) => `<li><code>${url}</code>: <strong>${count}</strong></li>`).join('');return `
            <div class="admin-wrapper">
                <div class="admin-card">
                    <h2>Publishing Portal</h2>
                    <div class="stats-box"><h3>Quick Stats</h3><ul>${statsHtml || '<li>No data yet</li>'}</ul></div>${error ? `<p class="error">${error}</p>` : ''}
                    <form action="/api/add" method="POST">
                        <input name="title" placeholder="Article Headline" required>
                        <input name="category" placeholder="Category (e.g. Tech)">
                        <textarea name="content" rows="12" placeholder="Start writing your story..." required></textarea>
                        <button type="submit">Publish to Live Feed</button>
                    </form>
                </div>
            </div>`;
    }
};