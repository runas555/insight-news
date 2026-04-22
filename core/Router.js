
const url = require('url');
const db = require('./DB');
const views = require('./Views');
const fs = require('fs');
const path = require('path');

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";const checkAuth = (req) => (req.headers.cookie || '').includes('auth=asa-admin');

module.exports = async(req, res) => {
    const parsed = url.parse(req.url, true);
    const analytics = require('./Analytics');
    const sitemap = require('./Sitemap');
    const isStatic = parsed.pathname.includes('.');
    if (!isStatic && !parsed.pathname.startsWith('/api')) {
        analytics.track(parsed.pathname);
    }
    const method = req.method;// PERFORMANCE: Cache-Control for Static Files
    if (parsed.pathname === '/style.css') {
        res.writeHead(200, { 
            'Content-Type': 'text/css',
            'Cache-Control': 'public, max-age=31536000' 
        });
        const cssPath = path.join(__dirname, '../public/style.css');
        if (fs.existsSync(cssPath)) return res.end(fs.readFileSync(cssPath));
        res.end('');}

    // PUBLIC PAGES
    if (parsed.pathname === '/' && method === 'GET') {
        const articles = [...db.getArticles()].reverse();
        return res.end(views.layout('Latest News', views.articleList(articles)));
    }

    if (parsed.pathname === '/article' && method === 'GET') {
        const article = db.getArticleById(parsed.query.id);
        if (!article) return (res.writeHead(404), res.end('404'));
        
        // RECOMMENDATION ENGINE: Get 3 other articles
        const related = db.getArticles()
            .filter(a => a.id != article.id)
            .slice(-3);

        return res.end(views.layout(article.title, views.singleArticle(article, related), '', article));
    }

    if (parsed.pathname === '/sitemap.xml') {
        res.writeHead(200, { 'Content-Type': 'application/xml' });
        return res.end(sitemap.generate(req.headers.host));
    }

    if (parsed.pathname === '/search' && method === 'GET'){
        const query = parsed.query.q || '';
        const results = db.search(query);
        return res.end(views.layout('Search: ' + query, views.articleList(results)));
    }

    // PROTECTED ADMIN
    if (parsed.pathname === '/robots.txt') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('User-agent: *\nAllow: /\nSitemap: https://' + req.headers.host + '/sitemap.xml');
    }

    if (parsed.pathname === '/admin' && method === 'GET') {
        if (!checkAuth(req)) return res.end(views.layout('Login', views.adminLogin()));
        const stats = analytics.getStats();return res.end(views.layout('Admin', views.adminPanel('', stats)));
    }if (parsed.pathname === '/api/login' && method === 'POST') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            const p = new URLSearchParams(body);
            if (p.get('user') === ADMIN_USER && p.get('pass') === ADMIN_PASS){
                res.writeHead(302, { 'Set-Cookie': 'auth=asa-admin; Path=/; HttpOnly', 'Location': '/admin' });
            } else {
                res.writeHead(302, { 'Location': '/admin?error=1' });
            }
            res.end();
        });
        return;
    }

    if (parsed.pathname === '/api/add' && method === 'POST') {let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            const p = new URLSearchParams(body);
            
            // Security Check
            if (!checkAuth(req)) {
                return res.end(views.layout('Login', views.adminLogin('Unauthorized access')));
            }db.saveArticle({
                title: p.get('title'),
                content: p.get('content'),
                category: p.get('category') || 'General',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            });
            res.writeHead(302, { Location: '/' });
            res.end();
        });
        return;
    }

    res.writeHead(404);
    res.end('404 Not Found');
};