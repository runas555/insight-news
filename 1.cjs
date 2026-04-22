/**
 * SETUP_REFINED.CJS - ASA Architecture (Clean User Edition)
 * Focus: User-centric UI, Hidden Admin, High Performance, Modern Typography.
 * Changes: Removed Admin links from navigation, added Reading Time, Featured News, and SEO optimization.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ANSI = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m"
};

const history = [];

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
        console.log(`${ANSI.green}[CLEAN]${ANSI.reset} Updated: ${filePath}`);
    } catch (err) {
        rollback();
        process.exit(1);
    }
}

function rollback() {
    for (const item of history) {
        if (item.bak && fs.existsSync(item.bak)) {
            fs.copyFileSync(item.bak, item.path);
            fs.unlinkSync(item.bak);
        } else if (!item.bak && fs.existsSync(item.path)) {
            fs.unlinkSync(item.path);
        }
    }
}

// --- 1. CORE: VIEWS (USER-FIRST INTERFACE) ---
// Note: We removed Admin/Stats from nav for clean UX. Admin is still accessible via /manage-portal
safeWrite('core/Views.js', `
const seo = require('./SEO');

module.exports = {
    layout(title, content, headContent = '', article = null) {
        const seoTags = seo.generateTags(article);
        return \`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>\${title} | Insight Daily</title>
    \${seoTags}
    \${headContent}
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

    <main class="container fade-in">\${content}</main>

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
</html>\`;
    },
    articleList(articles) {
        if (articles.length === 0) return '<div class="empty"><h2>No stories found.</h2><a href="/">Back to Feed</a></div>';
        
        // Highlight first article as "Featured"
        const featured = articles[0];
        const rest = articles.slice(1);

        return \`
            <section class="featured-hero">
                <div class="badge-featured">Featured Story</div>
                <h1>\${featured.title}</h1>
                <p>\${featured.content.substring(0, 180)}...</p>
                <a href="/article?id=\${featured.id}" class="read-more">Full Story <i class="fas fa-arrow-right"></i></a>
            </section>

            <div class="section-title">Latest Updates</div>
            <div class="article-grid">
                \${rest.map(a => \`
                <article class="news-card">
                    <span class="category">\${a.category}</span>
                    <h3><a href="/article?id=\${a.id}">\${a.title}</a></h3>
                    <div class="meta">
                        <span>\${a.date}</span>
                        <span class="dot"></span>
                        <span>\${Math.ceil(a.content.length / 500)} min read</span>
                    </div>
                </article>\`).join('')}
            </div>\`;
    },
    singleArticle(a) {
        return \`
            <article class="reading-view">
                <header>
                    <span class="category-tag">\${a.category}</span>
                    <h1>\${a.title}</h1>
                    <div class="article-meta">
                        By Editor &bull; \${a.date} &bull; \${Math.ceil(a.content.length / 500)} min read
                    </div>
                </header>
                <div class="article-content">\${a.content.replace(/\\n/g, '<br><br>')}</div>
                <div class="share-box">
                    <span>Share:</span>
                    <i class="fab fa-twitter"></i>
                    <i class="fab fa-facebook"></i>
                    <i class="fas fa-link"></i>
                </div>
            </article>\`;
    },
    adminPanel() {
        return \`
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
            </section>\`;
    }
};`);

// --- 2. CORE: ROUTER (HIDDEN ADMIN) ---
safeWrite('core/Router.js', `
const url = require('url');
const db = require('./DB');
const views = require('./Views');
const analytics = require('./Analytics');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const parsed = url.parse(req.url, true);
    const method = req.method;

    analytics.track(parsed.pathname);

    // PUBLIC ROUTES
    if (parsed.pathname === '/' && method === 'GET') {
        const articles = [...db.getArticles()].reverse();
        const html = views.layout('Fresh Feed', views.articleList(articles));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/article' && method === 'GET') {
        const article = db.getArticleById(parsed.query.id);
        if (!article) { res.writeHead(404); return res.end('404'); }
        const html = views.layout(article.title, views.singleArticle(article), '', article);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/search' && method === 'GET') {
        const query = parsed.query.q || '';
        const results = db.search(query);
        const html = views.layout('Explore: ' + query, views.articleList(results));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    // HIDDEN ADMIN ROUTE (For developers/admins only)
    if (parsed.pathname === '/manage-portal' && method === 'GET') {
        const html = views.layout('CMS Access', views.adminPanel());
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/api/add' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const p = new URLSearchParams(body);
            db.saveArticle({
                title: p.get('title'),
                content: p.get('content'),
                category: p.get('category'),
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
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

// --- 3. THE CSS (MAGAZINE STYLE) ---
safeWrite('public/style.css', `
:root { --accent: #000; --text: #1a1a1a; --muted: #717171; --bg: #fff; --gap: 2rem; }
* { box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; margin: 0; color: var(--text); background: var(--bg); -webkit-font-smoothing: antialiased; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }

#progress-bar { height: 3px; background: var(--accent); width: 0%; position: fixed; top: 0; z-index: 9999; }

.main-header { padding: 1.5rem 0; border-bottom: 1px solid #eee; position: sticky; top: 0; background: #fff; z-index: 100; }
.main-header nav { display: flex; justify-content: space-between; align-items: center; }
.logo a { font-family: 'Playfair Display', serif; font-size: 1.8rem; text-decoration: none; color: #000; font-weight: 700; }
.logo span { color: #888; }
.nav-links { display: flex; align-items: center; gap: 2rem; }
.nav-links a { text-decoration: none; color: var(--text); font-weight: 500; font-size: 0.95rem; }
.search-trigger { cursor: pointer; color: var(--muted); }

.featured-hero { padding: 4rem 0; border-bottom: 4px solid #000; margin-bottom: 3rem; }
.badge-featured { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; color: #d00; }
.featured-hero h1 { font-family: 'Playfair Display', serif; font-size: 3.5rem; line-height: 1.1; margin: 0 0 1.5rem; }
.featured-hero p { font-size: 1.2rem; color: var(--muted); max-width: 700px; margin-bottom: 2rem; }
.read-more { font-weight: 800; color: #000; text-decoration: none; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 4px; }

.section-title { font-weight: 800; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; color: #888; margin-bottom: 2rem; }
.article-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 3rem; margin-bottom: 4rem; }
.news-card { display: flex; flex-direction: column; }
.news-card .category { font-size: 0.75rem; font-weight: 700; color: #d00; text-transform: uppercase; margin-bottom: 0.5rem; }
.news-card h3 { margin: 0 0 1rem; font-family: 'Playfair Display', serif; font-size: 1.5rem; }
.news-card h3 a { text-decoration: none; color: inherit; }
.news-card .meta { font-size: 0.85rem; color: var(--muted); display: flex; align-items: center; gap: 8px; }
.dot { height: 4px; width: 4px; background: #ccc; border-radius: 50%; }

.reading-view { max-width: 700px; margin: 4rem auto; }
.reading-view h1 { font-family: 'Playfair Display', serif; font-size: 3rem; margin-bottom: 1.5rem; }
.article-content { font-family: 'Inter', sans-serif; font-size: 1.25rem; line-height: 1.8; color: #333; }
.category-tag { font-weight: 800; text-transform: uppercase; font-size: 0.8rem; color: #d00; }

.search-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 2000; display: none; align-items: center; justify-content: center; }
.search-overlay input { font-size: 3rem; border: none; outline: none; border-bottom: 4px solid #000; width: 80%; font-family: 'Playfair Display', serif; }
.close-search { position: absolute; top: 40px; right: 40px; font-size: 3rem; cursor: pointer; }

.mobile-tabs { position: fixed; bottom: 0; width: 100%; background: #fff; border-top: 1px solid #eee; padding: 12px 0; display: none; justify-content: space-around; z-index: 1000; }
.mobile-tabs a, .mobile-tabs div { color: var(--muted); display: flex; flex-direction: column; align-items: center; font-size: 0.7rem; font-weight: 600; text-decoration: none; }
.mobile-tabs i { font-size: 1.3rem; margin-bottom: 4px; }

.portal-box { background: #f9f9f9; padding: 3rem; border-radius: 8px; }
.portal-box input, .portal-box select, .portal-box textarea { width: 100%; margin-bottom: 1rem; padding: 1rem; border: 1px solid #ddd; font-family: inherit; }
.portal-box button { background: #000; color: #fff; border: none; padding: 1rem 2rem; font-weight: 700; cursor: pointer; }

@media (max-width: 768px) {
    .nav-links { display: none; }
    .featured-hero h1 { font-size: 2.2rem; }
    .mobile-tabs { display: flex; }
    .main-header { padding: 1rem 0; }
    .reading-view h1 { font-size: 2rem; }
}
`);

// --- 4. DATA SEEDING (FOR CLEAN LOOK) ---
safeWrite('data/articles.json', JSON.stringify([
    {
        id: 1700000000000,
        title: "The Silent Revolution of Human-Centric Minimalist Design",
        content: "In the age of information overload, the most powerful thing a brand can offer is silence. Clean lines, intentional white space, and the removal of the 'noise' that has come to define the modern internet experience. We explore how minimalism is becoming a functional necessity rather than just an aesthetic choice.",
        category: "Culture",
        date: "October 28"
    },
    {
        id: 1700000000001,
        title: "Why ASA is the Future of Server-Side Performance",
        content: "Atomic Stream Architecture focuses on raw, zero-overhead delivery of content. By bypassing heavy frameworks and focusing on the core HTTP module, developers can achieve sub-10ms response times globally. This shift marks a return to the foundational roots of the web.",
        category: "Technology",
        date: "October 27"
    }
], null, 2));

// --- 5. EXECUTION ---
console.log(`${ANSI.cyan}Refining User Experience...${ANSI.reset}`);
console.log(`${ANSI.yellow}Admin hidden at /manage-portal for security.${ANSI.reset}`);

try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts.dev = "nodemon index.js";
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

    console.log(`${ANSI.green}Build Finalized. Running with Nodemon...${ANSI.reset}`);
    execSync('npm run dev', { stdio: 'inherit' });
} catch (e) {
    console.log("Run: npm run dev");
}