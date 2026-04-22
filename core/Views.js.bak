
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
</head>
<body>
    <div id="progress-bar"></div>
    <header class="main-header">
        <nav class="container">
            <div class="logo"><a href="/">Insight<span>Daily</span></a></div>
            <div class="nav-links">
                <a href="/search?q=Technology">Technology</a>
                <a href="/search?q=Culture">Culture</a>
                <a href="/search?q=Business">Business</a>
                <div class="search-trigger" onclick="document.querySelector('.search-overlay').style.display='flex'">
                    <i class="fas fa-search"></i>
                </div>
            </div>
        </nav>
    </header>

    <div class="search-overlay">
        <div class="close-search" onclick="document.querySelector('.search-overlay').style.display='none'">&times;</div>
        <form action="/search" method="GET">
            <input name="q" placeholder="What are you looking for?" autofocus>
        </form>
    </div>

    <main class="container fade-in">${content}</main>

    <footer class="main-footer">
        <div class="container">
            <p>&copy; 2024 Insight Daily. Professional Journalism.</p>
        </div>
    </footer>

    <div class="mobile-tabs">
        <a href="/"><i class="fas fa-newspaper"></i><span>Feed</span></a>
        <a href="/search?q=Tech"><i class="fas fa-microchip"></i><span>Tech</span></a>
        <a href="/search?q=World"><i class="fas fa-globe-americas"></i><span>World</span></a>
        <div onclick="document.querySelector('.search-overlay').style.display='flex'"><i class="fas fa-search"></i><span>Search</span></div>
    </div>

    <script>
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
        
        // Highlight first article as "Featured"
        const featured = articles[0];
        const rest = articles.slice(1);

        return `
            <section class="featured-hero">
                <div class="badge-featured">Featured Story</div>
                <h1>${featured.title}</h1>
                <p>${featured.content.substring(0, 180)}...</p>
                <a href="/article?id=${featured.id}" class="read-more">Full Story <i class="fas fa-arrow-right"></i></a>
            </section>

            <div class="section-title">Latest Updates</div>
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
                        By Editor &bull; ${a.date} &bull; ${Math.ceil(a.content.length / 500)} min read
                    </div>
                </header>
                <div class="article-content">${a.content.replace(/\n/g, '<br><br>')}</div>
                <div class="share-box">
                    <span>Share:</span>
                    <i class="fab fa-twitter"></i>
                    <i class="fab fa-facebook"></i>
                    <i class="fas fa-link"></i>
                </div>
            </article>`;
    },
    adminPanel() {
        return `
            <section class="portal-box">
                <h1>Publishing Portal</h1>
                <form action="/api/add" method="POST">
                    <input name="title" placeholder="Story Headline" required>
                    <select name="category">
                        <option>Technology</option><option>Culture</option><option>Business</option><option>Design</option>
                    </select>
                    <textarea name="content" rows="15" placeholder="Content starts here..." required></textarea>
                    <button type="submit">Deploy Article</button>
                </form>
            </section>`;
    }
};