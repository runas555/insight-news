
const seo = require('./SEO');
const vibe = require('./Vibe');

module.exports = {
    layout(title, content, head = '', article = null) {
        const v = vibe.getVibeStatus();
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Insight Daily</title>
    ${seo.generateTags(article)}
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    ${head}
</head>
<body>
    <header class="main-header">
        <nav class="container">
            <div class="logo"><a href="/">Insight<span>Daily</span></a></div>
            <div class="vibe-badge"><i class="fab fa-github"></i> ${v.user}</div>
        </nav>
    </header>
    <main class="container">${content}</main>
    <div class="mobile-tabs">
        <a href="/"><i class="fas fa-newspaper"></i><span>Feed</span></a>
        <a href="/vibe"><i class="fas fa-bolt"></i><span>Vibe</span></a>
        <a href="/manage-portal"><i class="fas fa-cog"></i><span>Portal</span></a>
    </div>
</body>
</html>`;
    },
    vibeDashboard() {
        const v = vibe.getVibeStatus();
        return `
            <section class="vibe-view">
                <h1>Vibe Integration</h1>
                <div class="vibe-card">
                    <p><strong>Username:</strong> ${v.user}</p>
                    <p><strong>Sync:</strong> ${v.syncStatus}</p>
                    <p><strong>Protocol:</strong> Owner Match / Verification File</p>
                    <hr>
                    <p class="hint">VibeTalent fetches PushEvents from GitHub API. Ensure your repo is PUBLIC.</p>
                </div>
            </section>`;
    },
    articleList(articles) {
        return articles.map(a => `
            <article class="card">
                <span class="cat">${a.category}</span>
                <h3><a href="/article?id=${a.id}">${a.title}</a></h3>
                <p>${a.content.substring(0, 100)}...</p>
            </article>`).join('');
    },
    singleArticle(a) {
        return `<article class="article-view"><h1>${a.title}</h1><p>${a.content}</p></article>`;
    },
    adminPanel() {
        return `<section class="admin-panel"><form action="/api/add" method="POST"><input name="title" placeholder="Title" required><textarea name="content" required></textarea><button>Publish</button></form></section>`;
    }
};