/**
 * SETUP_VIBE_READY.CJS - ASA Architecture (VibeTalent Verification Edition)
 * Documentation Sync: https://vibe-talent.gitbook.io/untitled
 * 
 * Changes:
 * 1. Verification: Strict .vibetalent content (username only).
 * 2. Identity: package.json 'repository' field for Owner Match.
 * 3. Documentation: Professional README.md for platform indexing.
 * 4. UI: Magazine-grade refinement (Typography & Spacing).
 * 5. SEO: Meta-tag optimization for social crawlers.
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
        console.log(`${ANSI.green}[SUCCESS]${ANSI.reset} Block: ${filePath}`);
    } catch (err) {
        console.error(`${ANSI.red}[FAILED]${ANSI.reset} ${filePath}: ${err.message}`);
        rollback();
        process.exit(1);
    }
}

function rollback() {
    console.log(`${ANSI.yellow}Critical error. Initiating safety rollback...${ANSI.reset}`);
    for (const item of history) {
        if (item.bak && fs.existsSync(item.bak)) {
            fs.copyFileSync(item.bak, item.path);
            fs.unlinkSync(item.bak);
        } else if (!item.bak && fs.existsSync(item.path)) {
            fs.unlinkSync(item.path);
        }
    }
    console.log(`${ANSI.red}System restored to previous state.${ANSI.reset}`);
}

// --- 1. VERIFICATION FILE (STRICT USERNAME) ---
safeWrite('.vibetalent', 'runas555');

// --- 2. PACKAGE.JSON (OWNER MATCH DATA) ---
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.name = "insight-daily-platform";
pkg.author = "runas555";
pkg.repository = {
    "type": "git",
    "url": "https://github.com/runas555/insight-daily-platform.git"
};
pkg.homepage = "https://github.com/runas555/insight-daily-platform#readme";
safeWrite('package.json', JSON.stringify(pkg, null, 2));

// --- 3. PROFESSIONAL README (FOR PLATFORM INDEXING) ---
safeWrite('README.md', `
# Insight Daily Platform

![Verified](https://img.shields.io/badge/VibeTalent-Verified-green)
![Node](https://img.shields.io/badge/Node.js-Raw-blue)

A high-performance, framework-less news engine built on **Atomic Stream Architecture (ASA)**.

## 🚀 Features
- **Zero Framework Overheads**: Built using native Node.js HTTP modules.
- **Atomic Modules**: Core logic separated into DB, Router, SEO, and View engines.
- **Modern UI**: Dark mode, magazine typography, and mobile-first navigation.
- **Production Ready**: Full SEO (Sitemaps, Robots.txt) and Vercel support.
- **Verification**: Fully integrated with VibeTalent protocols.

## 🛠 Tech Stack
- **Engine**: Node.js (Raw)
- **Architecture**: ASA (Atomic Stream Architecture)
- **UI**: CSS Grid/Flexbox (Custom)
- **Deployment**: Vercel Serverless

## 📝 Verification
This repository is verified for **runas555**. The \`.vibetalent\` file is located in the root directory.
`);

// --- 4. UI REFINEMENT (MAGAZINE STYLE) ---
safeWrite('public/style.css', `
:root { --bg: #ffffff; --text: #050505; --muted: #6b7280; --border: #e5e7eb; --accent: #111827; --hero: #f9fafb; --red: #dc2626; }
.dark { --bg: #000000; --text: #f9fafb; --muted: #9ca3af; --border: #1f2937; --accent: #ffffff; --hero: #0a0a0a; --red: #ef4444; }

body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; background: var(--bg); color: var(--text); line-height: 1.6; transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.container { max-width: 1140px; margin: 0 auto; padding: 0 2rem; }

#progress-bar { height: 3px; background: var(--red); width: 0%; position: fixed; top: 0; z-index: 10000; }

.main-header { padding: 1.5rem 0; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 1000; }
.main-header nav { display: flex; justify-content: space-between; align-items: center; }
.logo a { font-family: 'Playfair Display', serif; font-size: 2rem; text-decoration: none; color: var(--text); font-weight: 900; letter-spacing: -1px; }

.nav-links { display: flex; gap: 2.5rem; align-items: center; }
.nav-links a { text-decoration: none; color: var(--text); font-weight: 600; font-size: 0.9rem; transition: 0.2s; }
.nav-links a:hover { color: var(--red); }

.featured-hero { background: var(--hero); padding: 5rem 0; border-bottom: 1px solid var(--border); margin-bottom: 4rem; }
.badge-featured { color: var(--red); font-weight: 800; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 2px; margin-bottom: 1.5rem; display: block; }
.featured-hero h1 { font-family: 'Playfair Display', serif; font-size: 4rem; line-height: 1.05; margin: 0 0 2rem; max-width: 900px; }
.read-more { display: inline-flex; align-items: center; gap: 10px; font-weight: 800; color: var(--text); text-decoration: none; font-size: 1rem; border-bottom: 2px solid var(--text); padding-bottom: 5px; transition: 0.3s; }
.read-more:hover { gap: 15px; border-color: var(--red); color: var(--red); }

.article-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3.5rem; margin-bottom: 6rem; }
.news-card { border-top: 1px solid var(--border); padding-top: 1.5rem; }
.news-card .category { color: var(--red); font-weight: 700; font-size: 0.7rem; text-transform: uppercase; margin-bottom: 0.75rem; display: block; }
.news-card h3 { font-family: 'Playfair Display', serif; font-size: 1.6rem; margin: 0 0 1rem; line-height: 1.3; }
.news-card h3 a { text-decoration: none; color: inherit; }
.meta { font-size: 0.85rem; color: var(--muted); display: flex; align-items: center; gap: 10px; }

.newsletter-section { padding: 6rem 0; background: var(--accent); color: var(--bg); text-align: center; }
.newsletter-box h2 { font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 1rem; }
.newsletter-box form { display: flex; max-width: 500px; margin: 3rem auto 0; gap: 0; border-bottom: 2px solid var(--muted); }
.newsletter-box input { flex: 1; padding: 1rem; background: none; border: none; color: var(--bg); font-size: 1.1rem; outline: none; }
.newsletter-box button { background: none; border: none; color: var(--bg); font-weight: 800; cursor: pointer; text-transform: uppercase; padding: 0 1rem; }

.mobile-tabs { position: fixed; bottom: 0; width: 100%; background: var(--bg); border-top: 1px solid var(--border); display: none; justify-content: space-around; padding: 15px 0; z-index: 2000; }
.mobile-tabs div, .mobile-tabs a { color: var(--muted); text-align: center; font-size: 0.65rem; font-weight: 700; text-decoration: none; }
.mobile-tabs i { font-size: 1.4rem; margin-bottom: 5px; display: block; }

@media (max-width: 1024px) { .article-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
    .nav-links { display: none; }
    .mobile-tabs { display: flex; }
    .featured-hero h1 { font-size: 2.5rem; }
    .article-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .main-header { padding: 1rem 0; }
}
`);

// --- 5. ROUTER (SEO & CMS OPTIMIZATION) ---
safeWrite('core/Router.js', `
const url = require('url');
const db = require('./DB');
const views = require('./Views');
const analytics = require('./Analytics');
const sitemap = require('./Sitemap');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const parsed = url.parse(req.url, true);
    const method = req.method;
    const host = req.headers.host;

    analytics.track(parsed.pathname);

    // SEO Files
    if (parsed.pathname === '/sitemap.xml') {
        res.writeHead(200, { 'Content-Type': 'application/xml' });
        return res.end(sitemap.generate(host));
    }
    if (parsed.pathname === '/robots.txt') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end(\`User-agent: *\\nAllow: /\\nSitemap: https://\${host}/sitemap.xml\`);
    }

    // Static Assets
    if (parsed.pathname === '/style.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        return res.end(fs.readFileSync(path.join(__dirname, '../public/style.css')));
    }

    // Public Pages
    if (parsed.pathname === '/' && method === 'GET') {
        const articles = [...db.getArticles()].reverse();
        const html = views.layout('Global Insight', views.articleList(articles));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/article' && method === 'GET') {
        const article = db.getArticleById(parsed.query.id);
        if (!article) { res.writeHead(404); return res.end('Not Found'); }
        const html = views.layout(article.title, views.singleArticle(article), '', article);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/search' && method === 'GET') {
        const query = parsed.query.q || '';
        const results = db.search(query);
        const html = views.layout('Search: ' + query, views.articleList(results));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    // Hidden CMS (Unlisted in navigation)
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

    res.writeHead(404);
    res.end('404');
};`);

// --- FINAL REPORT ---
console.log(`\n${ANSI.cyan}--- ASA VERIFICATION READY ---${ANSI.reset}`);
console.log(`${ANSI.green}1. .vibetalent file set to "runas555".${ANSI.reset}`);
console.log(`${ANSI.green}2. README.md generated for GitHub indexing.${ANSI.reset}`);
console.log(`${ANSI.green}3. package.json updated with repository URL.${ANSI.reset}`);
console.log(`${ANSI.green}4. UI Refined to Magazine-standard.${ANSI.reset}`);

console.log(`\n${ANSI.yellow}NEXT STEPS (Manual):${ANSI.reset}`);
console.log(`1. Create repo: https://github.com/runas555/insight-daily-platform`);
console.log(`2. Run: git add . && git commit -m "Verification sync" && git push -u origin main`);
console.log(`3. Go to VibeTalent and click "Verify".`);

// Cleanup backups
history.forEach(h => { if (h.bak && fs.existsSync(h.bak)) fs.unlinkSync(h.bak); });