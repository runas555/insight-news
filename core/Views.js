
const seo = require('./SEO');

module.exports = {
    layout(title, content, headContent = '', article = null) {
        const seoTags = seo.generateTags(article);
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Insight Daily</title>
    ${seoTags}
    ${headContent}
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;800&display=swap" rel="stylesheet">
    <script>
        // Dark Mode Logic
        if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
    </script>
</head>
<body>
    <div id="progress-bar"></div>
    
    <header class="main-header">
        <nav class="container">
            <div class="logo"><a href="/">Insight<span>Daily</span></a></div>
            <div class="nav-links">
                <a href="/search?q=Technology">Technology</a>
                <a href="/search?q=Business">Business</a>
                <div class="theme-toggle" onclick="toggleTheme()">
                    <i class="fas fa-moon"></i>
                </div>
                <div class="search-trigger" onclick="toggleSearch(true)">
                    <i class="fas fa-search"></i>
                </div>
            </div>
        </nav>
    </header>

    <div class="search-overlay">
        <div class="close-search" onclick="toggleSearch(false)">&times;</div>
        <form action="/search" method="GET">
            <input name="q" id="search-input" placeholder="Search stories..." autocomplete="off">
        </form>
    </div>

    <main class="container fade-in">${content}</main>

    <section class="newsletter-section">
        <div class="container">
            <div class="newsletter-box">
                <h2>The Morning Brief</h2>
                <p>Get the most important stories delivered to your inbox every day.</p>
                <form onsubmit="subscribe(event)">
                    <input type="email" id="sub-email" placeholder="Email address" required>
                    <button type="submit">Subscribe</button>
                </form>
                <div id="sub-msg"></div>
            </div>
        </div>
    </section>

    <footer class="main-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">Insight Daily</div>
                <div class="footer-links">
                    <a href="/manage-portal">Admin Access</a>
                </div>
            </div>
            <p class="copyright">&copy; 2024 Insight Daily. Built with ASA Architecture.</p>
        </div>
    </footer>

    <div class="mobile-tabs">
        <a href="/"><i class="fas fa-home"></i><span>Home</span></a>
        <a href="/search?q=Tech"><i class="fas fa-bolt"></i><span>Trending</span></a>
        <div onclick="toggleTheme()"><i class="fas fa-adjust"></i><span>Theme</span></div>
        <div onclick="toggleSearch(true)"><i class="fas fa-search"></i><span>Search</span></div>
    </div>

    <script>
        function toggleTheme() {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }

        function toggleSearch(show) {
            const el = document.querySelector('.search-overlay');
            el.style.display = show ? 'flex' : 'none';
            if(show) document.getElementById('search-input').focus();
        }

        function subscribe(e) {
            e.preventDefault();
            const email = document.getElementById('sub-email').value;
            fetch('/api/subscribe', { method: 'POST', body: 'email=' + encodeURIComponent(email) })
                .then(() => {
                    document.getElementById('sub-msg').innerText = "You're in! Check your inbox.";
                    document.getElementById('sub-email').value = '';
                });
        }

        function copyLink() {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }

        window.onscroll = function() {
            let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrolled = (winScroll / height) * 100;
            document.getElementById("progress-bar").style.width = scrolled + "%";
        };
    </script>
</body>
</html>`;
    },
    articleList(articles) {
        if (articles.length === 0) return '<div class="empty"><h2>No stories found.</h2><a href="/">Back to Feed</a></div>';
        const featured = articles[0];
        const rest = articles.slice(1);

        return `
            <section class="featured-hero">
                <div class="badge-featured">Featured</div>
                <h1>${featured.title}</h1>
                <p>${featured.content.substring(0, 200)}...</p>
                <a href="/article?id=${featured.id}" class="read-more">Read Full Story</a>
            </section>

            <div class="article-grid">
                ${rest.map(a => `
                <article class="news-card">
                    <span class="category">${a.category}</span>
                    <h3><a href="/article?id=${a.id}">${a.title}</a></h3>
                    <div class="meta">
                        <span>${a.date}</span>
                        <span class="dot"></span>
                        <span>${Math.ceil(a.content.length / 500)} min read</span>
                    </div>
                </article>`).join('')}
            </div>`;
    },
    singleArticle(a) {
        return `
            <article class="reading-view">
                <header>
                    <span class="category-tag">${a.category}</span>
                    <h1>${a.title}</h1>
                    <div class="article-meta">
                        ${a.date} &bull; ${Math.ceil(a.content.length / 500)} min read
                    </div>
                </header>
                <div class="article-content">${a.content.replace(/\n/g, '<br><br>')}</div>
                <div class="share-box">
                    <span>Share story:</span>
                    <button onclick="copyLink()"><i class="fas fa-link"></i> Copy Link</button>
                </div>
            </article>`;
    },
    adminPanel() {
        return `
            <section class="portal-box">
                <h1>CMS Portal</h1>
                <form action="/api/add" method="POST">
                    <input name="title" placeholder="Article Headline" required>
                    <select name="category">
                        <option>Technology</option><option>Business</option><option>Culture</option>
                    </select>
                    <textarea name="content" rows="12" placeholder="Start writing..." required></textarea>
                    <button type="submit">Publish to Production</button>
                </form>
            </section>`;
    }
};