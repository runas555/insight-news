
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
    <title>${title} | ASA News</title>
    ${seoTags}
    ${headContent}
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header>
        <nav class="desktop-nav">
            <div class="logo"><a href="/"><i class="fas fa-bolt"></i> ASA NEWS</a></div>
            <div class="nav-actions">
                <form action="/search" method="GET" class="search-box">
                    <input name="q" placeholder="Explore stories...">
                </form>
                <ul>
                    <li><a href="/">Feed</a></li>
                    <li><a href="/admin">Admin</a></li>
                    <li><a href="/admin/stats">Analytics</a></li>
                </ul>
            </div>
        </nav>
    </header>
    <main class="fade-in">${content}</main>
    <div class="mobile-tabs">
        <a href="/"><i class="fas fa-home"></i><span>Home</span></a>
        <a href="/search"><i class="fas fa-search"></i><span>Search</span></a>
        <a href="/admin/stats"><i class="fas fa-chart-line"></i><span>Stats</span></a>
        <a href="/admin"><i class="fas fa-plus-circle"></i><span>Post</span></a>
    </div>
</body>
</html>`;
    },
    articleList(articles) {
        if (articles.length === 0) return '<div class="no-results"><h3>No stories found.</h3><p>Try different keywords.</p></div>';
        return `
            <div class="category-pills">
                <a href="/" class="pill">All</a>
                <a href="/search?q=Tech" class="pill">Tech</a>
                <a href="/search?q=Design" class="pill">Design</a>
                <a href="/search?q=World" class="pill">World</a>
            </div>
            <div class="grid">
                ${articles.map(a => `
                <article class="card">
                    <div class="card-content">
                        <span class="badge">${a.category}</span>
                        <h2>${a.title}</h2>
                        <p>${a.content.substring(0, 120)}...</p>
                        <div class="meta">
                            <span><i class="far fa-calendar-alt"></i> ${a.date}</span>
                            <a href="/article?id=${a.id}" class="read-btn">Read <i class="fas fa-chevron-right"></i></a>
                        </div>
                    </div>
                </article>`).join('')}
            </div>`;
    },
    statsPage(stats) {
        const rows = Object.entries(stats).map(([url, count]) => `
            <tr>
                <td><code>${url}</code></td>
                <td><span class="count-tag">${count} views</span></td>
            </tr>
        `).join('');
        return `
            <section class="admin-stats">
                <h1><i class="fas fa-chart-bar"></i> Platform Analytics</h1>
                <table class="stats-table">
                    <thead><tr><th>Route Path</th><th>Traffic</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
                <a href="/admin" class="btn">Return to Editor</a>
            </section>`;
    },
    singleArticle(a) {
        return `
            <div class="full-article">
                <header class="art-header">
                    <a href="/" class="back-link"><i class="fas fa-arrow-left"></i> Feed</a>
                    <span class="badge">${a.category}</span>
                    <h1>${a.title}</h1>
                    <div class="meta-line">Published on <strong>${a.date}</strong></div>
                </header>
                <div class="content-body">${a.content}</div>
            </div>`;
    },
    adminPanel() {
        return `
            <section class="admin-form fade-in">
                <div class="form-header">
                    <h1><i class="fas fa-feather-alt"></i> Write News</h1>
                    <p>Standardized ASA Publishing Engine</p>
                </div>
                <form action="/api/add" method="POST">
                    <div class="input-group">
                        <label>Title</label>
                        <input name="title" placeholder="Catchy headline" required>
                    </div>
                    <div class="input-group">
                        <label>Category</label>
                        <select name="category">
                            <option value="Tech">Tech</option>
                            <option value="World">World</option>
                            <option value="Design">Design</option>
                            <option value="Business">Business</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Body Content</label>
                        <textarea name="content" rows="12" placeholder="Tell the world..." required></textarea>
                    </div>
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-paper-plane"></i> Publish to Feed
                    </button>
                </form>
            </section>`;
    }
};