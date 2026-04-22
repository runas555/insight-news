/**
 * SETUP.CJS - The "Atomic Stream Architecture" (ASA) Generator
 * Purpose: Full production-ready news platform with Admin, SEO, and Mobile-first UI.
 * Implementation: Atomic modules, Zero frameworks, Node.js raw HTTP.
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
        console.log(`${ANSI.green}[OK]${ANSI.reset} Created/Updated: ${filePath}`);
    } catch (err) {
        console.error(`${ANSI.red}[ERROR]${ANSI.reset} Failed on ${filePath}: ${err.message}`);
        rollback();
        process.exit(1);
    }
}

function rollback() {
    console.log(`${ANSI.yellow}Initiating rollback...${ANSI.reset}`);
    for (const item of history) {
        if (item.bak && fs.existsSync(item.bak)) {
            fs.copyFileSync(item.bak, item.path);
            fs.unlinkSync(item.bak);
        } else if (!item.bak && fs.existsSync(item.path)) {
            fs.unlinkSync(item.path);
        }
    }
    console.log(`${ANSI.red}Rollback complete. System restored.${ANSI.reset}`);
}

// 1. PROJECT INITIALIZATION
const packageJson = {
    name: "atomic-news-pro",
    version: "1.0.0",
    description: "ASA Architecture Framework",
    main: "index.js",
    scripts: {
        "start": "node index.js",
        "dev": "node index.js"
    },
    engines: {
        "node": ">=14.0.0"
    }
};

safeWrite('package.json', JSON.stringify(packageJson, null, 2));

// 2. DATA LAYER (Core Module)
safeWrite('core/DB.js', `
const fs = require('fs');
const path = require('path');
const DB_FILE = path.join(__dirname, '../data/articles.json');

module.exports = {
    init() {
        if (!fs.existsSync(path.dirname(DB_FILE))) fs.mkdirSync(path.dirname(DB_FILE));
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify([
                { id: 1, title: 'Future of ASA Architecture', content: 'Node.js raw performance is key...', date: '2023-10-27', category: 'Tech' },
                { id: 2, title: 'Clean UI Design Trends', content: 'Minimalism and bottom tabs for mobile...', date: '2023-10-26', category: 'Design' }
            ]));
        }
    },
    getArticles() { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); },
    saveArticle(art) {
        const data = this.getArticles();
        art.id = Date.now();
        data.push(art);
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    }
};`);

// 3. SEO-READY VIEW ENGINE (Core Module)
safeWrite('core/Views.js', `
module.exports = {
    layout(title, content, head = '') {
        return \`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Advanced Node News Hub">
    <title>\${title} | ASA News</title>
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    \${head}
</head>
<body>
    <header>
        <nav class="desktop-nav">
            <div class="logo">ASA News</div>
            <ul><li><a href="/">Home</a></li><li><a href="/admin">Admin</a></li></ul>
        </nav>
    </header>
    <main>\${content}</main>
    <div class="mobile-tabs">
        <a href="/"><i class="fas fa-home"></i><span>Home</span></a>
        <a href="/discover"><i class="fas fa-search"></i><span>Discover</span></a>
        <a href="/admin"><i class="fas fa-user-shield"></i><span>Admin</span></a>
    </div>
</body>
</html>\`;
    },
    articleList(articles) {
        return articles.map(a => \`
            <article class="card">
                <h2>\${a.title}</h2>
                <p>\${a.content.substring(0, 100)}...</p>
                <div class="meta"><span>\${a.date}</span><span>\${a.category}</span></div>
                <a href="/article?id=\${a.id}" class="btn">Read More</a>
            </article>\`).join('');
    },
    adminPanel() {
        return \`
            <section class="admin-form">
                <h1>Post New Article</h1>
                <form action="/api/add" method="POST">
                    <input name="title" placeholder="Title" required>
                    <textarea name="content" placeholder="Content text" required></textarea>
                    <input name="category" placeholder="Category">
                    <button type="submit">Publish</button>
                </form>
            </section>\`;
    }
};`);

// 4. THE CSS (Modern & Mobile-first)
safeWrite('public/style.css', `
:root { --p: #2563eb; --s: #f8fafc; --t: #1e293b; }
body { font-family: 'Segoe UI', sans-serif; margin: 0; background: var(--s); color: var(--t); padding-bottom: 70px; }
.logo { font-weight: 800; font-size: 1.5rem; color: var(--p); }
nav { background: #fff; padding: 1rem 5%; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
nav ul { list-style: none; display: flex; gap: 20px; }
nav a { text-decoration: none; color: var(--t); font-weight: 500; }
main { padding: 2rem 5%; max-width: 1200px; margin: auto; }
.card { background: #fff; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); transition: 0.3s; }
.card:hover { transform: translateY(-3px); }
.meta { display: flex; gap: 15px; color: #64748b; font-size: 0.85rem; margin: 1rem 0; }
.btn { display: inline-block; background: var(--p); color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; }
.mobile-tabs { position: fixed; bottom: 0; width: 100%; background: #fff; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-around; padding: 10px 0; display: none; }
.mobile-tabs a { text-decoration: none; color: #64748b; display: flex; flex-direction: column; align-items: center; font-size: 0.75rem; }
.mobile-tabs a i { font-size: 1.25rem; margin-bottom: 4px; }
.admin-form form { display: flex; flex-direction: column; gap: 1rem; }
.admin-form input, textarea { padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 1rem; }
@media (max-width: 768px) {
    .desktop-nav { display: none; }
    .mobile-tabs { display: flex; }
}`);

// 5. SERVER LOGIC (Core Module)
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
        const articles = db.getArticles();
        const html = views.layout('Global News', views.articleList(articles));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/admin' && method === 'GET') {
        const html = views.layout('Admin Console', views.adminPanel());
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/api/add' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const params = new URLSearchParams(body);
            db.saveArticle({
                title: params.get('title'),
                content: params.get('content'),
                category: params.get('category'),
                date: new Date().toISOString().split('T')[0]
            });
            res.writeHead(302, { Location: '/' });
            res.end();
        });
        return;
    }

    if (parsed.pathname === '/style.css') {
        const css = fs.readFileSync(path.join(__dirname, '../public/style.css'));
        res.writeHead(200, { 'Content-Type': 'text/css' });
        return res.end(css);
    }

    res.writeHead(404);
    res.end('Not Found');
};`);

// 6. MAIN ENTRY POINT
safeWrite('index.js', `
const http = require('http');
const db = require('./core/DB');
const router = require('./core/Router');

const PORT = process.env.PORT || 3000;

db.init();

const server = http.createServer(async (req, res) => {
    try {
        await router(req, res);
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end('ASA System Error');
    }
});

server.listen(PORT, () => {
    console.log('--- ASA News Platform ---');
    console.log('Status: ACTIVE');
    console.log('URL: http://localhost:' + PORT);
});`);

// 7. VERCEL CONFIG
safeWrite('vercel.json', JSON.stringify({
    version: 2,
    builds: [{ src: "index.js", use: "@vercel/node" }],
    routes: [{ src: "/(.*)", dest: "index.js" }]
}, null, 2));

// FINALIZING
console.log(`${ANSI.cyan}Cleaning legacy backup files...${ANSI.reset}`);
history.forEach(h => {
    if (h.bak && fs.existsSync(h.bak)) fs.unlinkSync(h.bak);
});

console.log(`${ANSI.green}Deployment construction successful.${ANSI.reset}`);
console.log(`${ANSI.yellow}Starting development node...${ANSI.reset}`);

execSync('npm run dev', { stdio: 'inherit' });