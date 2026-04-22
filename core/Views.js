
const seo = require('./SEO');
module.exports = {
    layout(title, content, head = '', article = null) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Insight Daily</title>
    ${seo.generateTags(article)}
    ${head}
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
</head>
<body>
    <header class="main-header">
        <nav class="container">
            <div class="logo"><a href="/">Insight<span>Daily</span></a></div>
            <div class="nav-links">
                <a href="/search?q=Tech">Tech</a>
                <a href="/search?q=Business">Business</a>
                <a href="/manage-portal" class="admin-dot"><i class="fas fa-circle"></i></a>
            </div>
        </nav>
    </header>
    <main class="container">${content}</main>
    <div class="mobile-tabs">
        <a href="/"><i class="fas fa-home"></i><span>Home</span></a>
        <a href="/search?q=Trending"><i class="fas fa-fire"></i><span>Trending</span></a>
        <a href="/manage-portal"><i class="fas fa-cog"></i><span>Portal</span></a>
    </div>
</body>
</html>`;
    },
    articleList(articles) {
        if (!articles.length) return '<div class="empty">No stories yet.</div>';
        const featured = articles[0];
        const rest = articles.slice(1);
        return `
            <section class="hero">
                <span class="badge">Featured</span>
                <h1><a href="/article?id=${featured.id}">${featured.title}</a></h1>
                <p>${featured.content.substring(0, 160)}...</p>
            </section>
            <div class="grid">
                ${rest.map(a => `
                <article class="card">
                    <span class="cat">${a.category}</span>
                    <h3><a href="/article?id=${a.id}">${a.title}</a></h3>
                    <div class="meta">${a.date} &bull; ${Math.ceil(a.content.length / 500)} min read</div>
                </article>`).join('')}
            </div>`;
    },
    singleArticle(a) {
        return `
            <article class="article-view">
                <header>
                    <span class="cat">${a.category}</span>
                    <h1>${a.title}</h1>
                    <div class="meta">By Editorial Team &bull; ${a.date}</div>
                </header>
                <div class="article-body">${a.content.replace(/\n/g, '<br><br>')}</div>
            </article>`;
    },
    adminPanel() {
        return `
            <section class="admin-panel">
                <h2>Publishing Engine</h2>
                <form action="/api/add" method="POST">
                    <input name="title" placeholder="Headline" required>
                    <input name="category" placeholder="Category">
                    <textarea name="content" rows="10" placeholder="Story content..." required></textarea>
                    <button type="submit">Deploy to Feed</button>
                </form>
            </section>`;
    }
};