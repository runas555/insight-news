
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <header>
        <nav class="desktop-nav">
            <div class="logo"><i class="fas fa-bolt"></i> ASA NEWS</div>
            <div class="nav-actions">
                <form action="/search" method="GET" class="search-box">
                    <input name="q" placeholder="Search news...">
                </form>
                <ul><li><a href="/">Home</a></li><li><a href="/admin">Admin</a></li></ul>
            </div>
        </nav>
    </header>
    <main>${content}</main>
    <div class="mobile-tabs">
        <a href="/"><i class="fas fa-home"></i><span>Home</span></a>
        <a href="/search"><i class="fas fa-search"></i><span>Search</span></a>
        <a href="/admin"><i class="fas fa-user-shield"></i><span>Admin</span></a>
    </div>
</body>
</html>`;
    },
    articleList(articles) {
        if (articles.length === 0) return '<p>No articles found.</p>';
        return articles.map(a => `
            <article class="card">
                <div class="badge">${a.category}</div>
                <h2>${a.title}</h2>
                <p>${a.content.substring(0, 120)}...</p>
                <div class="meta">
                    <span><i class="far fa-calendar"></i> ${a.date}</span>
                </div>
                <a href="/article?id=${a.id}" class="btn">Read Article</a>
            </article>`).join('');
    },
    singleArticle(a) {
        return `
            <div class="full-article">
                <a href="/" class="back-link"><i class="fas fa-arrow-left"></i> Back to feed</a>
                <h1>${a.title}</h1>
                <div class="meta"><span>${a.date}</span> | <span>${a.category}</span></div>
                <div class="content">${a.content}</div>
            </div>`;
    },
    adminPanel() {
        return `
            <section class="admin-form">
                <h1><i class="fas fa-edit"></i> Create News</h1>
                <form action="/api/add" method="POST">
                    <input name="title" placeholder="Article Title" required>
                    <textarea name="content" rows="10" placeholder="Write your story..." required></textarea>
                    <input name="category" placeholder="Category (e.g. World, Tech)">
                    <button type="submit" class="btn-submit">Publish Now</button>
                </form>
            </section>`;
    }
};