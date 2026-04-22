/**
 * SETUP_VIBE_FIX.CJS - Final Verification & Production Sync
 * Based on: https://vibe-talent.gitbook.io/untitled
 * 
 * CRITICAL FIXES:
 * 1. .vibetalent: Strictly contains only the username "runas555" (no whitespace).
 * 2. package.json: Full metadata sync for "Owner Match" automatic verification.
 * 3. vercel.json: Optimized for zero-config deployment.
 * 4. Architecture: Cleaned up core modules for production indexing.
 */

const fs = require('fs');
const path = require('path');

const ANSI = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m"
};

const history = [];
const USERNAME = "runas555";
const REPO_NAME = "insight-daily-platform";

function safeWrite(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    try {
        if (fs.existsSync(filePath)) {
            const bak = `${filePath}.bak`;
            fs.copyFileSync(filePath, bak);
            history.push({ path: filePath, bak });
        } else {
            history.push({ path: filePath, bak: null });
        }
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`${ANSI.green}[OK]${ANSI.reset} Block: ${filePath}`);
    } catch (err) {
        console.error(`${ANSI.red}[FAIL]${ANSI.reset} ${filePath}: ${err.message}`);
        rollback();
        process.exit(1);
    }
}

function rollback() {
    console.log(`${ANSI.yellow}Reverting changes...${ANSI.reset}`);
    for (const item of history) {
        if (item.bak && fs.existsSync(item.bak)) {
            fs.copyFileSync(item.bak, item.path);
            fs.unlinkSync(item.bak);
        } else if (!item.bak && fs.existsSync(item.path)) {
            fs.unlinkSync(item.path);
        }
    }
}

// 1. VERIFICATION FILE (STRICT CONTENT)
safeWrite('.vibetalent', USERNAME);

// 2. PACKAGE.JSON (OWNER MATCH SYNC)
const pkg = {
    "name": REPO_NAME,
    "version": "1.0.0",
    "description": "High-performance news platform built with Atomic Stream Architecture",
    "main": "index.js",
    "author": USERNAME,
    "license": "MIT",
    "repository": {
        "type": "git",
        "url": `https://github.com/${USERNAME}/${REPO_NAME}.git`
    },
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js"
    },
    "dependencies": {},
    "devDependencies": {
        "nodemon": "^3.0.1"
    }
};
safeWrite('package.json', JSON.stringify(pkg, null, 2));

// 3. VERCEL CONFIG (PRODUCTION READY)
const vercel = {
    "version": 2,
    "name": REPO_NAME,
    "builds": [{ "src": "index.js", "use": "@vercel/node" }],
    "routes": [
        { "src": "/style.css", "dest": "/public/style.css" },
        { "src": "/(.*)", "dest": "index.js" }
    ]
};
safeWrite('vercel.json', JSON.stringify(vercel, null, 2));

// 4. CORE: VIEWS (SEO & UX REFINEMENT)
safeWrite('core/Views.js', `
const seo = require('./SEO');
module.exports = {
    layout(title, content, head = '', article = null) {
        return \`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>\${title} | Insight Daily</title>
    \${seo.generateTags(article)}
    \${head}
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
    <main class="container">\${content}</main>
    <div class="mobile-tabs">
        <a href="/"><i class="fas fa-home"></i><span>Home</span></a>
        <a href="/search?q=Trending"><i class="fas fa-fire"></i><span>Trending</span></a>
        <a href="/manage-portal"><i class="fas fa-cog"></i><span>Portal</span></a>
    </div>
</body>
</html>\`;
    },
    articleList(articles) {
        if (!articles.length) return '<div class="empty">No stories yet.</div>';
        const featured = articles[0];
        const rest = articles.slice(1);
        return \`
            <section class="hero">
                <span class="badge">Featured</span>
                <h1><a href="/article?id=\${featured.id}">\${featured.title}</a></h1>
                <p>\${featured.content.substring(0, 160)}...</p>
            </section>
            <div class="grid">
                \${rest.map(a => \`
                <article class="card">
                    <span class="cat">\${a.category}</span>
                    <h3><a href="/article?id=\${a.id}">\${a.title}</a></h3>
                    <div class="meta">\${a.date} &bull; \${Math.ceil(a.content.length / 500)} min read</div>
                </article>\`).join('')}
            </div>\`;
    },
    singleArticle(a) {
        return \`
            <article class="article-view">
                <header>
                    <span class="cat">\${a.category}</span>
                    <h1>\${a.title}</h1>
                    <div class="meta">By Editorial Team &bull; \${a.date}</div>
                </header>
                <div class="article-body">\${a.content.replace(/\\n/g, '<br><br>')}</div>
            </article>\`;
    },
    adminPanel() {
        return \`
            <section class="admin-panel">
                <h2>Publishing Engine</h2>
                <form action="/api/add" method="POST">
                    <input name="title" placeholder="Headline" required>
                    <input name="category" placeholder="Category">
                    <textarea name="content" rows="10" placeholder="Story content..." required></textarea>
                    <button type="submit">Deploy to Feed</button>
                </form>
            </section>\`;
    }
};`);

// 5. CORE: ROUTER (STRICT PROD LOGIC)
safeWrite('core/Router.js', `
const url = require('url');
const db = require('./DB');
const views = require('./Views');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const parsed = url.parse(req.url, true);
    const method = req.method;

    if (parsed.pathname === '/' && method === 'GET') {
        const articles = [...db.getArticles()].reverse();
        return res.end(views.layout('Home', views.articleList(articles)));
    }
    if (parsed.pathname === '/article' && method === 'GET') {
        const article = db.getArticleById(parsed.query.id);
        if (!article) return (res.writeHead(404), res.end('404'));
        return res.end(views.layout(article.title, views.singleArticle(article), '', article));
    }
    if (parsed.pathname === '/search' && method === 'GET') {
        const query = parsed.query.q || '';
        const results = db.search(query);
        return res.end(views.layout('Search: ' + query, views.articleList(results)));
    }
    if (parsed.pathname === '/manage-portal' && method === 'GET') {
        return res.end(views.layout('Portal', views.adminPanel()));
    }
    if (parsed.pathname === '/api/add' && method === 'POST') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            const p = new URLSearchParams(body);
            db.saveArticle({
                title: p.get('title'),
                content: p.get('content'),
                category: p.get('category') || 'General',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            });
            res.writeHead(302, { Location: '/' });
            res.end();
        });
        return;
    }
    if (parsed.pathname === '/style.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        return res.end(fs.readFileSync(path.join(__dirname, '../public/style.css')));
    }
    res.writeHead(404);
    res.end('Not Found');
};`);

// 6. CSS (PRODUCTION MAG STYLE)
safeWrite('public/style.css', `
:root { --bg: #fff; --text: #111; --muted: #777; --accent: #e53e3e; --border: #eee; }
body { font-family: 'Inter', sans-serif; margin: 0; background: var(--bg); color: var(--text); padding-bottom: 80px; }
.container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
.main-header { border-bottom: 1px solid var(--border); padding: 20px 0; position: sticky; top: 0; background: #fff; z-index: 100; }
.main-header nav { display: flex; justify-content: space-between; align-items: center; }
.logo a { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 900; text-decoration: none; color: #000; }
.logo span { color: var(--muted); }
.nav-links a { text-decoration: none; color: var(--text); font-weight: 600; margin-left: 25px; font-size: 0.9rem; }
.admin-dot { color: #eee !important; font-size: 0.5rem !important; }
.hero { padding: 60px 0; border-bottom: 3px solid #000; margin-bottom: 40px; }
.hero h1 { font-family: 'Playfair Display', serif; font-size: 3.5rem; margin: 10px 0; line-height: 1.1; }
.hero h1 a { text-decoration: none; color: inherit; }
.badge { color: var(--accent); text-transform: uppercase; font-weight: 800; font-size: 0.7rem; letter-spacing: 2px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 40px; }
.card { border-top: 1px solid var(--border); padding-top: 20px; }
.card h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin: 10px 0; }
.card h3 a { text-decoration: none; color: inherit; }
.cat { color: var(--accent); font-weight: 700; font-size: 0.7rem; text-transform: uppercase; }
.meta { font-size: 0.8rem; color: var(--muted); }
.article-view { max-width: 700px; margin: 60px auto; }
.article-view h1 { font-family: 'Playfair Display', serif; font-size: 3rem; line-height: 1.2; }
.article-body { font-size: 1.25rem; line-height: 1.8; margin-top: 30px; }
.admin-panel input, .admin-panel textarea { width: 100%; padding: 15px; margin-bottom: 15px; border: 1px solid var(--border); font-family: inherit; }
.admin-panel button { background: #000; color: #fff; border: none; padding: 15px 30px; font-weight: 700; cursor: pointer; }
.mobile-tabs { position: fixed; bottom: 0; width: 100%; background: #fff; border-top: 1px solid var(--border); display: none; justify-content: space-around; padding: 12px 0; }
.mobile-tabs a { text-decoration: none; color: var(--muted); font-size: 0.7rem; display: flex; flex-direction: column; align-items: center; font-weight: 700; }
.mobile-tabs i { font-size: 1.3rem; margin-bottom: 4px; }
@media (max-width: 768px) { .nav-links { display: none; } .mobile-tabs { display: flex; } .hero h1 { font-size: 2.2rem; } }
`);

// 7. CLEANUP & REPORT
history.forEach(h => { if (h.bak && fs.existsSync(h.bak)) fs.unlinkSync(h.bak); });

console.log(`\n${ANSI.cyan}--- VERIFICATION READY ---${ANSI.reset}`);
console.log(`${ANSI.green}1. .vibetalent contains EXACTLY "${USERNAME}".${ANSI.reset}`);
console.log(`${ANSI.green}2. package.json points to https://github.com/${USERNAME}/${REPO_NAME}${ANSI.reset}`);
console.log(`${ANSI.green}3. Architecture is production-indexed.${ANSI.reset}`);

console.log(`\n${ANSI.yellow}ACTION:${ANSI.reset} PUSH TO GITHUB NOW.`);
console.log(`${ANSI.white}git add . && git commit -m "Vibe sync" && git push origin main${ANSI.reset}`);